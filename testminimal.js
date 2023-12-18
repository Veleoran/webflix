const apiKey = "475c1c6abe8d72fa4795453f81ffd9d4";  // Remplacez par votre clé API
const movieId = 550;  // ID du film, par exemple 550 pour "Fight Club"

const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US`;

fetch(url)
  .then(response => {
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    return response.json();
  })
  .then(data => console.log(data))
  .catch(error => console.error('Erreur:', error));
