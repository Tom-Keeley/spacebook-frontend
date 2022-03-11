import React, { useContext, useEffect } from 'react'

// Package imports
import { Box, Center, HStack, Text } from 'native-base'

// Custom imports
import { SpaceBookContext } from '../../context/SpacebookContext'
import { getUserDetails } from '../../utils/HelperFunctions'

export default function PersonalDetails () {
  // Context API
  const { firstName, setFirstName, lastName, setLastName, email, setEmail, token, userId, setErrorAlertProps } = useContext(SpaceBookContext)

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
  )
}
