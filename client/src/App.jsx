import { useEffect, useState } from 'react'

import './App.css'
import resourceServices from './services'
import { DropDown } from './components/DropDown'

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
      <DropDown title='Resources' data={resource} />
    </div>
  )
}

export default App
