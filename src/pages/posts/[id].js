import React from 'react'
import { API } from 'aws-amplify'
import { useRouter } from 'next/router'
import ReactMarkdown from 'react-markdown'
import '../../../configureAmplify'
import { listPosts, getPost } from '../../graphql/queries'


const Post = ({ post }) => {
  const router = useRouter()
  
  if (router.isFallback) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-wide mt-6">{post.title}</h1>
      <ReactMarkdown>{post.content}</ReactMarkdown>
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

