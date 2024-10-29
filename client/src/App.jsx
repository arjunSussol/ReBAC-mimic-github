import { useEffect, useState } from 'react'
import './App.css'
import resourceServices from './services'

const App = () => {
  const [resource, setResource] = useState([])

  useEffect(() => {
    async function getAllResources () {
      const allResources = await resourceServices.getResources()
      setResource(allResources.map(resources => resources.name))
    }
    getAllResources()
  }, [])

  return (
    <div>
      <h1>React connection with Express and Permit api</h1>
      {
        <ul>
          {resource.map(r => <li key={r.key}>{r}</li>)}
        </ul>
      }
    </div>
  )
}

export default App
