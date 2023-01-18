import React, { useState, useEffect } from 'react'
import { API } from 'aws-amplify'
import { useRouter } from 'next/router'
import { v4 as uuid } from 'uuid'
import dynamic from 'next/dynamic'
const SimpleMDE = dynamic(() => import('react-simplemde-editor'), { ssr: false })
import 'easymde/dist/easymde.min.css'
import { updatePost as updatePostMutation } from '../../../src/graphql/mutations'
import { getPost } from '../../../src/graphql/queries'


const EditPost = () => {
  const [post, setPost] = useState(null)
  const router = useRouter()
  const { id } = router.query

  useEffect(() => {
    fetchPost()

    async function fetchPost() {
      if (!id) return
      const postData = await API.graphql({ query: getPost, variables: { id } })
      setPost(postData.data.getPost)
    }
  }, [id])

  if(!post) return null

  const onChange = (e) => {
    setPost(() => ({ ...post, [e.target.name]: e.target.value }))
  }

  const { title, content } = post
  
  const updatePost = async () => {
    if (!title || !content) return
    await API.graphql({ query: updatePostMutation, variables: { input: { id, title, content } }, authMode: 'AMAZON_COGNITO_USER_POOLS' })
    router.push(`/my-posts`)
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-wide mt-6">Update post</h1>
      <input
        onChange={onChange}
        name="title"
        placeholder="Title"
        value={title}
        className="w-full px-4 py-2 border rounded-lg my-2 focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-blue-500"
      />
      <SimpleMDE
        onChange={value => setPost(() => ({...post, content: value}))}
        value={content}
      />

      <button type='button' className="px-4 py-2 font-semibold tracking-wide text-white transition-colors duration-200 transform bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none focus:bg-blue-500" onClick={updatePost}>Update Post</button>
    </div>
  )
}

export default EditPost
   

