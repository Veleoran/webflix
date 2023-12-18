const MovieService = require('./MovieService');

exports.importMovie = async (req, res) => {
    try {
        const MovieId = req.params.MovieId;
        const Movie = await MovieService.importMovieById(MovieId);
        res.status(200).json(Movie);
    } catch (error) {
        res.status(500).send(error.message);
    }
};
