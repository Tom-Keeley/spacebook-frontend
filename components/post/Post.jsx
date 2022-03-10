import React, { useContext, useState, useEffect } from 'react'
import { Box, Text, VStack, Button, HStack, Center, useToast, Pressable } from 'native-base'
import { FontAwesome5 } from '@expo/vector-icons'
import { likeAPost, removeLikeFromAPost } from '../../utils/HelperFunctions'
import { SpaceBookContext } from '../../context/SpacebookContext'
import propTypes from 'prop-types'
import PostOptions from '../post-options/PostOptions'
export default function Post ({ id, post, getPosts, updateUserPost, viewPost }) {
  const { token, setErrorAlertProps } = useContext(SpaceBookContext)
  const [postText, setPostText] = useState('')
  const [postLikes, setPostLikes] = useState(0)
  const [likedPost, setLikedPost] = useState(false)
  const toast = useToast()

  useEffect(() => {
    setPostLikes(post.numLikes)
    setPostText(post.text)
  }, [])

  const likePost = async () => {
    const response = await likeAPost(token, id, post.post_id, setErrorAlertProps)
    if (response.success === true) {
      setLikedPost(true)
      setPostLikes(postLikes + 1)
      toast.show({
        title: 'Liked post',
        status: 'success',
        placement: 'top'
      })
    } else if (response.alreadyLiked === true) {
      removeLikeFromPost()
    }
  }

  const removeLikeFromPost = async () => {
    const response = await removeLikeFromAPost(token, id, post.post_id, setErrorAlertProps)
    if (response.success === true) {
      setLikedPost(false)
      setPostLikes(postLikes - 1)
      toast.show({
        title: 'Removed like',
        status: 'success',
        placement: 'top'
      })
    }
  }

  const renderText = () => {
    if (postText.length > 40) {
      return (
        <Text>{postText.substr(0, 40)} ...<Text color={'primary.400'}>See More</Text></Text>
      )
    } else {
      return (
      <Text>{postText}</Text>
      )
    }
  }

  return (
    <Pressable onPress={() => viewPost(id, post.post_id)}>
      <Box m={2} p={2} minH={100} borderRadius={'5'} shadow={'5'}>
        <VStack>
          <HStack width={'100%'} justifyContent={'space-between'}>
            <Text bold>{`${post.author.first_name} ${post.author.last_name}`}</Text>
            <PostOptions id={id} postId={post.post_id} getPosts={getPosts} updateUserPost={updateUserPost} post={post} />
          </HStack>
          <Text>{`Posted: ${post.timestamp}`}</Text>
          {renderText()}
          <Center w='100%'>
            <HStack w="100%" ml={'150%'}>
                <Button onPress={likedPost === false ? likePost : removeLikeFromPost} variant={'ghost'} leftIcon={<FontAwesome5 name="thumbs-up" size={20} color="black" />} />
                <Text alignSelf={'center'}>{postLikes}</Text>
            </HStack>
          </Center>
        </VStack>
      </Box>
    </Pressable>
  )
}

Post.propTypes = {
  id: propTypes.number.isRequired,
  post: propTypes.object.isRequired,
  getPosts: propTypes.func.isRequired,
  updateUserPost: propTypes.func.isRequired,
  viewPost: propTypes.func.isRequired
}
