const dummy = (blogs) => {
	return 1
}

const totalLikes = (blogs) => {
	return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const mostLikes = (blogs) => {
	const maxLikes = Math.max(...blogs.map(blog => blog.likes))
	return blogs.find(blog => blog.likes === maxLikes)
}

const mostBlogs = (blogs) => {
	const authors = blogs.map(blog => blog.author)
	const uniqueAuthors = [...new Set(authors)]
	const authorBlogs = uniqueAuthors.map(author => {
		return {
			author: author,
			blogs: blogs.filter(blog => blog.author === author).length
		}
	})
	const maxBlogs = Math.max(...authorBlogs.map(author => author.blogs))
	return authorBlogs.find(author => author.blogs === maxBlogs)
}

const favoriteBlog = (blogs) => {
	const maxLikes = Math.max(...blogs.map(blog => blog.likes))
	return blogs.find(blog => blog.likes === maxLikes)
}

module.exports = {
	dummy,
	totalLikes,
	mostLikes,
	mostBlogs,
	favoriteBlog
}