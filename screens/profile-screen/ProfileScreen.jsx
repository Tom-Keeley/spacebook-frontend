import React, { useContext, useEffect } from 'react'
import { Avatar, VStack, Text, Center, Box, HStack, useToast } from 'native-base'
import propTypes from 'prop-types'

// Custom imports
import EditDetails from '../../components/edit-details/EditDetails'

// ContextAPI
import { SpaceBookContext } from '../../context/SpacebookContext'

export default function ProfileScreen ({ navigation }) {
  const toast = useToast()
  const { setErrorAlertProps, token, userId, firstName, setFirstName, lastName, setLastName, email, setEmail, userDetailsUpdated, setUserDetailsUpdated } = useContext(SpaceBookContext)
  // Runs on mount to get and set user details
  useEffect(async () => {
    try {
      const response = await fetch(`http://localhost:3333/api/1.0.0/user/${userId}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-Authorization': token
        }
      })
      switch (response.status) {
        case (200): {
          const json = await response.json()
          setFirstName(json.first_name)
          setLastName(json.last_name)
          setEmail(json.email)
          break
        }
        case (401): {
          setErrorAlertProps('Unauthorised', 'You are not authorised to perform this action please log in', true)
          break
        }
        case (404): {
          setErrorAlertProps('User not found', 'User not found please try again', true)
          break
        }
        case (500): {
          setErrorAlertProps('Server Error', 'Server occured please try again', true)
          break
        }
      }
    } catch (err) {
      console.log(err)
      setErrorAlertProps('Error', 'An error occured please try again later', true)
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

  return (
    <Center w={'100%'} h={'100%'}>
      <VStack >
        <Box bg={'white'} p={'10'} m={'2'} borderRadius={'5'} shadow={'5'}>
          <Avatar bg="green.500" alignSelf="center" size="2xl" source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80' }}></Avatar>
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
  }).isRequired
}
