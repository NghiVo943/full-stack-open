const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
    },
    {
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
    },
    {
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
    },
    {
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 10,
    }
]

const initialUsers = [
    {
        username: "mluukkai",
        name: "Matti Luukkainen",
        password: "mluukkai123"
    },
    {
        username: "hellas",
        name: "Arto Hellas",
        password: "hellas321"
    }
]

const nonExistingId = async () => {
    const blog = new Blog({ 
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2
    })
    await blog.save()
    await blog.deleteOne()
  
    return blog._id.toString()
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

const userToken = async () => {
    const newUser = initialUsers[0]

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(newUser.password, saltRounds)

    const user = new User({ ...newUser, passwordHash: passwordHash })
    await user.save()

    const token = jwt.sign({ username: user.username, id: user._id }, process.env.SECRET)
    return token
}

module.exports = {
    initialBlogs,
    blogsInDb,
    nonExistingId,
    initialUsers,
    usersInDb,
    userToken
}