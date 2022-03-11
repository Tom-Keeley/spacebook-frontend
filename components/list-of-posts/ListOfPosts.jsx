import React, { useEffect, useState } from 'react'
import { Box } from 'native-base'
import propTypes from 'prop-types'
import ViewPost from '../view-post/ViewPost'

import Post from '../post/Post'
export default function ListOfPosts ({ id, getPosts, posts, updateUserPost }) {
  const [singlePostData, setSinglePostData] = useState({})
  const [viewPostVisible, setViewPostVisible] = useState(false)

  useEffect(async () => {
    getPosts()
  }, [])

  const viewPost = (id, postId) => {
    setSinglePostData({ id: id, postId: postId })
    setViewPostVisible(true)
  }

  // Use text as the key to ensure that it is unique and so will always re render
  return (
    <>
      {viewPostVisible ? <ViewPost postData={singlePostData} viewPostVisible={viewPostVisible} setViewPostVisible={setViewPostVisible} /> : null}
      <Box safeArea bg={'white'} p={'5'} m={'2'} borderRadius={'5'} shadow={'5'}>
        {posts.map(post => { return (<Post id={id} key={post.text} post={post} getPosts={getPosts} updateUserPost={updateUserPost} viewPost={viewPost}/>) })}
      </Box>
    </>
  )
}

ListOfPosts.propTypes = {
  id: propTypes.number.isRequired,
  getPosts: propTypes.func.isRequired,
  posts: propTypes.array.isRequired,
  updateUserPost: propTypes.func.isRequired
}
