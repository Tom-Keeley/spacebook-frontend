import React, { useContext, useState } from 'react'

// Package imports
import { Box, Text, Button, HStack, Flex, Center, useToast } from 'native-base'
import propTypes from 'prop-types'

// Custom imports
import { sendFriendRequest, acceptFriendRequest, rejectFriendRequest } from '../../utils/HelperFunctions'

// Context API
import { SpaceBookContext } from '../../context/SpacebookContext'

export default function UserCard ({ type, id, firstName, lastName, friendRequests, setFriendRequests, navigation }) {
  // Local state
  const [buttonDisabled, setButtonDisabled] = useState(false)

  // Context API
  const { token, setErrorAlertProps, totalFriendRequests, setTotalFriendRequests, setProfileType, loadingSpinnerVisible, setloadingSpinnerVisible } = useContext(SpaceBookContext)

  // Init
  const toast = useToast()

  // Send a friend request
  const newFriendRequest = async () => {
    const response = await sendFriendRequest(token, id, setErrorAlertProps)
    if (response.success === true) {
      setButtonDisabled(true)
      toast.show({
        title: 'Friend request sent',
        status: 'success',
        placement: 'top'
      })
    }
  }

  // Accept friend request
  const acceptRequest = async () => {
    const response = await acceptFriendRequest(token, setErrorAlertProps, id)
    if (response.success === true) {
      toast.show({
        title: `Added ${firstName} ${lastName} as a friend`,
        status: 'success',
        placement: 'top'
      })
      if (totalFriendRequests > 0) {
        setTotalFriendRequests(totalFriendRequests - 1)
      }
      removeRequestFromState()
    }
  }

  // Reject friend request
  const rejectRequest = async () => {
    const response = await rejectFriendRequest(token, id, setErrorAlertProps)
    if (response.success === true) {
      toast.show({
        title: `Declined ${firstName} ${lastName}'s friend request`,
        status: 'success',
        placement: 'top'
      })
      if (totalFriendRequests > 0) {
        setTotalFriendRequests(totalFriendRequests - 1)
      }
      removeRequestFromState()
    }
  }
  
  // Re-render list of requests
  const removeRequestFromState = () => {
    const index = friendRequests.findIndex(request => request.user_id === id)
    const tempArray = [...friendRequests]
    tempArray.splice(index, 1)
    setFriendRequests(tempArray)
  }

  // View the users profile
  const viewProfile = (buttonLocation) => {
    setProfileType('userProfile')
    navigation.navigate('Profile', { id: id, buttonLocation: buttonLocation, userFirstName: firstName, userLastName: lastName })
  }

  // Conditionally render buttons depending on which list the button is pressed in
  const returnButtons = () => {
    if (type === 'find') {
      return (
        <Flex direction='row'>
          <Button variant={'ghost'} disabled={buttonDisabled} onPress={newFriendRequest}><Text color={buttonDisabled === false ? 'primary.500' : 'white'}>Add Friend</Text></Button>
          <Button variant={'ghost'} onPress={() => viewProfile('user')}><Text color={'primary.500'}>View Profile</Text></Button>
        </Flex>
      )
    } else if (type === 'request') {
      return (
        <Flex direction='row'>
          <Button variant={'ghost'} onPress={acceptRequest}>Accept</Button>
          <Button variant={'ghost'} onPress={rejectRequest}>Reject</Button>
        </Flex>
      )
    } else if (type === 'friend') {
      return (
        <Flex direction='row'>
          <Button variant={'ghost'} onPress={() => viewProfile('friend')}>View Profile</Button>
        </Flex>
      )
    }
  }

  return (
    <Box bg={'white'} pt={'2'} m={'2'} borderRadius={'5'} shadow={'5'}>
      <HStack>
        <Box w={'100%'}>
          <Box>
            <Text alignSelf={'center'}>{firstName} {lastName}</Text>
          </Box>
          <Box>
            <Center>
              <HStack>
                {returnButtons()}
              </HStack>
            </Center>
          </Box>
        </Box>
      </HStack>
    </Box>
  )
}

UserCard.propTypes = {
  navigation: propTypes.shape({
    navigate: propTypes.func.isRequired
  }).isRequired,
  type: propTypes.string.isRequired,
  id: propTypes.number.isRequired,
  firstName: propTypes.string.isRequired,
  lastName: propTypes.string.isRequired,
  friendRequests: propTypes.array.isRequired,
  setFriendRequests: propTypes.func.isRequired
}

UserCard.defaultProps = {
  friendRequests: [],
  setFriendRequests: () => {}
}
