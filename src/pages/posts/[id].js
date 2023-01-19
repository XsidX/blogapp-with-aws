import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { API, Storage } from 'aws-amplify'
import { useRouter } from 'next/router'
import ReactMarkdown from 'react-markdown'
import { v4 as uuid } from 'uuid'
import '../../../configureAmplify'
import { listPosts, getPost } from '../../graphql/queries'
import { createComment as createCommentMutation } from '../../graphql/mutations'
import dynamic from 'next/dynamic'
const SimpleMDE = dynamic(() => import('react-simplemde-editor'), { ssr: false })
import 'easymde/dist/easymde.min.css'


const initialState = { message: '' }

const Post = ({ post }) => {
  const [coverImage, setCoverImage] = useState(null)

  const [comment, setComment] = useState(initialState)
  const [showComments, setShowComments] = useState(false)

  const { message } = comment

  const toggleComments = () => setShowComments(!showComments)

  const updateCoverImage = async () => {
    if (!post.coverImage) return
    const imageKey = await Storage.get(post.coverImage)
    setCoverImage(imageKey)
  }

  useEffect(() => {
    updateCoverImage()
  }, [])

  const router = useRouter()
  
  if (router.isFallback) {
    return <div>Loading...</div>
  }

  const createComment = async () => {
    if (!message) return
    const id = uuid()
    comment.id = id

    try{
    await API.graphql({
      query: createCommentMutation,
      variables: { input: comment },
      authMode: 'AMAZON_COGNITO_USER_POOLS',
    })
    } catch (err) {
      console.log('error creating comment:', err)
    }

    router.push(`/posts/${post.id}`)
  }
  
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-wide mt-6">{post.title}</h1>
      {coverImage && (
        <div className="my-4">
          <Image
            src={coverImage}
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
      <div className="mt-4 text-base leading-relaxed text-left break-words whitespace-pre-line overflow-hidden">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>
      {/* comments */}
      <div className="mt-4">
        <h2 className="text-xl font-semibold tracking-wide">Comments</h2>
        {
          post.comments.items && post.comments.items.map(comment => (
            <div key={comment.id} className="mt-4 space-y-2">
              <p className="text-gray-700 text-sm">
                {comment.message} - {comment.username}
              </p>
              <p className="text-gray-500 text-xs">
                {new Date(comment.createdAt).toDateString()}
              </p>
            </div>
          ))
        }

        {
          post.comments.items.length === 0 && (
            <p className="mt-4">No comments yet</p>
          )
        }
      </div>

      <div className="mt-4">
        <button
          className="text-sm font-semibold text-blue-500"
          onClick={toggleComments}
        >
          Write a comment
        </button>
        {showComments && (
          <div className="mt-4">
            <SimpleMDE
              value={message}
              onChange={value => setComment({ ...comment, message: value, postId: post.id })}
            />
            <button
              type='button'
              className="mt-2 font-semibold text-blue-500"
              onClick={() => createComment({ variables: { input: comment } })}
            >
              Save
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
 
export default Post

export async function getStaticPaths() {
  const { data } = await API.graphql({ query: listPosts })
  const paths = data.listPosts.items.map(post => ({ params: { id: post.id } }))
  return { paths, fallback: true }
}

export async function getStaticProps({ params }) {
  const { data } = await API.graphql({ query: getPost, variables: { id: params.id } })
  return { props: { post: data.getPost }, revalidate: 1 }
}

