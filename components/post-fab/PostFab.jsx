import React, { useState, useContext, useEffect } from 'react'

// Package imports
import { Fab, Icon, Modal, FormControl, Button, TextArea, AddIcon, useToast } from 'native-base'
import { AntDesign, FontAwesome } from '@expo/vector-icons'
import propTypes from 'prop-types'

// Custom imports
import { SpaceBookContext } from '../../context/SpacebookContext'
import { createNewPost, updateAPost } from '../../utils/HelperFunctions'
import LoadingSpinner from '../loading-spinner/LoadingSpinner'
import ErrorPopup from '../error-popup/ErrorPopup'
import DraftMenu from '../draft-menu/DraftMenu'

export default function CreatePost ({ id, getPosts, updatePost, setUpdatePost, postToUpdate }) {
  // Local state
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({})
  const [textAreaValue, setTextAreaValue] = useState('')

  // Context API
  const { token, setErrorAlertProps, loadingSpinnerVisible, setLoadingSpinnerVisible, errorAlertVisible } = useContext(SpaceBookContext)

  // Init
  const toast = useToast()

  // When user wants to/has finished updating a post show/hide the update modal
  useEffect(() => {
    if (updatePost === true) {
      setShowModal(true)
    }
  }, [updatePost])

  useEffect(() => {
    if (showModal === false) {
      setUpdatePost(false)
    }
  }, [showModal])

  // Add post to sever
  const addPost = async () => {
    setLoadingSpinnerVisible(true)
    const response = await createNewPost(token, id, formData.text, setErrorAlertProps)
    if (response.success === true) {
      getPosts()
      toast.show({
        title: 'Created post',
        status: 'success',
        placement: 'top'
      })
      setLoadingSpinnerVisible(false)
      setShowModal(false)
    }
  }

  // Update a post and send to server
  const updateUserPost = async () => {
    setLoadingSpinnerVisible(true)
    const result = await updateAPost(token, id, postToUpdate.post_id, formData.text, setErrorAlertProps)
    if (result.success === true) {
      console.log('here')
      getPosts()
      toast.show({
        title: 'Updated Post',
        status: 'success',
        placement: 'top'
      })
    }
    setLoadingSpinnerVisible(false)
    setShowModal(false)
  }

  // Set the text for the text area
  const setTextAreaDefaultText = (draft, text) => {
    if (draft === true) {
      setTextAreaValue(text)
    } else if (draft === false) {
      if (updatePost === false) {
        setTextAreaValue(null)
      } else if (updatePost === true) {
        setTextAreaValue(postToUpdate.text)
      }
    }
  }

  // When the text area is being used to update a post not a draft use that posts text instead
  useEffect(() => {
    if (updatePost === true) {
      setTextAreaDefaultText(false, null)
    }
  }, [updatePost])

  // Needed to update formData as the text area is a controlled component
  useEffect(() => {
    setFormData({ ...formData, text: textAreaValue })
  }, [textAreaValue])

  return (
    <>
      {loadingSpinnerVisible && <LoadingSpinner />}
      {errorAlertVisible && <ErrorPopup />}
      <Fab onPress={() => setShowModal(true)} renderInPortal={false} shadow={2} size="sm" icon={<Icon color="white" as={<AntDesign name="plus" />} size="sm" />} />
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>{updatePost === false ? 'New Post' : 'Update Post'}</Modal.Header>
          <Modal.Body>
            <FormControl>
              <FormControl.Label>Message</FormControl.Label>
              <TextArea value={textAreaValue} onChangeText={value => setTextAreaValue(value)} h={40} placeholder="Enter your message" />
            </FormControl>
            {formData.text ? <DraftMenu text={formData.text} setTextAreaDefaultText={setTextAreaDefaultText}/> : null}
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button variant="ghost" colorScheme="blueGray" onPress={() => { setShowModal(false) }}>
                Cancel
              </Button>
              <Button onPress={updatePost === false ? addPost : updateUserPost} leftIcon={updatePost === false ? <AddIcon size="4" /> : <FontAwesome name="upload" color="white" />}>
                {updatePost === false ? 'Add Post' : 'Update'}
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </>
  )
}

CreatePost.propTypes = {
  id: propTypes.number.isRequired,
  getPosts: propTypes.func.isRequired,
  updatePost: propTypes.bool.isRequired,
  setUpdatePost: propTypes.func.isRequired,
  postToUpdate: propTypes.object.isRequired
}
