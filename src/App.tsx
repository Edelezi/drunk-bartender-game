import {useState} from 'react'
import './App.css'
import PixiCanvas from "./game/PixiCanvas.tsx";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <PixiCanvas />
    </>
  )
}

export default App
