import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { API, Storage } from 'aws-amplify'
import { listPosts } from '../../src/graphql/queries'
import ReactMarkdown from 'react-markdown'

const Home = () => {
  const [posts, setPosts] = useState([])

  const fetchPosts = async () => {
    try {
      const postData = await API.graphql({ query: listPosts })
      const posts = postData.data.listPosts.items

      const postsWithImages = await Promise.all(posts.map(async post => {
        if (post.coverImage) {
          const image = await Storage.get(post.coverImage)
          post.coverImage = image
        }
        return post
      }))
      setPosts(postsWithImages)
      
    } catch (err) { console.log('error fetching posts') }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  return (
    <div>
      <h2 className="text-3xl font-semibold tracking-wide mt-6 text-purple-500">All Posts</h2>
      <div className="mt-4 grid grid-cols-2 gap-4">
        {posts.map(post => (
          <Link href={`/posts/${post.id}`} key={post.id}>
            <div className="span-1 mt-4 bg-white cursor-pointer p-4 rounded-lg shadow-sm hover:shadow-md transition duration-200 ease-in">
              <h1 className="text-2xl font-semibold tracking-wide">{post.title}</h1>
              {post.coverImage && (
                <div className="my-4">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    width={800}
                    height={600}
                    layout="responsive"
                    objectFit="cover"
                  />
                </div>
              )}
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
