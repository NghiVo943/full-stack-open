const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}
  
const totalLikes = (blogs) => {
    return blogs.map(blog => blog.likes).reduce((s, b) => s + b, 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length < 1) {
        return {}
    }
    const mostlikes = Math.max(...blogs.map(blog => blog.likes))
    const blog = blogs.find(blog => blog.likes === mostlikes)
    return {
        title: blog.title,
        author: blog.author,
        likes: blog.likes
    }
}

const mostBlogs = (blogs) => {
    if (blogs.length < 1) {
        return {}
    }
    const authorGroups = _.groupBy(blogs, blog => blog.author)
    
    const authorBlogs = Object.keys(authorGroups).map(author => {
        const nofBlogs = authorGroups[author].length
        return {
            author: author,
            blogs: nofBlogs
        }})
    const maxNofBlogs = Math.max(...authorBlogs.map(author => author.blogs))
    return authorBlogs.find(author => author.blogs === maxNofBlogs)
}

const mostLikes = (blogs) => {
    if (blogs.length < 1) {
        return {}
    }
    const authorGroups = _.groupBy(blogs, blog => blog.author)
    
    const authorBlogs = Object.keys(authorGroups).map(author => {
        const nofLikes = authorGroups[author].map(blog => blog.likes).reduce((s, b) => s + b, 0)
        return {
            author: author,
            likes: nofLikes
        }})
    const maxNofLikes = Math.max(...authorBlogs.map(author => author.likes))
    return authorBlogs.find(author => author.likes === maxNofLikes)
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}