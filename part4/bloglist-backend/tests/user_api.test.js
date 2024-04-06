const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')

const app = require('../app')
const api = supertest(app)

const helper = require('./test_helper')

const User = require('../models/user')

describe('when there is initially some users saved', () => {
    beforeEach(async () => {
        await User.deleteMany({})
        const promises = helper.initialUsers.map(async user => {
            const saltRounds = 10
            const passwordHash = await bcrypt.hash(user.password, saltRounds)

            return { ...user, passwordHash: passwordHash }
        })
        const hashedUsers = await Promise.all(promises)
        await User.insertMany(hashedUsers)
    })

    describe('addition of a new blog', () => {
        test('succeeds with valid data', async () => {
            const newUser = {
                username: 'nghivo',
                name: 'Nghi Vo',
                password: 'nghivo12345'
            }

            await api
                .post('/api/users')
                .send(newUser)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const usersAtEnd = await helper.usersInDb()
            assert.strictEqual(usersAtEnd.length, helper.initialUsers.length + 1)
            
            const usernames = usersAtEnd.map(user => user.username)
            assert(usernames.includes('nghivo'))
        })

        test('fails with missing username', async () => {
            const newUser = {
                name: 'Nghi Vo',
                password: 'nghivo12345'
            }

            await api
                .post('/api/users')
                .send(newUser)
                .expect(400)

            const usersAtEnd = await helper.usersInDb()
            assert.strictEqual(usersAtEnd.length, helper.initialUsers.length)
            
            const usernames = usersAtEnd.map(user => user.username)
            assert(!usernames.includes('nghivo'))
        })
        
        test('fails with missing password', async () => {
            const newUser = {
                username: 'nghivo',
                name: 'Nghi Vo',
            }

            await api
                .post('/api/users')
                .send(newUser)
                .expect(400)

            const usersAtEnd = await helper.usersInDb()
            assert.strictEqual(usersAtEnd.length, helper.initialUsers.length)
            
            const usernames = usersAtEnd.map(user => user.username)
            assert(!usernames.includes('nghivo'))
        })

        test('fails with invalid username', async () => {
            const newUser = {
                username: 'ng',
                name: 'Nghi Vo',
                password: 'nghivo12345'
            }

            await api
                .post('/api/users')
                .send(newUser)
                .expect(400)

            const usersAtEnd = await helper.usersInDb()
            assert.strictEqual(usersAtEnd.length, helper.initialUsers.length)
            
            const usernames = usersAtEnd.map(user => user.username)
            assert(!usernames.includes('ng'))
        })

        test('fails with invalid password', async () => {
            const newUser = {
                username: 'nghivo',
                name: 'Nghi Vo',
                password: 'ng'
            }

            await api
                .post('/api/users')
                .send(newUser)
                .expect(400)

            const usersAtEnd = await helper.usersInDb()
            assert.strictEqual(usersAtEnd.length, helper.initialUsers.length)
            
            const usernames = usersAtEnd.map(user => user.username)
            assert(!usernames.includes('nghivo'))
        })
    })
})


after(async () => {
    await mongoose.connection.close()
})