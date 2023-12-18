import fetch from 'node-fetch'; // Assurez-vous d'avoir installé 'node-fetch' via npm
import * as MovieRepository from '../repository/MovieRepository.js'; 

const apiKey = '475c1c6abe8d72fa4795453f81ffd9d4';
const baseUrl = 'https://api.themoviedb.org/3/movie/';

export async function importMovieById(movieId) {
    const url = `${baseUrl}${movieId}?api_key=${apiKey}`;
    const response = await fetch(url);
    const movieData = await response.json();

    if (response.ok) {
        const { id: tmdb_id, title, release_date, overview: synopsis, poster_path, vote_average } = movieData;
        const year = release_date.substring(0, 4); // Extraction de l'année depuis la date de sortie
        return await MovieRepository.addMovie({ tmdb_id, title, year, synopsis, release_date, poster_path, vote_average });
    } else {
        throw new Error(movieData.status_message);
    }
}

export async function addMovieToDb (movieData) {
    const { tmdb_id, title, year, synopsis, release_date, poster_path, vote_average } = movieData;
    // Utilisez votre logique de repository pour insérer ces données dans la base de données
    await MovieRepository.addMovie({
        tmdb_id, title, year: release_date.substring(0, 4), synopsis, release_date, poster_path, vote_average
    });
};
