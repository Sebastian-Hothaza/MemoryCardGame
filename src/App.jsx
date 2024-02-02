import './App.css'
import { useState } from 'react'
import Gameboard from './Gameboard';

function App() {

  const [score, setScore] = useState(0);
  const [hiScore, setHiScore] = useState(0);


  return (
    <>
    <div className='header'>
      <h1>Memory Card Game</h1>
      <div>Score: {score}</div>
      <div>High-Score: {hiScore}</div>
    </div>
    <Gameboard score={score} setScore={setScore} hiScore={hiScore} setHiScore={setHiScore}/>
    </>
  )
}

export default App
