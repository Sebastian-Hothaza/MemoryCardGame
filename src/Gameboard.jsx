import { useState, useEffect } from "react";


//TODO: Change to using UUID (?)
//TODO: Check if I should use keys? Yes, using now. Used to help react with efficient rendering
// Guidance: https://github.com/urosrelic/memory-game/blob/main/src/components/Board.jsx

function Gameboard({score, setScore, hiScore, setHiScore}){

    const [cardsClicked, setCardsClicked] = useState([]); // Tracks the cards selected. 

    const [APIData, setAPIData] = useState([]); // Tracks our cards, array of 8
    const [pokemon, setPokemon] = useState([]); // Tracks our pokemon


    // Loads 8 pokemon into APIData array
    // TODO: Expand functionality to take arg of number of pokemon to load in. API should take 5x as many and randomly choose X pokemons to load into APIData
    async function fetchAPIData(numPokemon){

        try{
            const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit='+numPokemon, {mode: 'cors'}); //
            if (!response.ok) throw new Error('Failed getting api data');
            const data = await response.json();
            setAPIData(data.results)
        } catch(err){
            console.log(err)
        }
  
    }

    // Builds pokemon based off of existing APIData
    async function buildPokemonData(){
        let pokemonWIP = [];
        for (let i=0; i<APIData.length; i++){
            try{
                if (!APIData) throw new Error ('Error: APIData is undefined. Cannot build pokemon data')
                const response = await fetch(APIData[i].url, {mode: 'cors'})
                if (!response.ok) throw new Error('Failed getting api data on specific pokemon');
                const data = await response.json();
                pokemonWIP.push(data) 
            }catch(err){
                console.log(err)
            }

        }
        setPokemon(pokemonWIP);
    }

    // API loading
    useEffect(() => {
        fetchAPIData(8);
    },[]) 

    useEffect(() => {
        buildPokemonData();
    }, [APIData])

      


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
            alert("YOU LOSE")         
            if (score > hiScore) setHiScore(score);
            setScore(0);
            setCardsClicked([]);
        } else {

            if (score == pokemon.length-1){ //Score wont be accurate until page is re-rendered
                alert("YOU WIN");
                setScore(0);
                setHiScore(0);
                setCardsClicked([]);
                buildPokemonData();
                return;
            }
            setScore(score+1); 
            setCardsClicked(cardsClicked.concat(e.currentTarget.id))
            // setPokemon(shuffle(pokemon))
            
        }
    }
    // console.log(pokemon[0])
    return(
        
        <div className="board">
            { pokemon &&
                pokemon.map((pokeData) => {
                    return (
                    <div className="card" key={pokeData.id} id={pokeData.id} onClick={handleClick}>
                        <img src={pokeData.sprites.front_default} alt={pokeData.name} />
                        <div>{pokeData.name}</div>
                    </div>
                    )
                })
            }
        </div>
    )
}

export default Gameboard;