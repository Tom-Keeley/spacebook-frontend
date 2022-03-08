import React, { useState, useContext } from 'react'
import { Fab, Icon, Modal, FormControl, Button, TextArea, AddIcon, useToast } from 'native-base'
import { AntDesign } from '@expo/vector-icons'
import { createNewPost } from '../../utils/HelperFunctions'
import LoadingSpinner from '../loading-spinner/LoadingSpinner'
import ErrorPopup from '../error-popup/ErrorPopup'
import { SpaceBookContext } from '../../context/SpacebookContext'
import propTypes from 'prop-types'

export default function CreatePost ({ id }) {
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({})
  const { token, setErrorAlertProps, loadingSpinnerVisible, setLoadingSpinnerVisible, errorAlertVisible } = useContext(SpaceBookContext)
  const toast = useToast()

  const addPost = async () => {
    setLoadingSpinnerVisible(true)
    const response = await createNewPost(token, id, formData.text, setErrorAlertProps)
    if (response.success === true) {
      toast.show({
        title: 'Created post',
        status: 'success',
        placement: 'top'
      })
      setLoadingSpinnerVisible(false)
      setShowModal(false)
    }
  }

  return (
    <>
      {loadingSpinnerVisible && <LoadingSpinner />}
      {errorAlertVisible && <ErrorPopup />}
      <Fab onPress={() => setShowModal(true)} renderInPortal={false} shadow={2} size="sm" icon={<Icon color="white" as={<AntDesign name="plus" />} size="sm" />} />
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>New Post</Modal.Header>
          <Modal.Body>
            <FormControl>
              <FormControl.Label>Message</FormControl.Label>
              <TextArea onChangeText={value => setFormData({ ...formData, text: value })} h={40} placeholder="Enter your message"/>
            </FormControl>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button variant="ghost" colorScheme="blueGray" onPress={() => { setShowModal(false) }}>
                Cancel
              </Button>
              <Button onPress={addPost} leftIcon={<AddIcon size="4" />}>
                Add Post
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </>
  )
}

CreatePost.propTypes = {
  id: propTypes.number.isRequired
}
