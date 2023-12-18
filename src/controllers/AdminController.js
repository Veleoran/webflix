import bcrypt from 'bcryptjs';
import { selectByUsername } from "../repository/UserRepository.js";
import jwt  from 'jsonwebtoken';
import Cookies from "cookies";
import fetch from 'node-fetch';
import * as MovieService from '../services/MovieService.js';
export function get(req, res) {
    res.render('auth');
}
export function searchMovies(req, res) {
    if(req.query.q !== undefined && req.query.q !== "") {
        const url = `https://api.themoviedb.org/3/search/movie?query=${req.query.q}&include_adult=false&language=en-US&page=1`;
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${process.env.TMDB_TOKEN}`
            }
        };

        fetch(url, options)
            .then(responseHttp => responseHttp.json())
            .then(json => json.results.map(movie => { return {tmdb_id: movie.id, vote_average: movie.vote_average, release_date: movie.release_date, title: movie.title, poster_path: movie.poster_path } }))
            .then(movies => {
                res.render('admin', { q: req.query.q, movies });
            })
            .catch(err => {
                console.error('error:', err);
                res.status(500).render('error', { error: err });
            });
    }
    else {
        res.render('admin');
    }
}

export function post(req, res) {
    let error;
    selectByUsername(req.body.username).then((user) => {
        if(user !== null) {
            if(bcrypt.compareSync(req.body.password, user.password)) {
                let accessToken = jwt.sign({username: user.username, a2f: user.a2f}, process.env.JWT_SECRET, {expiresIn: 604800});       
                new Cookies(req,res).set('jwt', accessToken, {httpOnly: true, secure: (process.env.APP_ENV === 'production') });

                req.flash('notify', 'Vous êtes maintenant connecté');
                return res.redirect('/admin');
            } else {
                error = `Echec d'identification.`
            }
        } else {
            error = `Auncun compte n'existe avec cet identifiant.`
        }
        res.render('auth', { error });
    })
}
export function authControllerDeconnect(req, res) {
    new Cookies(req,res).set('jwt',"", {maxAge: Date.now()});
    req.flash('notify', 'Vous êtes maintenant déconnecté');
    return res.redirect('/');
}


export async function saveInBddMovie  (req, res)  {
    try {
        const movieId = req.params.id;
        const movieData = await MovieService.getMovieData(movieId); // Les données du film devraient être envoyées dans le corps de la requête
        await MovieService.addMovieToDb(movieData);
        res.status(200).json({ success: true, message: "Film ajouté avec succès." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};