import { useDispatch } from "react-redux"
import { useState } from "react"
import { filterChange } from "../reducers/filterReducer"

const Filter = () => {
    const [filter, setFilter] = useState('')
    const dispatch = useDispatch()
    const style = {
        marginBottom: 10
    }

    const handleChange = (event) => {
        setFilter(event.target.value)
        dispatch(filterChange(event.target.value))
    }
    return (
        <div style={style}>filter <input value={filter} onChange={handleChange}></input></div>
    )
}

export default Filter