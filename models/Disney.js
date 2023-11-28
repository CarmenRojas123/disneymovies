const Pelimodels = {
    getAll: `
    SELECT 
    * 
    FROM 
    disney_movies`,
    getByID: `
    SELECT
    *
    FROM
    disney_movies
    WHERE
    id= ?
    `,
    addRow:`
    INSERT INTO
    disney_movies(
        movie_title,
        release_date,
        genre,
        mpaa_rating,
        total_gross,
        inflation_adjusted_gross
    )
    VALUES (
        ?,?,?,?,?,?
    )`,
    getByPeliname:`
    SELECT 
    * 
    FROM 
    disney_movies 
    WHERE movie_title =?
    `,

    updatePeli:`
    UPDATE
    disney_movies
    SET
    movie_title = ?,
    release_date = ?,
    genre = ?,
    mpaa_rating = ?,
    total_gross = ?,
    inflation_adjusted_gross = ?
        WHERE 
        id =?
    `,

    deleteRow:`
    DELETE FROM 
    disney_movies
    WHERE 
    id=?
    `,
    
}

module.exports=Pelimodels;