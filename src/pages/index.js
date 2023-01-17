import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { API } from 'aws-amplify'
import { listPosts } from '../../src/graphql/queries'
import ReactMarkdown from 'react-markdown'

const Home = () => {
  const [posts, setPosts] = useState([])

  const fetchPosts = async () => {
    try {
      const postData = await API.graphql({ query: listPosts })
      const posts = postData.data.listPosts.items
      setPosts(posts)
    } catch (err) { console.log('error fetching posts') }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  return (
    <div>
      <h2 className="text-3xl font-semibold tracking-wide mt-6 text-purple-500">All Posts</h2>
      <div className="mt-4 flex flex-col space-y-4">
        {posts.map(post => (
          <Link href={`/posts/${post.id}`} key={post.id}>
            <div className="mt-4bg-white cursor-pointer p-4 rounded-lg shadow-sm hover:shadow-md transition duration-200 ease-in">
              <h1 className="text-2xl font-semibold tracking-wide">{post.title}</h1>
              <p className='text-gray-500 text-sm'>By {post.username}</p>
              <p className='text-gray-500 text-sm'>Created: {new Date(post.createdAt).toDateString()}</p>
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Home
