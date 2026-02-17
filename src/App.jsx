import { useState, useEffect } from "react";

function App() {
  const [arraypokemons, setArrayPokemons] = useState([]);

  // useEffect se ejecuta después del primer render
  useEffect(() => {
    // Hacemos la petición a la API de Pokémon
    fetch("https://pokeapi.co/api/v2/pokemon?limit=151")
      .then((response) => response.json()) // Convertimos la respuesta a JSON
      .then((data) => setArrayPokemons(data.results)) // Guardamos los resultados en el estado
      .catch((error) => console.error("Error fetching data:", error));
  }, []); // El array vacío asegura que se ejecute solo una vez

  return (
    <>
      <h1>Pokémons</h1>
      <ul>
        {arraypokemons.map((pokemon) => (
          <li key={pokemon.name}>{pokemon.name}</li> // Usamos .map() para crear <li> por cada Pokémon
        ))}
      </ul>
    </>
  );
}

export default App;
