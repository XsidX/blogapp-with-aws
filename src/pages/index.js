import React, { useState, useEffect } from 'react'
import { API } from 'aws-amplify'
import { listPosts } from '../../src/graphql/queries'

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
      <h2 className="text-3xl font-semibold tracking-wide mt-6">Posts</h2>
      <div className="mt-8">
        {posts.map(post => (
          <div key={post.id} className="mt-4">
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="text-gray-500 mt-2">Author: {post.username}</p>
            <p className="mt-2 text-gray-600">{post.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home
