import { useState } from 'react'
import './App.css'

function Test() {
  const plink = new Audio("/pokePlink.mp3")

  const [bannedList, setBannedList] = useState<string[]>([]);
  const [history, setHistory] = useState<{ name: string, image: string }[]>([]);

  const Randomize = () => {
    const randomDexNumber = Math.floor(Math.random() * 1025) + 1;
    return randomDexNumber;
  };

  const [pokemonStats, setPokemonStats] = useState({
    name: "",
    id: NaN,
    types: [] as string[],
    height: NaN,
    weight: NaN,
    image: "/questionMark.webp"
  });

  async function fetchValidPokemon(maxAttempts = 20) {
    for (let i = 0; i < maxAttempts; i++) {
      const id = Randomize();
      const query = `https://pokeapi.co/api/v2/pokemon/${id}/`;
      try {
        const response = await fetch(query);
        if (!response.ok) continue;

        const data = await response.json();
        const typeNames = data.types.map((t: any) => t.type.name);

        const candidate = {
          name: data.name,
          id: data.id,
          types: typeNames,
          height: data.height,
          weight: data.weight,
          image: data.sprites.front_default
        };

        const isBanned =
          bannedList.includes(String(candidate.id)) ||
          bannedList.includes(`${candidate.height / 10} m`) ||
          bannedList.includes(`${candidate.weight / 10} kg`) ||
          candidate.types.some(t => bannedList.includes(t));

        if (!isBanned) {
          setPokemonStats(candidate);
          setHistory(prev => [...prev, { name: candidate.name, image: candidate.image }]);
          return;
        }
      } catch (error) {
        console.error(error);
      }
    }
    alert("No available Pokémon found that doesn't match banned criteria.");
  }

  const ban = (param: string) => {
    if (!bannedList.includes(param)) {
      setBannedList(prev => [...prev, param]);
      fetchValidPokemon();
    }
  }

  const unban = (param: string) => {
    setBannedList(prev => prev.filter(item => item !== param));
  }

  const handleClick = () => {
    plink.play();
    fetchValidPokemon();
  }

  return (
    <>
      <div className='history'>
        <div className='history-column'>
          <h2>History</h2>
          {history.map((entry, i) => (
            <div key={i} className='history-entry'>
              <img src={entry.image} alt={entry.name} className='history-image' />
              <span>{entry.name}</span>
            </div>
          ))}
        </div>
      </div>
      <div className='background'>
        <div className='pokedex'>
          <div className='dex-left'>
            <h1>Pokedex Randomizer</h1>
            <h2>Gotta catch them all!</h2>
            <div className='pokemon-background'>
              <div className='poke-screen'>
                <img src={pokemonStats.image} alt={pokemonStats.name} />
              </div>
              <h4 className='poke-number banable' onClick={() => ban(String(pokemonStats.id))}>#{!isNaN(pokemonStats.id) ? pokemonStats.id : ""}</h4>
            </div>
            <button onClick={handleClick} className="button-5" role="button">
              <span className="text">Randomize</span>
            </button>
          </div>
          <div className='dex-right'>
            <div className='screen'>
              <h4>Name: {pokemonStats.name.charAt(0).toUpperCase() + pokemonStats.name.slice(1)}</h4>
              <h4>Types:</h4>
              <div className="type-container">
                {pokemonStats.types.map((type, i) => (
                  <span
                    key={i}
                    className={`type-label ${type} banable`}
                    onClick={() => ban(type)}
                    style={{ cursor: 'pointer' }}
                  >
                    {type}
                  </span>
                ))}
              </div>
              <h4 onClick={() => ban(`${pokemonStats.height / 10} m`)} className='banable'>Height: {!isNaN(pokemonStats.height) ? pokemonStats.height / 10 + " m" : ""}</h4>
              <h4 onClick={() => ban(`${pokemonStats.weight / 10} kg`)} className='banable'>Weight: {!isNaN(pokemonStats.weight) ? pokemonStats.weight / 10 + " kg" : ""}</h4>
              <div className='banned-list'>
                <h4>Banned: </h4>
                {bannedList.map((item, i) => (
                  <span
                    key={i}
                    onClick={() => unban(item)}
                    className='banned-label'
                    style={{ cursor: 'pointer' }}
                  >
                    {item} ❌
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Test
