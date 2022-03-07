import React, { useContext, useState, useEffect } from 'react'
import { Modal, Box, Button, Menu, Center, View, Pressable, useToast } from 'native-base'
import { FontAwesome5, Ionicons } from '@expo/vector-icons'
import { TouchableOpacity } from 'react-native'
import { Camera } from 'expo-camera'
import * as ImagePicker from 'expo-image-picker'
import propTypes from 'prop-types'

import { SpaceBookContext } from '../../context/SpacebookContext'
import { uploadProfilePicture, getUserProfilePic } from '../../utils/HelperFunctions'

export default function ChangeProfilePicture ({ setImage }) {
  const [type, setType] = useState(Camera.Constants.Type.back)
  const [hasPermission, setHasPermission] = useState(null)
  const [showCameraModal, setShowCameraModal] = useState(false)
  const { setLoadingSpinnerVisible, token, userId, setErrorAlertProps, userDetailsUpdated, setUserDetailsUpdated } = useContext(SpaceBookContext)
  let camera = Camera
  const toast = useToast()

  useEffect(async () => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync()
      setHasPermission(status === 'granted')
    })()

    const profilePictureResponse = await getUserProfilePic(token, userId, setErrorAlertProps)
    if (profilePictureResponse.success === true) {
      setImage(profilePictureResponse.data)
    }
  }, [])

  useEffect(() => {
    if (userDetailsUpdated === true) {
      toast.show({
        title: 'Details Updated',
        status: 'success',
        placement: 'top'
      })
    }
    setUserDetailsUpdated(false)
  }, [userDetailsUpdated])

  if (hasPermission === null) {
    return <View />
  }
  if (hasPermission === false) {
    toast.show({
      title: 'Cannot access camera',
      status: 'error',
      placement: 'top'
    })
  }

  const selectProfilePicture = async () => {
    console.log('worked')
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    })

    if (!result.cancelled) {
      setImage(result.uri)
      const res = await fetch(result.uri)
      const blob = await res.blob()
      uploadToServer(blob)
    }
  }

  const takePicture = async () => {
    const options = {
      quality: 0.5,
      base64: true,
      onPictureSaved: async (data) => {
        const res = await fetch(data.uri)
        const blob = await res.blob()
        uploadToServer(blob)
      }
    }
    const data = await camera.takePictureAsync(options)
    setImage(data.uri)
  }

  const uploadToServer = async (data) => {
    setLoadingSpinnerVisible(true)
    const response = await uploadProfilePicture(token, userId, setErrorAlertProps, data)
    if (response.success === true) {
      setShowCameraModal(false)
      setLoadingSpinnerVisible(false)
      toast.show({
        title: 'Profile picture updated',
        status: 'success',
        placement: 'top'
      })
    }
  }

  return (
    <>
      <Modal size={'xl'} h='100%' isOpen={showCameraModal} onClose={() => setShowCameraModal(false)}>
        <Modal.Content minHeight='80%' maxWidth="400px">
          <Modal.Header>Take Photo</Modal.Header>
          <Modal.Body>
            <Box h='550px'>
              <Camera ref={(r) => { camera = r }} type={type}>
                <View m='2'>
                  <TouchableOpacity
                    onPress={() => { setType(type === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back) }}>
                    <Ionicons name="ios-camera-reverse-sharp" size={24} color="white" />
                  </TouchableOpacity>
                </View>
              </Camera>
            </Box>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button variant="ghost" colorScheme="blueGray" onPress={() => { setShowCameraModal(false) }}>
                Cancel
              </Button>
              <Button onPress={() => { takePicture() }}>
                Take Photo
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
      <Center>
        <Menu placement='bottom' shadow={2} trigger={triggerProps => {
          return <Pressable accessibilityLabel="More options menu" {...triggerProps}>
            <FontAwesome5 name="edit" size={24} color="black" />
          </Pressable>
        }}>
          <Menu.Item onPress={() => setShowCameraModal(true)}>Take Photo</Menu.Item>
          <Menu.Item onPress={selectProfilePicture}>Gallery</Menu.Item>
        </Menu>
      </Center>
    </>
  )
}

ChangeProfilePicture.propTypes = {
  setImage: propTypes.func.isRequired
}
