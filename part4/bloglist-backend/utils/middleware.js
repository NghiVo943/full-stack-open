const jwt = require('jsonwebtoken')

const logger = require('./logger')
const User = require('../models/user')

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
	logger.error(error.message)

	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' })
	} else if (error.name === 'ValidationError') {
		return response.status(400).json({ error: error.message })
	}

	next(error)
}

const userExtractor = async (request, response, next) => {
	const authorization = request.get('authorization')
	
	if (authorization && authorization.startsWith('Bearer ')) {
		const token = authorization.replace('Bearer ', '')
		const decodedToken = jwt.verify(token, process.env.SECRET)
		if (decodedToken.id) {
			const user = await User.findById(decodedToken.id)
			if (user) {
				request.user = user
			}
		}
	}
	next()
}

module.exports = {
	unknownEndpoint,
	errorHandler,
	userExtractor
}