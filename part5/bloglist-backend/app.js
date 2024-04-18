const config = require('./utils/config')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')

const express = require('express')
require('express-async-errors')
const cors = require('cors')
const morgan = require('morgan')
const mongoose = require('mongoose')

const blogsRouter 	= require('./controllers/blogs')
const usersRouter 	= require('./controllers/users')
const loginRouter 	= require('./controllers/login')

const app = express()

mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)
mongoose.connect(config.MONGODB_URI)
	.then(() => {
		logger.info('connected to MongoDB')
	})
	.catch((error) => {
		logger.error('error connection to MongoDB:', error.message)
	})

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

app.use('/api/login', loginRouter)
app.use('/api/blogs', middleware.userExtractor, blogsRouter)
app.use('/api/users', usersRouter)

if (process.env.NODE_ENV === 'test') {
	const testingRouter = require('./controllers/testing')
	app.use('/api/testing', testingRouter)
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)
app.use(morgan('tiny'))

module.exports = app