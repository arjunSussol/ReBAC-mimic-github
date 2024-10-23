import { useState } from 'react'
import axios from 'axios'
import './App.css'

const App = () => {
  const [data, setData] = useState('')

  const connectToServer = () => {
    axios.get('/api')
      .then(res => res.data)
      .then(data => setData(data.message))
  }

  return (
    <div>
      <h1>React connection with Express backend</h1>
      <button onClick={connectToServer}>Send request</button>
      <p>{data}</p>
    </div>
  )
}

export default App
