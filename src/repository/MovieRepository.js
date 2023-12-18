import con from '../../app/database_sql.js';

export function addMovie(movieData) {
    const { tmdb_id, title, year, synopsis, release_date, poster_path, vote_average } = movieData;
    const sql = `
        INSERT INTO movie (tmdb_id, title, year, synopsis, release_date, poster_path, vote_average)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        title=VALUES(title), year=VALUES(year), synopsis=VALUES(synopsis),
        release_date=VALUES(release_date), poster_path=VALUES(poster_path), vote_average=VALUES(vote_average);
    `;
    return con.promise().query(sql, [tmdb_id, title, year, synopsis, release_date, poster_path, vote_average]);
}