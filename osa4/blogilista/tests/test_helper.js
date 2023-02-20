const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')

const initialUser = {
	_id: '63f3971aeffe2bcd67ec89f6',
	username: 'test',
	name: 'tester',
	passwordHash: '$2b$10$CM6nHngbumpWGyfDVpZRbODzHZo6IrORya9QFwsMOSCfw.PMmOTzC',
	__v: 0
}

const initialBlogs = [
	{
		_id: '63f39bd5019c00f16c4c6315',
		title: 'React patterns',
		author: 'Chackie Chan',
		url: 'https://reactpatterns.com/',
		likes: 7,
		user: '63f3971aeffe2bcd67ec89f6',
		__v: 0
	}
]

const blogsInDb = async () => {
	const blogs = await Blog.find({})
	return blogs.map(b => b.toJSON())
}

const blogInDb = async (id) => {
	return await Blog.findById(id)
}

const usersInDb = async () => {
	const users = await User.find({})
	return users.map(u => u.toJSON())
}

const validTokenForUser = (user) => {
	const userForToken = {
		username: user.username,
		id: user._id,
	}

	return jwt.sign(userForToken, process.env.SECRET, { expiresIn: 60*60 })
}

module.exports = {
	initialUser, initialBlogs, blogsInDb, blogInDb, usersInDb, validTokenForUser
}