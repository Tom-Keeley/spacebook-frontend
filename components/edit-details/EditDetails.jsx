import React, { useState } from 'react'
import { Modal, Button, View } from 'native-base'

// Custom Import
import SignUpForm from '../forms/UserForm'

export default function EditDetails ({ firstName, lastName, email }) {
  const [showModal, setShowModal] = useState(false)

  return (
    <View>
      <Button onPress={() => { setShowModal(true) }}>Edit Details</Button>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Edit Details</Modal.Header>
          <SignUpForm type="edit" firstName={firstName} lastName={lastName} email={email} />
        </Modal.Content>
      </Modal>
    </View>
  )
}
