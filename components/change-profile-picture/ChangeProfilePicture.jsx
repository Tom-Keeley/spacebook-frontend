import React, { useContext, useState, useEffect } from 'react'

// Package imports
import { Menu, Center, View, Pressable, useToast } from 'native-base'
import { FontAwesome5 } from '@expo/vector-icons'
import { Camera } from 'expo-camera'
import * as ImagePicker from 'expo-image-picker'
import propTypes from 'prop-types'

// Custom imports
import { SpaceBookContext } from '../../context/SpacebookContext'
import { uploadProfilePicture, getUserProfilePic } from '../../utils/HelperFunctions'

export default function ChangeProfilePicture ({ setImage }) {
  // Local State
  const [hasPermission, setHasPermission] = useState(null)

  // Context state
  const { setLoadingSpinnerVisible, token, userId, setErrorAlertProps, userDetailsUpdated, setUserDetailsUpdated } = useContext(SpaceBookContext)

  // Init
  const toast = useToast()

  // Request camera persmission and fetch profile pic
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

  // User details updated - show success message
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

  // Permssion not allowed show error
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

  // Select profile picture from gallery
  const selectProfilePicture = async () => {
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

  // Upload new profile picture to server
  const uploadToServer = async (data) => {
    setLoadingSpinnerVisible(true)
    const response = await uploadProfilePicture(token, userId, setErrorAlertProps, data)
    if (response.success === true) {
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
      <Center>
        <Menu placement='bottom' shadow={2} trigger={triggerProps => {
          return <Pressable accessibilityLabel="More options menu" {...triggerProps}>
            <FontAwesome5 name="edit" size={24} color="black" />
          </Pressable>
        }}>
          <Menu.Item onPress={selectProfilePicture}>Gallery</Menu.Item>
        </Menu>
      </Center>
    </>
  )
}

ChangeProfilePicture.propTypes = {
  setImage: propTypes.func.isRequired
}
