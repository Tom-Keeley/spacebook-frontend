import React, { useState, useContext, useEffect } from 'react'
import { Fab, Icon, Modal, FormControl, Button, TextArea, AddIcon, useToast } from 'native-base'
import { AntDesign, FontAwesome } from '@expo/vector-icons'
import { createNewPost, updateAPost } from '../../utils/HelperFunctions'
import LoadingSpinner from '../loading-spinner/LoadingSpinner'
import ErrorPopup from '../error-popup/ErrorPopup'
import { SpaceBookContext } from '../../context/SpacebookContext'
import propTypes from 'prop-types'
import DraftMenu from '../draft-menu/DraftMenu'

export default function CreatePost ({ id, getPosts, updatePost, setUpdatePost, postToUpdate }) {
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({})
  const [textAreaValue, setTextAreaValue] = useState('')
  const { token, setErrorAlertProps, loadingSpinnerVisible, setLoadingSpinnerVisible, errorAlertVisible } = useContext(SpaceBookContext)
  const toast = useToast()

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

  useEffect(() => {
    if (updatePost === true) {
      setTextAreaDefaultText(false, null)
    }
  }, [updatePost])

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
