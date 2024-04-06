const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
	const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
	response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
	const body = request.body
	const user = request.user

	if (!user) {
		return response.status(401).send({ error: 'unauthorized' })
	}

	const blog = new Blog({
		title: body.title,
		url : body.url,
		author: body.author,
		likes: body.likes || 0,
		user: user._id
	})
	const savedBlog = await blog.save()
	user.blogs = user.blogs.concat(savedBlog._id)
	await user.save()
	
	response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
	await Blog.findByIdAndDelete(request.params.id)
	response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
	const { title, url, author, likes } = request.body

	const blog = {
		title: title,
		url: url,
		author: author,
		likes: likes
	}
	const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true, runValidators: true })
	if (updatedBlog) {
		response.json(updatedBlog)
	} else {
		response.status(404).end()
	}
})

module.exports = blogsRouter