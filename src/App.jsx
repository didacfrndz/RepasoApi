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
    // 1. Obtenim la llista de pokémons
    try {
      const res = await fetch(API);
      const data = await res.json();
      // 2. Per cada pokémon, fem una petició per obtenir els detalls
      const promises = data.results.map((pokemon) =>
        fetch(pokemon.url).then((res) => res.json()),
      );
      // 3. Esperem a que totes les peticions es completen i obtenim els detalls
      const pokemonDetails = await Promise.all(promises);
      // 4. Actualitzem l'estat amb els detalls dels pokémons
      setPokemons(pokemonDetails);
      // 5. Calculem el temps que ha trigat tot el procés
      const end = performance.now();
      // 6. Guardem el temps al state
      setTimeAsync((end - start).toFixed(2));
    } catch (error) {
      console.error(error);
    }
  };

  // 🟠 2. .then encadenado (una petición detrás de otra)
  const fetchPokemonsChained = () => {
    const start = performance.now();
    // 1. Obtenim la llista de pokémons
    fetch(API)
      // 2. Per cada pokémon, fem una petició per obtenir els detalls (encadenat)
      .then((res) => res.json())
      .then((data) => {
        // 3. Anem encadenant les peticions per obtenir els detalls de cada pokémon
        let pokemonsArray = [];
        let chain = Promise.resolve();
        // 4. Per cada pokémon, encadenem una nova petició per obtenir els detalls
        data.results.forEach((pokemon) => {
          chain = chain
            .then(() => fetch(pokemon.url))
            .then((res) => res.json())
            .then((pokemonData) => {
              // 5. Anem guardant els detalls de cada pokémon a un array
              pokemonsArray.push(pokemonData);
            });
        });
        // 6. Quan totes les peticions s'han completat, retornem l'array amb els detalls dels pokémons
        return chain.then(() => pokemonsArray);
      })
      // 7. Actualitzem l'estat amb els detalls dels pokémons i calculem el temps que ha trigat tot el procés
      .then((result) => {
        setPokemons(result);
        // 8. Calculem el temps que ha trigat tot el procés
        const end = performance.now();
        // 9. Guardem el temps al state
        setTimeChained((end - start).toFixed(2));
      })
      .catch(console.error);
  };

  // 🔵 3. Promise.all (todas las peticiones a la vez)
  const fetchPokemonsParallel = () => {
    const start = performance.now();
    // 1. Obtenim la llista de pokémons
    fetch(API)
      // 2. Per cada pokémon, fem una petició per obtenir els detalls (totes a la vegada)
      .then((res) => res.json())
      .then((data) => {
        // 3. Per cada pokémon, fem una petició per obtenir els detalls i guardem totes les promeses en un array
        const promises = data.results.map((pokemon) =>
          // 4. Fem totes les peticions a la vegada amb Promise.all i esperem a que totes es completen
          fetch(pokemon.url).then((res) => res.json()),
        );
        // 5. Retornem la promesa que es resoldrà quan totes les peticions s'hagin completat i tinguem els detalls de tots els pokémons
        return Promise.all(promises);
      })
      // 6. Actualitzem l'estat amb els detalls dels pokémons i calculem el temps que ha trigat tot el procés
      .then((result) => {
        setPokemons(result);
        // 7. Calculem el temps que ha trigat tot el procés
        const end = performance.now();
        // 8. Guardem el temps al state
        setTimeParallel((end - start).toFixed(2));
      })
      .catch(console.error);
  };

  return (
    <>
      <h1>Pokémons</h1>

      <button onClick={fetchPokemonsAsync}>Carregar amb async/await</button>

      {timeAsync && <span> Temps: {timeAsync} ms</span>}

      <br />
      <br />

      <button onClick={fetchPokemonsChained}>Carregar encadenat (.then)</button>

      {timeChained && <span> Temps: {timeChained} ms</span>}

      <br />
      <br />

      <button onClick={fetchPokemonsParallel}>Carregar amb Promise.all</button>

      {timeParallel && <span> Temps: {timeParallel} ms</span>}

      <hr />

      <ul>
        {pokemons.map((pokemon) => (
          <li key={pokemon.id}>
            <img src={pokemon.sprites.front_default} alt={pokemon.name} />

            <p>
              <strong>ID:</strong> {pokemon.id}
            </p>
            <p>
              <strong>Nom:</strong> {pokemon.name}
            </p>
            <p>
              <strong>Altura:</strong> {pokemon.height}
            </p>
            <p>
              <strong>Pes:</strong> {pokemon.weight}
            </p>
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
