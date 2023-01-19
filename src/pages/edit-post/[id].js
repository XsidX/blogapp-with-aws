import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { API, Storage } from 'aws-amplify'
import { useRouter } from 'next/router'
import { v4 as uuid } from 'uuid'
import dynamic from 'next/dynamic'
const SimpleMDE = dynamic(() => import('react-simplemde-editor'), { ssr: false })
import 'easymde/dist/easymde.min.css'
import { updatePost as updatePostMutation } from '../../../src/graphql/mutations'
import { getPost } from '../../../src/graphql/queries'


const EditPost = () => {
  const [post, setPost] = useState(null)
  const [coverImage, setCoverImage] = useState(null)
  const [coverImagePreview, setCoverImagePreview] = useState(null)

  const fileInputRef = useRef(null)

  const router = useRouter()
  const { id } = router.query

  const updateCoverImage = async (coverImage) => {
    const imageKey = await Storage.get(coverImage)
    setCoverImage(imageKey)
  }

  useEffect(() => {
    fetchPost()
    async function fetchPost() {
      if (!id) return
      const postData = await API.graphql({ query: getPost, variables: { id } })
      setPost(postData.data.getPost)

      if (postData.data.getPost.coverImage) {
        updateCoverImage(postData.data.getPost.coverImage)
      }
    }
  }, [id])

  if(!post) return null

  const handleFileChange= async (e) => {
    const fileUpload = e.target.files[0]
    if(!fileUpload) return
    setCoverImage(fileUpload)
    setCoverImagePreview(URL.createObjectURL(fileUpload))
  }

  const uploadImage= async () => {
    fileInputRef.current.click()
  }

  const onChange = (e) => {
    setPost(() => ({ ...post, [e.target.name]: e.target.value }))
  }

  const { title, content } = post
  
  const updatePost = async () => {
    if (!title || !content) return
    const input = { id, title, content }

    if (coverImage && coverImagePreview) {
      const fileName = `${coverImage.name}_${uuid()}`
      input.coverImage = fileName
      await Storage.put(fileName, coverImage)      
    }
    await API.graphql({ query: updatePostMutation, variables: { input }, authMode: 'AMAZON_COGNITO_USER_POOLS' })
    router.push(`/my-posts`)
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-wide mt-6 text-purple-500">Update post</h1>
      {coverImage && (
          <Image
            src={coverImagePreview ? coverImagePreview : coverImage}
            alt={post.title}
            width={800}
            height={300}
            objectFit="cover"
            className="mt-4"
          />
        )
      }
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
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      <div className="flex space-x-2">
        <button
          className="px-4 py-2 font-semibold tracking-wide text-white transition-colors duration-200 transform bg-blue-600 hover:bg-blue-500 focus:outline-none focus:bg-blue-500"
          onClick={uploadImage}
        >
          Update Cover Image
        </button>
        <button type='button' className="px-4 py-2 font-semibold tracking-wide text-white transition-colors duration-200 transform bg-blue-600 hover:bg-blue-500 focus:outline-none focus:bg-blue-500" onClick={updatePost}>Update Post</button>
      </div>

    </div>
  )
}

export default EditPost
   

