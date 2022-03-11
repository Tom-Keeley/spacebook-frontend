import React, { useContext } from 'react'
import { Menu, Pressable, useToast } from 'native-base'
import { SimpleLineIcons } from '@expo/vector-icons'
import { deleteUserPost } from '../../utils/HelperFunctions'
import { SpaceBookContext } from '../../context/SpacebookContext'
import propTypes from 'prop-types'
import LoadingSpinner from '../loading-spinner/LoadingSpinner'
export default function PostOptions ({ id, postId, getPosts, updateUserPost, post }) {
  const { token, setErrorAlertProps, setLoadingSpinnerVisible } = useContext(SpaceBookContext)
  const toast = useToast()

  const deletePost = async () => {
    setLoadingSpinnerVisible(true)
    const response = await deleteUserPost(token, id, postId, setErrorAlertProps)
    if (response.success === true) {
      getPosts()
      toast.show({
        title: 'Post Deleted',
        status: 'success',
        placement: 'top'
      })
    }
    setLoadingSpinnerVisible(false)
  }

  return (
    <>
      <LoadingSpinner />
      <Menu mx={2} shadow={2} trigger={triggerProps => {
        return <Pressable accessibilityLabel="More options menu" {...triggerProps}>
          <SimpleLineIcons name="options-vertical" size={24} color="black" />
        </Pressable>
      }}>
        <Menu.Item onPress={() => updateUserPost(true, post)}>Edit Post</Menu.Item>
        <Menu.Item onPress={deletePost}>Delete Post</Menu.Item>
      </Menu>
    </>
  )
}

PostOptions.propTypes = {
  id: propTypes.number.isRequired,
  postId: propTypes.number.isRequired,
  getPosts: propTypes.func.isRequired,
  updateUserPost: propTypes.func.isRequired,
  post: propTypes.object.isRequired
}
