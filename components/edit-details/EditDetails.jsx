import React, { useContext } from 'react'

// Package imports
import { Modal, Button, Box } from 'native-base'
import propTypes from 'prop-types'

// Custom Import
import UserForm from '../forms/UserForm'
import { SpaceBookContext } from '../../context/SpacebookContext'

export default function EditDetails ({ firstName, lastName, email, navigation }) {
  // Context state
  const { formModalVisible, setFormModalVisible } = useContext(SpaceBookContext)

  return (
    <Box bg={'white'} p={'10'} m={'2'} borderRadius={'5'} shadow={5}>
      <Button onPress={() => { setFormModalVisible(true) }}>Edit Details</Button>
      <Modal isOpen={formModalVisible} onClose={() => setFormModalVisible(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Edit Details</Modal.Header>
          <UserForm type="edit" navigation={navigation} firstName={firstName} lastName={lastName} email={email} />
        </Modal.Content>
      </Modal>
    </Box>
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
