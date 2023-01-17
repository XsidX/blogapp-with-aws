import React, { useState, useEffect } from "react"
import Link from "next/link"
import { API, Auth } from "aws-amplify"
import { listPosts } from '../graphql/queries'
import ReactMarkdown from 'react-markdown'

const MyPosts = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    const { username } = await Auth.currentAuthenticatedUser()
    const postData = await API.graphql({
      query: listPosts,
      variables: {username}
    })
    const posts = postData.data.listPosts.items
    setPosts(posts)
    setLoading(false)
  }

  return (
    <div>
      <h2 className="text-3xl font-semibold tracking-wide mt-6 text-purple-500">My Posts</h2>
      <div className="mt-4 flex flex-col space-y-4">
        {posts.map(post => (
          <div key={post.id} className="bg-white cursor-pointer p-4 rounded-lg shadow-sm">
            <div className="mt-4">
              <h1 className="text-2xl font-semibold tracking-wide">{post.title}</h1>
              <p className='text-gray-500 text-sm'>By {post.username}</p>
              <p className='text-gray-500 text-sm'>Created: {new Date(post.createdAt).toDateString()}</p>
              <div className="mt-4 text-base leading-relaxed text-left break-words whitespace-pre-line overflow-hidden">
                <ReactMarkdown>{post.content}</ReactMarkdown>
              </div>
            </div>
            <div className="mt-4 flex space-x-4">
              <Link href={`/posts/edit/${post.id}`}>
                <button 
                type="button" 
                className="px-3 py-1 text-sm text-purple-500 font-semibold rounded-3xl border border-gray-300 hover:bg-purple-500 hover:text-white focus:outline-none hover:border-purple-500"
                >
                  Edit Post
                </button>
              </Link>
              <Link href={`/posts/${post.id}`}>
                <button 
                  type="button" 
                  className="px-3 py-1 text-sm text-purple-500 font-semibold rounded-3xl border border-gray-300 hover:bg-purple-500 hover:text-white focus:outline-none hover:border-purple-500"
                  >
                    View Post
                </button>   
              </Link>
              <button
                type="button"
                className="py-1 text-sm text-red-500 font-semibold hover:text-red-600"
                onClick={() => deletePost(post.id)}
                >
                  Delete Post
              </button>       
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyPosts


