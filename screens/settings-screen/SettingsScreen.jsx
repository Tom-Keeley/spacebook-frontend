import React, { useContext } from 'react'

// Package impoirts
import { Box, Heading, VStack, Button } from 'native-base'
import { MaterialIcons } from '@expo/vector-icons'
import propTypes from 'prop-types'
import AsyncStorage from '@react-native-async-storage/async-storage'

// Custom imports
import LoadingSpinner from '../../components/loading-spinner/LoadingSpinner'
import ErrorPopup from '../../components/error-popup/ErrorPopup'
import { logOut } from '../../utils/HelperFunctions'
import { SpaceBookContext } from '../../context/SpacebookContext'

export default function SettingsScreen ({ navigation }) {
  // Context API
  const { loadingSpinnerVisible, setLoadingSpinnerVisible, token, errorAlertVisible, setErrorAlertProps } = useContext(SpaceBookContext)

  // Send sign out request to server
  const signOut = async () => {
    const response = await logOut(token, setErrorAlertProps)
    if (response.success === true) {
      setLoadingSpinnerVisible(false)
      await AsyncStorage.removeItem('rememberMe')
      navigation.navigate('Welcome', { screen: 'Welcome-screen' })
    }
    setLoadingSpinnerVisible(false)
  }

  return (
    <>
      {loadingSpinnerVisible && <LoadingSpinner />}
      {errorAlertVisible && <ErrorPopup />}
      <Heading fontSize="xl" p="4" pb="3">
        Settings
      </Heading>
      <Box bg={'white'} p={'10'} m={'2'} borderRadius={'5'} shadow={'5'}>
        <VStack p='10'>
          <Button onPress={signOut} endIcon={<MaterialIcons name="logout" size={20} color="white" />} m='1'>Log Out</Button>
        </VStack>
      </Box>
    </>
  )
}

SettingsScreen.propTypes = {
  navigation: propTypes.shape({
    navigate: propTypes.func.isRequired
  }).isRequired
}
