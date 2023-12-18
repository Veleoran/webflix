import jwt from 'jsonwebtoken';
import Cookies from "cookies";
import { enableA2FByUsername } from '../repository/UserRepository.js'
import QRCode from 'qrcode';
import { authenticator }from 'otplib';

export function enable(req, res) {   

    
    QRCode.toDataURL(authenticator.keyuri(req.user, 'WebFlix', process.env.A2F_SECRET), (err, url) => {
        if (err) res.redirect('/');
        res.render('2fa-qrcode/index', { 
            qr: url, 
            account: `WebFlix`,
            key: process.env.A2F_SECRET
        });
        // passe le statut A2F à true en BDD pour l'utilisateur
        enableA2FByUsername(req.user);
    }); 
}

export function form(req, res) { 
    if(req.session.a2f != undefined && req.session.a2f) {
        return res.redirect('/admin/index')
    }
    res.render('2fa-form/index'); 
}
export function valid(req, res) {
    try {
        const user = req.session.tempUser;
        console.log("Session tempUser avant 2FA:", req.session.tempUser);
        console.log("Code 2FA soumis:", req.body.number_2fa);
        console.log("Objet user:", user);

        if (!user || !user.username) {
            console.error("Erreur: Objet user invalide ou manquant");
            return res.render('2fa-form/index', { statut: 'error' });
        }

        const isValid = authenticator.check(req.body.number_2fa, process.env.A2F_SECRET);
        console.log("Résultat de la validation 2FA:", isValid);

        if (isValid) {
            let accessToken = jwt.sign({ username: user.username, a2f: user.a2f }, process.env.JWT_SECRET, { expiresIn: 604800 });
            new Cookies(req, res).set('jwt', accessToken, { httpOnly: true, secure: (process.env.APP_ENV === 'production') });
            req.flash('notify', 'Vous êtes maintenant connecté');
            res.redirect('/admin/index');
        } else {
            res.render('2fa-form/index', { statut: 'error' });
        }
    } catch (err) {
        console.error("Erreur lors de la validation 2FA:", err);
        res.render('2fa-form/index', { statut: 'error' });
    }
}
