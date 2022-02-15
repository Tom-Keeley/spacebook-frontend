import React, { useContext } from 'react'
import { Box, Heading, VStack, Button } from 'native-base'
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import propTypes from 'prop-types'

// Context API
import { SpaceBookContext } from '../../context/SpacebookContext'

// Custom imports
import LoadingSpinner from '../../components/loading-spinner/LoadingSpinner'
import ErrorPopup from '../../components/error-popup/ErrorPopup'

export default function SettingsScreen ({ navigation }) {
  const { loadingSpinnerVisible, setLoadingSpinnerVisible, token, errorAlertVisible, setErrorAlertProps } = useContext(SpaceBookContext)

  const signOut = async () => {
    setLoadingSpinnerVisible(true)
    try {
      const response = await fetch('http://localhost:3333/api/1.0.0/logout', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'content-type': 'application/json',
          'X-Authorization': token
        }
      })

      switch (response.status) {
        case (200):
          console.log('Logged out')
          setLoadingSpinnerVisible(false)
          navigation.navigate('Welcome', { screen: 'Welcome-screen' })
          break
        case (401):
          setErrorAlertProps('Unauthorised', 'You are not authorised to perform this action please log in', true)
          break
        case (500):
          setErrorAlertProps('Server Error', 'Server error occured please try agai later', true)
      }
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <Box>
      {loadingSpinnerVisible && <LoadingSpinner />}
      {errorAlertVisible && <ErrorPopup />}
      <Heading fontSize="xl" p="4" pb="3">
        Settings
      </Heading>
      <Box bg={'white'} p={'10'} m={'2'} borderRadius={'5'} shadow={'5'}>
        <VStack p='10'>
          <Button endIcon={<MaterialCommunityIcons name="theme-light-dark" size={20} color="white" />} m="1">Change Theme</Button>
          <Button onPress={signOut} endIcon={<MaterialIcons name="logout" size={20} color="white" />} m='1'>Log Out</Button>
        </VStack>
      </Box>
    </Box>
  )
}

SettingsScreen.propTypes = {
  navigation: propTypes.shape({
    navigate: propTypes.func.isRequired
  }).isRequired
}
