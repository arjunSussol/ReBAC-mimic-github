import { useEffect, useState } from 'react'
import Select from '@mui/material/Select'
import { InputLabel, MenuItem } from '@mui/material'

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
      <InputLabel id="demo-simple-select-label">Resources</InputLabel>
      {
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value=""
          label="Resources"
          onChange={() => alert('Hi')}
          sx={{ m: 1, minWidth: 120 }}
        >
          {resource.map(r => <MenuItem key={r}>{r}</MenuItem>)}
        </Select>
      }
    </div>
  )
}

export default App
