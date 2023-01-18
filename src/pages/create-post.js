import React, { useState, useRef } from 'react'
import Image from 'next/image'
import { API, Storage } from 'aws-amplify'
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

  const [image , setImage] = useState(null)
  const imageFileInput = useRef(null)

  const handleTitleChange = e => {
    setPost(() => ({...post, [e.target.name]: e.target.value}))
  }

  const handleContentChange = e => {
    setPost(() => ({...post, content: e.target.value}))
  }

  const createPost = async () => {
    if (!title || !content) return
    post.id = uuid()

    if(image) {
      const filename = `${image.name}_${uuid()}`
      post.coverImage = filename
      await Storage.put(filename, image)
    }


    await API.graphql({ query: createPostMutation, variables: { input: post }, authMode: 'AMAZON_COGNITO_USER_POOLS' })
    router.push(`/posts/${post.id}`)
  }

  const uploadImage = async () => {
    imageFileInput.current.click()
  }

  const handleImageChange = async e => {
    const fileUploaded = e.target.files[0]
    if(!fileUploaded) return
    setImage(fileUploaded)
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

      {
        image && (
          <div className="">
            <Image
              src={URL.createObjectURL(image)}
              alt="Cover Image"
              width={300}
              height={200}
              objectFit="cover"
            />
            <button
              type='button'
              className="mb-2 px-2 py-1 text-xs font-semibold tracking-wide text-white transition-colors duration-200 transform bg-red-600 hover:bg-red-500 focus:outline-none focus:bg-red-500"
              onClick={() => setImage(null)}
            >
              Remove Image
            </button>
          </div>
        )
      }
      <SimpleMDE
        onChange={value => setPost(() => ({...post, content: value}))}
        value={content}
      />
      <input
        type="file"
        ref={imageFileInput}
        onChange={handleImageChange}
        className="hidden"
      />
      <button
        type='button'
        className="mr-2 px-4 py-2 font-semibold tracking-wide text-white transition-colors duration-200 transform bg-green-500 hover:bg-green-400 focus:outline-none focus:bg-green-400"
        onClick={() => uploadImage()}
      >
        Upload Image
      </button>
      <button type='button' className="px-4 py-2 font-semibold tracking-wide text-white transition-colors duration-200 transform bg-blue-600 hover:bg-blue-500 focus:outline-none focus:bg-blue-500" onClick={createPost}>Create Post</button>
    </div>
  )
}

export default withAuthenticator(CreatePost)

