import React, { useRef, useContext } from 'react'

// Package imports
import { Center, AlertDialog, Button } from 'native-base'

// Custom imports
import { SpaceBookContext } from '../../context/SpacebookContext'

export default function ErrorPopup () {
  // Context state
  const { errorAlertVisible, setErrorAlertVisible, errorAlertTitle, errorAlertMessage, setLoadingSpinnerVisible } = useContext(SpaceBookContext)

  // Close error modal
  const onClose = () => {
    setErrorAlertVisible(false)
    setLoadingSpinnerVisible(false)
  }
  const cancelRef = useRef(null)

  return (
    <Center>
      <AlertDialog leastDestructiveRef={cancelRef} isOpen={errorAlertVisible} onClose={onClose}>
        <AlertDialog.Content>
          <AlertDialog.Header>{errorAlertTitle}</AlertDialog.Header>
          <AlertDialog.Body>
            {errorAlertMessage}
          </AlertDialog.Body>
          <AlertDialog.Footer>
              <Button onPress={onClose}>
                Ok
              </Button>
          </AlertDialog.Footer>
        </AlertDialog.Content>
      </AlertDialog>
    </Center>
  )
}
