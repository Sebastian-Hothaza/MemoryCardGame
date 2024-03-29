import './App.css'
import { useState } from 'react'
import Gameboard from './Gameboard';

function App() {

  const [score, setScore] = useState(0);
  const [hiScore, setHiScore] = useState(0);


  return (
    <>
    <div className='header'>
      <h1>Pokemon Memory Card Game</h1>
      <div>Score: {score}</div>
      <div>High-Score: {hiScore}</div>
    </div>
    <div className='instructions'>Test your memory! Do not click the same card twice</div>
    <Gameboard score={score} setScore={setScore} hiScore={hiScore} setHiScore={setHiScore}/>
    </>
  )
}

export default App
