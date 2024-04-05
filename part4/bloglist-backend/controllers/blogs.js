const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
	const blogs = await Blog.find({})
	response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
	const blog = new Blog(request.body)
	const savedBlog = await blog.save()
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