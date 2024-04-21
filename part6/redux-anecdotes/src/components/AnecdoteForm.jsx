import { useState } from "react"
import { useDispatch } from "react-redux"
import { newAnecdote } from "../reducers/anecdoteReducer"

const AnecdoteForm = () => {
    const [anecdote, setAnecdote] = useState('')
    const dispatch = useDispatch()

    const handleChange = (event) => {
        setAnecdote(event.target.value)
    }
    const handleSubmit = (event) => {
        event.preventDefault()
        dispatch(newAnecdote(anecdote))
    }
    return (
        <form onSubmit={handleSubmit}>
            <div><input value={anecdote} onChange={handleChange}/></div>
            <button type="submit">create</button>
        </form>
    )
}

export default AnecdoteForm