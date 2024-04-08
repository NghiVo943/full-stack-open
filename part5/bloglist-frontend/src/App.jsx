import { useState, useEffect } from 'react'
import Blog from './components/Blog'

import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState(null)

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setMessage({
        message: 'wrong credentials',
        type: 'error'
      })
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.clear()
  }

  const addBlog = async (event) => {
    event.preventDefault()
    const blogObject = {
      title: title,
      url : url,
      author: author
    }

    const blog = await blogService.create(blogObject)
    setBlogs(blogs.concat(blog))
    setTitle('')
    setAuthor('')
    setUrl('')   
    setMessage({
      message: `a new blog ${blog.title} by ${blog.author} added`,
      type: 'noti'
    })
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const loginForm = () => {
    return (<form onSubmit={handleLogin}>
      <div>username: <input value={username} onChange={(event) => setUsername(event.target.value)}/></div>
      <div>password: <input type='password' value={password} onChange={(event) => setPassword(event.target.value)}/></div>
      <button type='submit'>login</button>
    </form>)
  }

  const blogForm = () => {
    return (<form onSubmit={addBlog}>
      <div>title: <input value={title} onChange={(event) => setTitle(event.target.value)}/></div>
      <div>author: <input value={author} onChange={(event) => setAuthor(event.target.value)}/></div>
      <div>url: <input value={url} onChange={(event) => setUrl(event.target.value)}/></div>
      <button type='submit'>create</button>
    </form>)
  }

  if (user===null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={message} />
        {loginForm()}
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} />
      <div>{user.username} logged in <button onClick={handleLogout}>logout</button></div>
      <h2>create new</h2>
      {blogForm()}
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App