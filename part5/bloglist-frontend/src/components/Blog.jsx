import { useState } from 'react'

const Blog = ({
  blog,
  username,
  likeBlog,
  deleteBlog
}) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const [visible, setVisible] = useState(false)
  const toggleVisibility = () => {setVisible(!visible)}

  const handleLike = () => { likeBlog(blog) }
  const handleRemove = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      deleteBlog(blog.id)
    }
  }
  return (
    <div className='blog' data-testid = 'blog' style={blogStyle}>
      <div> {blog.title} {blog.author} <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
        <div className='blog-details' style={{ display: visible ? 'block' : 'none' }}>
          <div>{blog.url}</div>
          <div>likes {blog.likes} <button onClick={handleLike}>like</button></div>
          <div>{blog.user.name}</div>
          {blog.user.username === username && (<button onClick={handleRemove}>remove</button>)}
        </div>
      </div>
    </div>
  )}

export default Blog