import { useState, useEffect } from "react";

function Gameboard({score, setScore, hiScore, setHiScore}){
    const [cardsClicked, setCardsClicked] = useState([]); // Tracks the cards selected. 
    const API_DB_SIZE = 50; // Number of pokemon we have to choose between.
    const [APIData, setAPIData] = useState([]); // Tracks pokemons with each object containing a name and url
    const [pokemon, setPokemon] = useState([]); // Tracks our pokemon

    const [gameOver, setGameOver] = useState(false);

    // Checks if a pokemon name already exists with a given name
    function isUnique(candidateID, arr){
        const combinedArr = pokemon.concat(arr);
        for (let i=0; i<combinedArr.length; i++){
            if (candidateID == combinedArr[i].id) return false;
        }
        return true;
    }

    // Loads API_DB_SIZE pokemon into APIData array
    async function fetchAPIData(){
        try{
            const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit='+API_DB_SIZE, {mode: 'cors'}); //
            if (!response.ok) throw new Error('Failed getting api data');
            const data = await response.json();
            setAPIData(data.results)
        } catch(err){
            console.log(err)
        }
    }

    // Appends pokemon based off of existing APIData
    async function appendPokemonData(numPokemon){
        let pokemonWIP = []; // Used to verifyUniqueness since pokemon array does NOT get updated until after the loop
        for (let i=0; i<numPokemon; i++){
            // Generate random pokemon ID
            let candidateID = Math.floor(Math.random() * API_DB_SIZE) + 1; // NOTE: Pokemon ID's start at 1!
            // Verify we dont already have a pokemon with this id
            while (!isUnique(candidateID, pokemonWIP)){
                candidateID = Math.floor(Math.random() * API_DB_SIZE) + 1;
            }
            try{
                if (!APIData) throw new Error('Error: APIData is undefined; cannot build pokemonData');
                const response = await fetch(APIData[candidateID-1].url, {mode: 'cors'})
                if (!response.ok) throw new Error('Failed building pokemon from api data');
                const data = await response.json();
                pokemonWIP.push(data);
            }catch(err){
                console.log(err)
            }
        }
       setPokemon(pokemon.concat(pokemonWIP));
    }

    // API loading
    useEffect(() => {
        fetchAPIData();
    },[]) 

    // Load in the pokemon details for start of game
    if (APIData.length && !pokemon.length){
        appendPokemonData(2);
    }
      
    // Called by gameOver
    const resetGame = () => {
        setGameOver(false);
        setScore(0);
        setCardsClicked([]);
        setPokemon([]); 
    }


    // Returns a new array that is a result of shuffling the given arr
    function shuffle(arr) {
        let array = arr;
        let currentIndex = array.length,  randomIndex;
        
        // While there remain elements to shuffle.
        while (currentIndex > 0) {

            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }

        return array;
    }

    function handleClick(e){
        if (cardsClicked.includes(e.currentTarget.id)){
            setGameOver(true);      
            if (score > hiScore) setHiScore(score);
        } else {
            setScore(score+1); 
            if (cardsClicked.length == pokemon.length-1){ // Check if move advances player to next level
                appendPokemonData(2);
                setCardsClicked([]);
            } else {
                setCardsClicked(cardsClicked.concat(e.currentTarget.id))
            }
            shuffle(pokemon); 
        }
    }

    return(
        <>
            {gameOver? (  
                <div className="gameOverMessage">
                    <h2>Your memory doesn't appear to be what it once was...</h2>
                    <button onClick={resetGame}>Try Again</button>
                </div>
                
            ) : (
                <div className="board">
                    {pokemon.map((pokeData) => {
                        return (
                        <div className="card" key={pokeData.id} id={pokeData.id} onClick={handleClick}>
                            <img src={pokeData.sprites.front_default} alt={pokeData.name} />
                            <div>{pokeData.name[0].toUpperCase() + pokeData.name.slice(1)}</div>
                        </div>
                        ) 
                    })}
                </div>
            )}
        </>
    )
}

export default Gameboard;