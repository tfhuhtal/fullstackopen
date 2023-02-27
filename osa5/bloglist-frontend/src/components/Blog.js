import { useState } from "react"

const Blog = ({ blog, handleLike, handleRemove }) => {
    const [visible, setVisible] = useState(false)

    const hideWhenVisible = { display: visible ? 'none' : '' }
    const showWhenVisible = { display: visible ? '' : 'none' }

    const toggleVisibility = () => {
        setVisible(!visible)
    }

    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5
    }

    const handleL = () => {
        handleLike(blog.id)
    }

    const handleR = () => {
        handleRemove(blog.id)
    }

    const user = JSON.parse(window.localStorage.getItem('loggedBlogappUser'))

    const allowRemove = () => {
        return blog.user.username === user.username
    }

    return (
        <div className="blog" style={blogStyle}>
            <div style={hideWhenVisible}>
                <div className="blog-title">{blog.title}</div>
                <div className="blog-author">{blog.author}</div>
                <button onClick={toggleVisibility}>view</button>
            </div>
            <div style={showWhenVisible}>
                <div className="blog-title">{blog.title}</div>
                <div className="blog-author">{blog.author}</div>
                <div className="blog-url">{blog.url}</div>
                <div className="blog-likes">{blog.likes} likes <button onClick={handleL}>like</button></div>
                <div className="blog-user">{blog.user.name}</div>
                <button onClick={toggleVisibility}>hide</button>
                {allowRemove && <button onClick={handleR}>remove</button>}
            </div>
        </div>
    )
}

export default Blog