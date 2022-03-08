import React, { useContext, useState, useEffect } from 'react'
import { Box, Text, VStack, Button, HStack, Center, useToast } from 'native-base'
import { FontAwesome5, FontAwesome } from '@expo/vector-icons'
import { likeAPost } from '../../utils/HelperFunctions'
import { SpaceBookContext } from '../../context/SpacebookContext'
import propTypes from 'prop-types'

export default function Post ({ id, post }) {
  const { token, setErrorAlertProps } = useContext(SpaceBookContext)
  const [postLikes, setPostLikes] = useState(0)
  const toast = useToast()

  useEffect(() => {
    setPostLikes(post.numLikes)
  }, [])

  const likePost = async () => {
    const response = await likeAPost(token, id, post.post_id, setErrorAlertProps)
    if (response.success === true) {
      setPostLikes(postLikes + 1)
      toast.show({
        title: 'Liked post',
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
              <Button onPress={likePost} variant={'ghost'} leftIcon={<FontAwesome5 name="thumbs-up" size={20} color="black" />} />
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
