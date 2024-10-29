import Select from '@mui/material/Select'
import { InputLabel, MenuItem } from '@mui/material'
import PropTypes from 'prop-types'
import { useState } from 'react'

export const DropDown = ({ title, data }) => {
    const [value, setValue] = useState('')

    return(
        <div>
            <InputLabel id="demo-simple-select-label">{title}</InputLabel>
            {
                <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={value}
                label={title}
                onChange={e => setValue(e.target.value)}
                sx={{ m: 1, minWidth: 120 }}
                >
                {data.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
                </Select>
            }
        </div>
    )
}

DropDown.propTypes = {
    title: PropTypes.string.isRequired,
    data: PropTypes.array.isRequired,
}