import React, { useState } from 'react'
import { Modal, Button, View } from 'native-base'
import propTypes from 'prop-types'

// Custom Import
import UserForm from '../forms/UserForm'

export default function EditDetails ({ firstName, lastName, email, navigation }) {
  const [showModal, setShowModal] = useState(false)

  return (
    <View>
      <Button onPress={() => { setShowModal(true) }}>Edit Details</Button>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Edit Details</Modal.Header>
          <UserForm type="edit" navigation={navigation} firstName={firstName} lastName={lastName} email={email} />
        </Modal.Content>
      </Modal>
    </View>
  )
}

EditDetails.propTypes = {
  navigation: propTypes.shape({
    navigate: propTypes.func.isRequired
  }),
  firstName: propTypes.string.isRequired,
  lastName: propTypes.string.isRequired,
  email: propTypes.string.isRequired
}
