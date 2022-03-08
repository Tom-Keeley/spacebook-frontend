import React, { useContext, useState, useEffect } from 'react'
import { Box, Text, VStack, Button, HStack, Center, useToast } from 'native-base'
import { FontAwesome5 } from '@expo/vector-icons'
import { likeAPost, removeLikeFromAPost } from '../../utils/HelperFunctions'
import { SpaceBookContext } from '../../context/SpacebookContext'
import propTypes from 'prop-types'

export default function Post ({ id, post }) {
  const { token, setErrorAlertProps } = useContext(SpaceBookContext)
  const [postLikes, setPostLikes] = useState(0)
  const [likedPost, setLikedPost] = useState(false)
  const toast = useToast()

  useEffect(() => {
    setPostLikes(post.numLikes)
  }, [])

  const likePost = async () => {
    const response = await likeAPost(token, id, post.post_id, setErrorAlertProps)
    console.log(response)
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

  return (
    <Box m={2} p={2} minH={100} borderRadius={'5'} shadow={'5'}>
      <VStack>
        <Text bold>{`${post.author.first_name} ${post.author.last_name}`}</Text>
        <Text>{`Posted: ${post.timestamp}`}</Text>
        <Text>{post.text}</Text>
        <Center w='100%'>
          <HStack w="100%" ml={'150%'}>
              <Button onPress={likedPost === false ? likePost : removeLikeFromPost} variant={'ghost'} leftIcon={<FontAwesome5 name="thumbs-up" size={20} color="black" />} />
              <Text alignSelf={'center'}>{postLikes}</Text>
          </HStack>
        </Center>
      </VStack>
    </Box>
  )
}

Post.propTypes = {
  id: propTypes.number.isRequired,
  post: propTypes.object.isRequired
}
