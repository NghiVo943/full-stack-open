const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')
const api = supertest(app)

const helper = require('./test_helper')

const Blog = require('../models/blog')
const User = require('../models/user')

describe('when there is initially some blogs saved', () => {
    beforeEach(async () => {
        await User.deleteMany({})
        await Blog.deleteMany({})
        await Blog.insertMany(helper.initialBlogs)
    })

    test('blogs are returned as json', async () => {
        await api
          .get('/api/blogs')
          .expect(200)
          .expect('Content-Type', /application\/json/)
    })
    
    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')
    
        assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test('blogs are returned with unique identifier named id', async () => {
        const response = await api.get('/api/blogs')
        response.body.forEach(blog => {
            assert.notEqual(blog.id, undefined)
        })
    })

    describe('addition of a new blog', () => {
        test('succeeds with valid data', async () => {
            const token = await helper.userToken()
            const newBlog = {
                title: "TDD harms architecture",
                author: "Robert C. Martin",
                url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
                likes: 0,
            }
    
            await api
                .post('/api/blogs')
                .set({ authorization : `Bearer ${token}` })
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)
    
            const blogsAtEnd = await helper.blogsInDb()
            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
    
            const titles = blogsAtEnd.map(blog => blog.title)
            const urls = blogsAtEnd.map(blog => blog.url)
            assert(titles.includes('TDD harms architecture'))
            assert(urls.includes('http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html'))
        })

        test('succeeds even without attribute likes', async () => {
            const token = await helper.userToken()
            const newBlog = {
              title: "TDD harms architecture",
              author: "Robert C. Martin",
              url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html"
            }
      
            const response = await api
                .post('/api/blogs')
                .set({ authorization : `Bearer ${token}` })
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)
      
            const blogsAtEnd = await helper.blogsInDb()
            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
      
            const titles = blogsAtEnd.map(blog => blog.title)
            const urls = blogsAtEnd.map(blog => blog.url)
            assert(titles.includes('TDD harms architecture'))
            assert(urls.includes('http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html'))

            assert.strictEqual(blogsAtEnd.find(blog => blog.id.toString() === response.body.id.toString()).likes, 0)
        })
    
        test('fails with status code 400 if title is missing', async () => {
            const token = await helper.userToken()
            const newBlog = {
                author: "Robert C. Martin",
                url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
                likes: 0,
            }
    
            await api
                .post('/api/blogs')
                .set({ authorization : `Bearer ${token}` })
                .send(newBlog)
                .expect(400)
    
            const blogsAtEnd = await helper.blogsInDb()
            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    
            const titles = blogsAtEnd.map(blog => blog.title)
            const urls = blogsAtEnd.map(blog => blog.url)
            assert(!titles.includes('TDD harms architecture'))
            assert(!urls.includes('http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html'))
        })

        test('fails with status code 400 if url is missing', async () => {
            const token = await helper.userToken()
            const newBlog = {
                title: "TDD harms architecture",
                author: "Robert C. Martin",
                likes: 0,
            }
    
            await api
                .post('/api/blogs')
                .set({ authorization : `Bearer ${token}` })
                .send(newBlog)
                .expect(400)
    
            const blogsAtEnd = await helper.blogsInDb()
            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    
            const titles = blogsAtEnd.map(blog => blog.title)
            const urls = blogsAtEnd.map(blog => blog.url)
            assert(!titles.includes('TDD harms architecture'))
            assert(!urls.includes('http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html'))
        })
    })
    describe('deletion of a blog', () => {
        test('succeeds with status code 204 if id is valid', async () => {
            const blogsAtStart = await helper.blogsInDb()
            const blogToDelete = blogsAtStart[0]
    
            await api
                .delete(`/api/blogs/${blogToDelete.id}`)
                .expect(204)
    
            const blogsAtEnd = await helper.blogsInDb()
    
            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
    
            const titles = blogsAtEnd.map(blog => blog.title)
            const urls = blogsAtEnd.map(blog => blog.url)
            assert(!titles.includes(blogToDelete.title))
            assert(!urls.includes(blogToDelete.url))
        })
    })

    describe('update of a new blog', () => {
        test('succeeds for existing blog', async () => {
            const blogsAtStart = await helper.blogsInDb()
            const blogToUpdate = blogsAtStart[0]
    
            const response = await api
                .put(`/api/blogs/${blogToUpdate.id}`)
                .send({ likes: blogToUpdate.likes + 1 })
                .expect(200)
                .expect('Content-Type', /application\/json/)
    
            const blogsAtEnd = await helper.blogsInDb()
            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    
            const titles = blogsAtEnd.map(blog => blog.title)
            const urls = blogsAtEnd.map(blog => blog.url)
            assert(titles.includes(blogToUpdate.title))
            assert(urls.includes(blogToUpdate.url))
            assert.strictEqual(blogsAtEnd.find(blog => blog.id.toString() === response.body.id.toString()).likes, blogToUpdate.likes + 1)
        })

        test('fails if blog with id does not exist', async () => {
            const nonExistingId = await helper.nonExistingId()
            await api
                .put(`/api/blogs/${nonExistingId}`)
                .send({
                    title: "TDD harms architecture",
                    author: "Robert C. Martin",
                    likes: 0,
                    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
                })
                .expect(404)
    
            const blogsAtEnd = await helper.blogsInDb()
            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    
            const titles = blogsAtEnd.map(blog => blog.title)
            const urls = blogsAtEnd.map(blog => blog.url)
            assert(!titles.includes('TDD harms architecture'))
            assert(!urls.includes('http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html'))
        })
    })
})

after(async () => {
    await mongoose.connection.close()
})