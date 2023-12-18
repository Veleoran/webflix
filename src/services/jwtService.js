import jwt from 'jsonwebtoken';
import Cookies from "cookies";

export function userExists(req, res, next) {
    let token = new Cookies(req, res).get('jwt');
    console.log("Token récupéré du cookie dans userExists:", token);

    if (token == null) {
        req.user = null;
        console.log("Aucun token JWT présent dans le cookie");
        next();
    } else {
        jwt.verify(token, process.env.JWT_SECRET, (err, dataJwt) => {
            if (err) {
                req.user = null;
                console.log("JWT verification error:", err);
            } else {
                req.user = dataJwt.username;
                res.locals.username = req.user;
                console.log("JWT verified successfully for user:", req.user);
            }
            next();
        });
    }
}

export function controlJWT(req, res, next) {
    let token = new Cookies(req, res).get('jwt');
    console.log("Token récupéré du cookie dans controlJWT:", token);

    if (token == null) {
        return res.sendStatus(401).end();
    } else {
        jwt.verify(token, process.env.JWT_SECRET, (err, dataJwt) => {
            if (err) {
                console.log("JWT verification error in controlJWT:", err);
                return res.sendStatus(403).end();
            } else {
                if (req.session.a2f != undefined && req.session.a2f) {
                    console.log("A2F is valid, proceeding for user:", req.user);
                    next();
                } else if (dataJwt.a2f) {
                    console.log("A2F is enabled but not verified, redirecting to 2FA page for user:", req.user);
                    return res.redirect('/2fa-valid');
                } else {
                    req.user = dataJwt.username;
                    console.log("JWT check passed for user:", req.user);
                    next();
                }
            }
        });
    }
}