import { useState, useEffect, useRef } from 'react'

import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import Notification from './components/Notification'

import blogService from './services/blogs'
import loginService from './services/login'

import blogHelper from './utils/blog_helper'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [message, setMessage] = useState(null)

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const blogFormRef = useRef()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    const fetchBlogs = async () => {
      const blogs = await blogService.getAll()
      blogs.sort(blogHelper.compareBlog)
      setBlogs( blogs )
    }
    fetchBlogs()
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

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    const newBlog = await blogService.create(blogObject)
    setBlogs(blogs.concat(newBlog))
    setMessage({
      message: `a new blog ${newBlog.title} by ${newBlog.author} added`,
      type: 'noti'
    })
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const likeBlog = async (blogObject) => {
    const updatedBlog = await blogService
      .update(blogObject.id, { ...blogObject, likes: blogObject.likes + 1 })
    const updatedBlogs = blogs
      .map(blog => blog.id !== blogObject.id ? blog : { ...blogObject, likes: updatedBlog.likes })
    updatedBlogs.sort(blogHelper.compareBlog)
    setBlogs(updatedBlogs)
  }

  const deleteBlog = async (id) => {
    await blogService.remove(id)
    setBlogs(blogs.filter(blog => blog.id !== id))
  }

  if (user===null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={message} />
        <LoginForm
          username={username}
          password={password}
          handleUsernameChange={(event) => setUsername(event.target.value)}
          handlePasswordChange={(event) => setPassword(event.target.value)}
          handleSubmit={handleLogin}
        />
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} />
      <div>{user.username} logged in <button onClick={handleLogout}>logout</button></div>
      <Togglable buttonLabel='new blog' ref={blogFormRef}>
        <h2>create new</h2>
        <BlogForm createBlog={addBlog}/>
      </Togglable>
      {blogs.map(blog =>
        <Blog key={blog.id} username={user.username} blog={blog} likeBlog={likeBlog} deleteBlog={deleteBlog}/>
      )}
    </div>
  )
}

export default App