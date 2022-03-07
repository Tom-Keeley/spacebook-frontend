import React, { useContext, useEffect } from 'react'
import { VStack, Text, Center, Box, HStack } from 'native-base'
import propTypes from 'prop-types'

// Custom imports
import EditDetails from '../../components/edit-details/EditDetails'
import ErrorPopup from '../../components/error-popup/ErrorPopup'
import { getUserDetails } from '../../utils/HelperFunctions'
import LoadingSpinner from '../../components/loading-spinner/LoadingSpinner'
import ProfileInformation from '../../components/profile-information/ProfileInformation'

// ContextAPI
import { SpaceBookContext } from '../../context/SpacebookContext'

export default function ProfileScreen ({ route, navigation }) {
  const { loadingSpinnerVisible, setErrorAlertProps, errorAlertVisible, token, userId, firstName, setFirstName, lastName, setLastName, email, setEmail } = useContext(SpaceBookContext)
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
  }, [])

  return (
    <Center w={'100%'} h={'100%'}>
      {errorAlertVisible && <ErrorPopup />}
      {loadingSpinnerVisible && <LoadingSpinner />}
      <VStack >
        <ProfileInformation />
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
