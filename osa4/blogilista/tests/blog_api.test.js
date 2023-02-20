const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

beforeEach(async () => {
	await Blog.deleteMany({})
	await User.deleteMany({})
    
	const user = new User(helper.initialUser)
	await user.save()
    
	const blogObjects = helper.initialBlogs
		.map(blog => new Blog({ ...blog, user: user._id }))
	const promiseArray = blogObjects.map(blog => blog.save())
	await Promise.all(promiseArray)
})

test('blogs are returned as json', async () => {
	await api
		.get('/api/blogs')
		.expect(200)
		.expect('Content-Type', /application\/json/)
})

test('there are n blogs', async () => {
	const response = await api.get('/api/blogs')

	expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('a blog about React patterns is within the returned blogs', async () => {
	const response = await api.get('/api/blogs')

	const contents = response.body.map(r => r.title)
	expect(contents).toContain('React patterns')
})

test('id property is defined for all blogs', async () => {
	const response = await api.get('/api/blogs')

	response.body.forEach(b => expect(b.id).toBeDefined())
})

test('succeeds with a valid id', async () => {
	const blogsAtStart = await helper.blogsInDb()
	const blogToView = JSON.parse(JSON.stringify(blogsAtStart[0]))

	const resultBlog = await api
		.get(`/api/blogs/${blogToView.id}`)
		.expect(200)
		.expect('Content-Type', /application\/json/)

	expect(resultBlog.body).toEqual(blogToView)
})

test('fails with statuscode 400 id is invalid', async () => {
	const invalidId = '5a3d5222070084442a3445'

	await api
		.get(`/api/blogs/${invalidId}`)
		.expect(400)
})

test('a valid blog can be added', async () => {
	const newBlog = {
		title: 'Test blog',
		auhtor: 'same as before',
		url: 'http://localhost:3003',
		user: helper.initialUser,
		likes: 0
	}

	await api
		.post('/api/blogs')
		.set('Authorization', `Bearer ${helper.validTokenForUser(helper.initialUser)}`)
		.send(newBlog)
		.expect(200)
		.expect('Content-Type', /application\/json/)

	const response = await api.get('/api/blogs')

	const contents = response.body.map(r => r.title)

	expect(response.body).toHaveLength(helper.initialBlogs.length + 1)
	expect(contents).toContain('Test blog')
})

test('blog without url is not added', async () => {
	const newBlog = {
		title: 'Test blog',
		auhtor: 'same as before',
		user: helper.initialUser,
		likes: 0
	}

	await api
		.post('/api/blogs')
		.set('Authorization', `Bearer ${helper.validTokenForUser(helper.initialUser)}`)
		.send(newBlog)
		.expect(400)
		.expect('Content-Type', /application\/json/)

	const response = await api.get('/api/blogs')

	expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('blog without a valid user is not added', async () => {
	newBlog = {
		title: 'Test blog',
		auhtor: 'same as before',
		url: 'http://localhost:3003',
		user: '5a422a851b54a676234d17f7'
	}

	await api
		.post('/api/blogs')
		.set('Authorization', `Bearer ${helper.validTokenForUser(helper.initialUser)}`)
		.send(newBlog)
		.expect(400)
		.expect('Content-Type', /application\/json/)

	const response = await api.get('/api/blogs')
    
	expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('likes value for a new blog is 0 by default', async () => {
	newBlog = {
		title: 'Test blog',
		auhtor: 'same as before',
		url: 'http://localhost:3003',
		user: helper.initialUser
	}

	await api
		.post('/api/blogs')
		.set('Authorization', `Bearer ${helper.validTokenForUser(helper.initialUser)}`)
		.send(newBlog)
		.expect(200)
		.expect('Content-Type', /application\/json/)

	const response = await api.get('/api/blogs')
	const addedBlog = response.body.find(b => b.title === 'Test blog')

	expect(addedBlog.likes).toBe(0)
})

test('succeeds with status code 204 if id is valid, when deleting', async () => {
	newBlog = { 
		title: 'Test blog',
		auhtor: 'same as before',
		url: 'http://localhost:3003',
		user: helper.initialUser,
		likes: 0
	}

	await api
		.post('/api/blogs')
		.set('Authorization', `Bearer ${helper.validTokenForUser(helper.initialUser)}`)
		.send(newBlog)
		.expect(200)
		.expect('Content-Type', /application\/json/)

	const blogsAtStart = await helper.blogsInDb()
	const blogToDelete = blogsAtStart[0]
    
	await api
		.delete(`/api/blogs/${blogToDelete.id}`)
		.set('Authorization', `Bearer ${helper.validTokenForUser(helper.initialUser)}`)
		.expect(204)

	const blogsAtEnd = await helper.blogsInDb()

	expect(blogsAtEnd).toHaveLength(
		helper.initialBlogs.length
	)
})

test('fails with status code 401 if token is invalid', async () => {
	newBlog = {
		title: 'Test blog',
		auhtor: 'same as before',
		url: 'http://localhost:3003',
		user: helper.initialUser,
		likes: 0
	}

	await api
		.post('/api/blogs')
		.set('Authorization', `Bearer ${helper.validTokenForUser(helper.initialUser)}`)
		.send(newBlog)
		.expect(401)
		.expect('Content-Type', /application\/json/)

	const response = await api.get('/api/blogs')

	expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('fails with status code 401 if user tries to delete a blog not created by himself', async () => {
	newBlog = {
		title: 'Test blog',
		auhtor: 'same as before',
		url: 'http://localhost:3003',
		user: helper.initialUser,
		likes: 0
	}

	await api
		.post('/api/blogs')
		.set('Authorization', `Bearer ${helper.validTokenForUser(helper.initialUser)}`)
		.send(newBlog)
		.expect(200)
		.expect('Content-Type', /application\/json/)

	const blogsAtStart = await helper.blogsInDb()
	const blogToDelete = blogsAtStart[0]

	await api
		.delete(`/api/blogs/${blogToDelete.id}`)
		.set('Authorization', `Bearer ${helper.validTokenForUser(helper.secondUser)}`)
		.expect(401)

	const blogsAtEnd = await helper.blogsInDb()

	expect(blogsAtEnd).toHaveLength(
		helper.initialBlogs.length + 1
	)
})


test('update with valid parameters succeeds', async () => {
	newBlog = {
		title: 'Test blog',
		auhtor: 'same as before',
		url: 'http://localhost:3003',
		user: helper.initialUser,
		likes: 0
	}

	await api
		.post('/api/blogs')
		.set('Authorization', `Bearer ${helper.validTokenForUser(helper.initialUser)}`)
		.send(newBlog)
		.expect(200)
		.expect('Content-Type', /application\/json/)

	const blogsAtStart = await helper.blogsInDb()
	const blogToUpdate = blogsAtStart[0]

	const updatedBlog = {
		title: 'Updated blog',
	}

	await api
		.put(`/api/blogs/${blogToUpdate.id}`)
		.set('Authorization', `Bearer ${helper.validTokenForUser(helper.initialUser)}`)
		.send(updatedBlog)
		.expect(200)
		.expect('Content-Type', /application\/json/)

	const blogsAtEnd = await helper.blogsInDb()
	const contents = blogsAtEnd.map(r => r.title)

	expect(contents).toContain('Updated blog')
})

test('update with invalid parameters leaves record intact', async () => {
	newBlog = {
		title: 'Test blog',
		auhtor: 'same as before',
		url: 'http://localhost:3003',
		user: helper.initialUser,
		likes: 0
	}

	await api
		.post('/api/blogs')
		.set('Authorization', `Bearer ${helper.validTokenForUser(helper.initialUser)}`)
		.send(newBlog)
		.expect(200)
		.expect('Content-Type', /application\/json/)

	const blogsAtStart = await helper.blogsInDb()
	const blogToUpdate = blogsAtStart[0]

	const updatedBlog = {
		title: 'Updated blog',
		likes: 'invalid'
	}

	await api
		.put(`/api/blogs/${blogToUpdate.id}`)
		.set('Authorization', `Bearer ${helper.validTokenForUser(helper.initialUser)}`)
		.send(updatedBlog)
		.expect(400)
		.expect('Content-Type', /application\/json/)

	const blogsAtEnd = await helper.blogsInDb()
	const contents = blogsAtEnd.map(r => r.title)

	expect(contents).toContain('Test blog')
})

afterAll(() => {
	mongoose.connection.close()
})
