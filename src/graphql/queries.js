/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getPost = /* GraphQL */ `
  query GetPost($id: ID!) {
    getPost(id: $id) {
      id
      title
      content
      username
      coverImage
      comments {
        items {
          id
          message
          postId
          createdAt
          updatedAt
          createdBy
        }
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const listPosts = /* GraphQL */ `
  query ListPosts(
    $filter: ModelPostFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPosts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        content
        username
        coverImage
        comments {
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const postsByUsername = /* GraphQL */ `
  query PostsByUsername(
    $username: String!
    $sortDirection: ModelSortDirection
    $filter: ModelPostFilterInput
    $limit: Int
    $nextToken: String
  ) {
    postsByUsername(
      username: $username
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        title
        content
        username
        coverImage
        comments {
          nextToken
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getComment = /* GraphQL */ `
  query GetComment($id: ID!) {
    getComment(id: $id) {
      id
      message
      post {
        id
        title
        content
        username
        coverImage
        comments {
          nextToken
        }
        createdAt
        updatedAt
      }
      postId
      createdAt
      updatedAt
      createdBy
    }
  }
`;
export const listComments = /* GraphQL */ `
  query ListComments(
    $filter: ModelCommentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listComments(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        message
        post {
          id
          title
          content
          username
          coverImage
          createdAt
          updatedAt
        }
        postId
        createdAt
        updatedAt
        createdBy
      }
      nextToken
    }
  }
`;
export const commentsByPostId = /* GraphQL */ `
  query CommentsByPostId(
    $postId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelCommentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    commentsByPostId(
      postId: $postId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        message
        post {
          id
          title
          content
          username
          coverImage
          createdAt
          updatedAt
        }
        postId
        createdAt
        updatedAt
        createdBy
      }
      nextToken
    }
  }
`;
