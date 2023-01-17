import React, { useState, useEffect } from 'react'
import { API } from 'aws-amplify'
import { useRouter } from 'next/router'
import { v4 as uuid } from 'uuid'
import { createPost as createPostMutation } from '../../src/graphql/mutations'
import dynamic from 'next/dynamic'
const SimpleMDE = dynamic(() => import('react-simplemde-editor'), { ssr: false })
import 'easymde/dist/easymde.min.css'
import { withAuthenticator } from '@aws-amplify/ui-react'


const initialState = {title: '', content: ''}

const CreatePost = () => {
  const [post, setPost] = useState(initialState)
  const { title, content } = post
  const router = useRouter()

  const handleTitleChange = e => {
    setPost(() => ({...post, [e.target.name]: e.target.value}))
  }

  const handleContentChange = e => {
    setPost(() => ({...post, content: e.target.value}))
  }

  const createPost = async () => {
    if (!title || !content) return
    post.id = uuid()
    await API.graphql({ query: createPostMutation, variables: { input: post }, authMode: 'AMAZON_COGNITO_USER_POOLS' })
    router.push(`/posts/${post.id}`)
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-wide mt-6">Create new post</h1>
      <input
        onChange={handleTitleChange}
        name="title"
        placeholder="Title"
        value={title}
        className="w-full px-4 py-2 border rounded-lg my-2 focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-blue-500"
      />
      <SimpleMDE
        onChange={value => setPost(() => ({...post, content: value}))}
        value={content}
      />
      <button type='button' className="px-4 py-2 font-semibold tracking-wide text-white transition-colors duration-200 transform bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none focus:bg-blue-500" onClick={createPost}>Create Post</button>
    </div>
  )
}

export default withAuthenticator(CreatePost)

