import { useState, useEffect } from 'react'
import axios from 'axios'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    handleIncrement();
  }, [])

  const handleIncrement = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/test');
      setCount(response.data.count);
    } catch (error) {
      console.error("Error communicating with backend:", error);
    }
  }

  return (
    <>
      <div>
        <img src={viteLogo} className="logo" alt="Vite logo" />
        <img src={reactLogo} className="logo react" alt="React logo" />
      </div>
      <h1>Vite + Node</h1>
      <div className="card">
        <button onClick={handleIncrement}>
          Count is {count}
        </button>
      </div>
    </>
  )
}

export default App