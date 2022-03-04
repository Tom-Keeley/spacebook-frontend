import React, { useContext, useEffect, useState } from 'react'
import { Avatar, VStack, Text, Center, Box, HStack, useToast, Button, View, Modal, Menu, Pressable } from 'native-base'
import { TouchableOpacity } from 'react-native'
import propTypes from 'prop-types'
import { FontAwesome5, Ionicons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import { Camera } from 'expo-camera'

// Custom imports
import EditDetails from '../../components/edit-details/EditDetails'
import ErrorPopup from '../../components/error-popup/ErrorPopup'
import { getUserDetails, getUserProfile, uploadProfilePicture } from '../../utils/HelperFunctions'
import LoadingSpinner from '../../components/loading-spinner/LoadingSpinner'

// ContextAPI
import { SpaceBookContext } from '../../context/SpacebookContext'

export default function ProfileScreen ({ route, navigation }) {
  const toast = useToast()
  const { loadingSpinnerVisible, setLoadingSpinnerVisible, setErrorAlertProps, errorAlertVisible, token, userId, firstName, setFirstName, lastName, setLastName, email, setEmail, userDetailsUpdated, setUserDetailsUpdated } = useContext(SpaceBookContext)
  const [image, setImage] = useState(null)
  const [hasPermission, setHasPermission] = useState(null)
  const [type, setType] = useState(Camera.Constants.Type.back)
  const [showCameraModal, setShowCameraModal] = useState(false)
  let camera = Camera
  const { profileType } = route.params
  console.log(profileType)

  // Runs on mount to get and set user details
  useEffect(async () => {
    const userDetailsResponse = await getUserDetails(token, userId, setErrorAlertProps)
    if (userDetailsResponse.success === true) {
      setFirstName(userDetailsResponse.firstName)
      setLastName(userDetailsResponse.lastName)
      setEmail(userDetailsResponse.email)
    }

    const profilePictureResponse = await getUserProfile(token, userId, setErrorAlertProps)
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

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync()
      setHasPermission(status === 'granted')
    })()
  }, [])

  // NEED TO SHOW THIS ON SCREEN
  if (hasPermission === null) {
    return <View />
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>
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
    <Center w={'100%'} h={'100%'}>
      {errorAlertVisible && <ErrorPopup />}
      {loadingSpinnerVisible && <LoadingSpinner />}
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
      <VStack >
        <Box bg={'white'} p={'10'} m={'2'} borderRadius={'5'} shadow={'5'}>
            <Avatar bg="green.500" alignSelf="center" size="2xl" source={{ uri: image }}></Avatar>
            <Box w={'100%'} mt='2'>
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
            </Box>
          <Center><Text fontSize="3xl">{`Welcome ${firstName}`}</Text></Center>
          <Center><Text fontSize="md">{`${email}`}</Text></Center>
        </Box>
        <Box bg={'white'} p={'10'} m={'2'} borderRadius={'5'} shadow={5}>
          <Center>
            <Text fontSize={'3xl'}>Your Details</Text>
          </Center>
          <Center>
            <HStack>
              <Text fontSize={'md'}>First name: </Text>
              <Text fontSize={'md'}>{firstName}</Text>
            </HStack>
            <HStack>
              <Text fontSize={'md'}>Last name: </Text>
              <Text fontSize={'md'}>{lastName}</Text>
            </HStack>
            <HStack>
              <Text fontSize={'md'}>Email: </Text>
              <Text fontSize={'md'}>{email}</Text>
            </HStack>
          </Center>
        </Box>
        <Box bg={'white'} p={'10'} m={'2'} borderRadius={'5'} shadow={5}>
          <EditDetails navigation={navigation} firstName={firstName} lastName={lastName} email={email} />
        </Box>
      </VStack>
    </Center>
  )
}

ProfileScreen.propTypes = {
  navigation: propTypes.shape({
    navigate: propTypes.func.isRequired
  }).isRequired,
  route: propTypes.shape({
    params: propTypes.object
  })
}
