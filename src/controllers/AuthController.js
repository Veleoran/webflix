import bcrypt from 'bcryptjs';
import { selectByUsername } from "../repository/UserRepository.js";
import jwt from 'jsonwebtoken';
import Cookies from "cookies";

export function get(req, res) {
    res.render('auth');
}

export async function post(req, res) {
    const { username, password } = req.body;

    try {
        const user = await selectByUsername(username);
        if (!user) {
            return res.status(404).json('Aucun compte n\'existe avec cet identifiant.');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(403).json('Échec d\'identification.');
        }

        req.session.tempUser = user; 
        if (user.a2f) {
            return res.redirect('/2fa-valid');
        } else {
            const accessToken = jwt.sign({ username: user.username, a2f: user.a2f }, process.env.JWT_SECRET, { expiresIn: '7d' });
            new Cookies(req, res).set('jwt', accessToken, { httpOnly: true, secure: (process.env.APP_ENV === 'production') });
            req.flash('notify', 'Vous êtes maintenant connecté');
            return res.redirect('/admin');
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json('Erreur interne du serveur');
    }
}

export function authControllerDisconnect(req, res) {
    new Cookies(req, res).set('jwt', "", { maxAge: Date.now() });
    req.flash('notify', 'Vous êtes maintenant déconnecté');
    return res.redirect('/');
}
