import React, { useEffect } from 'react'
import { Box } from 'native-base'
import propTypes from 'prop-types'

import Post from '../post/Post'
export default function ListOfPosts ({ id, getPosts, posts, updateUserPost }) {
  useEffect(async () => {
    getPosts()
  }, [])

  return (
    <Box safeArea bg={'white'} p={'5'} m={'2'} borderRadius={'5'} shadow={'5'}>
      {posts.map(post => { return (<Post id={id} key={post.post_id} post={post} getPosts={getPosts} updateUserPost={updateUserPost}/>) })}
    </Box>
  )
}

ListOfPosts.propTypes = {
  id: propTypes.number.isRequired,
  getPosts: propTypes.func.isRequired,
  posts: propTypes.array.isRequired,
  updateUserPost: propTypes.func.isRequired
}
