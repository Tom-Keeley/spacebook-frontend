import React, { useState, useEffect, useContext } from 'react'
import { Box } from 'native-base'

import { getPostsForAUser } from '../../utils/HelperFunctions'
import { SpaceBookContext } from '../../context/SpacebookContext'
import Post from '../post/Post'

export default function ListOfPosts ({ id }) {
  const { token, setErrorAlertProps } = useContext(SpaceBookContext)
  const [posts, setPosts] = useState([])

  useEffect(async () => {
    const results = await getPostsForAUser(token, id, setErrorAlertProps)
    console.log(results)
    setPosts(results.posts)
  }, [])

  return (
    <Box safeArea bg={'white'} p={'5'} m={'2'} borderRadius={'5'} shadow={'5'}>
      {posts.map(post => { return (<Post id={id} key={post.post_id} post={post} />) })}
    </Box>
  )
}
