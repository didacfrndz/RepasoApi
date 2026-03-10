import { useState } from "react";

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [timeAsync, setTimeAsync] = useState(null);
  const [timeChained, setTimeChained] = useState(null);
  const [timeParallel, setTimeParallel] = useState(null);

  const API = "https://pokeapi.co/api/v2/pokemon?limit=12";

  // 🟢 1. Async / Await
  const fetchPokemonsAsync = async () => {
    const start = performance.now();

    try {
      const res = await fetch(API);
      const data = await res.json();

      const promises = data.results.map((pokemon) =>
        fetch(pokemon.url).then((res) => res.json())
      );

      const pokemonDetails = await Promise.all(promises);

      setPokemons(pokemonDetails);

      const end = performance.now();
      setTimeAsync((end - start).toFixed(2));
    } catch (error) {
      console.error(error);
    }
  };

  // 🟠 2. .then encadenado (una petición detrás de otra)
  const fetchPokemonsChained = () => {
    const start = performance.now();

    fetch(API)
      .then((res) => res.json())
      .then((data) => {
        let pokemonsArray = [];
        let chain = Promise.resolve();

        data.results.forEach((pokemon) => {
          chain = chain
            .then(() => fetch(pokemon.url))
            .then((res) => res.json())
            .then((pokemonData) => {
              pokemonsArray.push(pokemonData);
            });
        });

        return chain.then(() => pokemonsArray);
      })
      .then((result) => {
        setPokemons(result);

        const end = performance.now();
        setTimeChained((end - start).toFixed(2));
      })
      .catch(console.error);
  };

  // 🔵 3. Promise.all (todas las peticiones a la vez)
  const fetchPokemonsParallel = () => {
    const start = performance.now();

    fetch(API)
      .then((res) => res.json())
      .then((data) => {
        const promises = data.results.map((pokemon) =>
          fetch(pokemon.url).then((res) => res.json())
        );

        return Promise.all(promises);
      })
      .then((result) => {
        setPokemons(result);

        const end = performance.now();
        setTimeParallel((end - start).toFixed(2));
      })
      .catch(console.error);
  };

  return (
    <>
      <h1>Pokémons</h1>

      <button onClick={fetchPokemonsAsync}>
        Carregar amb async/await
      </button>

      {timeAsync && <span> Temps: {timeAsync} ms</span>}

      <br /><br />

      <button onClick={fetchPokemonsChained}>
        Carregar encadenat (.then)
      </button>

      {timeChained && <span> Temps: {timeChained} ms</span>}

      <br /><br />

      <button onClick={fetchPokemonsParallel}>
        Carregar amb Promise.all
      </button>

      {timeParallel && <span> Temps: {timeParallel} ms</span>}

      <hr />

      <ul>
        {pokemons.map((pokemon) => (
          <li key={pokemon.id}>
            <img src={pokemon.sprites.front_default} alt={pokemon.name} />

            <p><strong>ID:</strong> {pokemon.id}</p>
            <p><strong>Nom:</strong> {pokemon.name}</p>
            <p><strong>Altura:</strong> {pokemon.height}</p>
            <p><strong>Pes:</strong> {pokemon.weight}</p>
            <p>
              <strong>Tipus:</strong>{" "}
              {pokemon.types.map((t) => t.type.name).join(", ")}
            </p>
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;