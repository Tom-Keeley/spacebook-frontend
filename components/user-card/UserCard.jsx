import React, { useContext } from 'react'
import { Box, Text, Button, HStack, Flex, Center, useToast } from 'native-base'
import propTypes from 'prop-types'

// Context API
import { SpaceBookContext } from '../../context/SpacebookContext'

// Custom imports
import ErrorPopup from '../error-popup/ErrorPopup'

export default function UserCard ({ type, id, firstName, lastName, friendRequests, setFriendRequests }) {
  const { token, setErrorAlertProps, errorAlertVisible } = useContext(SpaceBookContext)
  const toast = useToast()

  const sendFriendRequest = async () => {
    try {
      const response = await fetch(`http://localhost:3333/api/1.0.0/user/${id}/friends`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-Authorization': token
        }
      })

      switch (response.status) {
        case (201): {
          console.log('success')
          toast.show({
            title: 'Friend request sent',
            status: 'success',
            placement: 'top'
          })
          break
        }
        case (401): {
          setErrorAlertProps('Unauthorised', 'You are not authorised to perform this action please log in', true)
          break
        }
        case (403): {
          setErrorAlertProps('Already Friends', 'You are already friends with this person', true)
          break
        }
        case (404): {
          setErrorAlertProps('User Not Found', 'Unable to find user please try again', true)
          break
        }
        case (500): {
          setErrorAlertProps('Server Error', 'Server error occured please try again later', true)
        }
      }
    } catch (err) {
      console.log(err)
      setErrorAlertProps('Error', 'Error occured please try again later', true)
    }
  }

  const acceptFriendRequest = async () => {
    const response = await fetch(`http://localhost:3333/api/1.0.0/friendrequests/${id}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Authorization': token
      }
    })

    switch (response.status) {
      case (200): {
        toast.show({
          title: `Added ${firstName} ${lastName} as a friend`,
          status: 'success',
          placement: 'top'
        })
        removeRequestFromState()
        break
      }
      case (401): {
        setErrorAlertProps('Unauthorised', 'You are not authorised to perform this action please log in', true)
        break
      }
      case (404): {
        setErrorAlertProps('User Not Found', 'Unable to find user please try again', true)
        break
      }
      case (500): {
        setErrorAlertProps('Server Error', 'Server error occured please try again later', true)
      }
    }
  }

  const rejectFriendRequest = async () => {
    const response = await fetch(`http://localhost:3333/api/1.0.0/friendrequests/${id}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Authorization': token
      }
    })

    switch (response.status) {
      case (200): {
        toast.show({
          title: `Declined ${firstName} ${lastName}'s friend request`,
          status: 'success',
          placement: 'top'
        })
        removeRequestFromState()
        break
      }
      case (401): {
        setErrorAlertProps('Unauthorised', 'You are not authorised to perform this action please log in', true)
        break
      }
      case (404): {
        setErrorAlertProps('User Not Found', 'Unable to find user please try again', true)
        break
      }
      case (500): {
        setErrorAlertProps('Server Error', 'Server error occured please try again later', true)
      }
    }
  }

  const removeRequestFromState = () => {
    const index = friendRequests.findIndex(request => request.user_id === id)
    const tempArray = [...friendRequests]
    tempArray.splice(index, 1)
    setFriendRequests(tempArray)
  }

  const returnButtons = () => {
    if (type === 'find') {
      return (
        <Flex direction='row'>
          <Button variant={'ghost'} onPress={sendFriendRequest}>Add Friend</Button>
          <Button variant={'ghost'}>View Profile</Button>
        </Flex>
      )
    } else if (type === 'request') {
      return (
        <Flex direction='row'>
          <Button variant={'ghost'} onPress={acceptFriendRequest}>Accept</Button>
          <Button variant={'ghost'} onPress={rejectFriendRequest}>Reject</Button>
        </Flex>
      )
    } else if (type === 'friend') {
      return (
        <Flex direction='row'>
          <Button variant={'ghost'}>View Profile</Button>
        </Flex>
      )
    }
  }

  return (
    <Box bg={'white'} pt={'2'} m={'2'} borderRadius={'5'} shadow={'5'}>
      {errorAlertVisible && <ErrorPopup />}
      <HStack>
        <Box w={'100%'}>
          <Box>
            <Text alignSelf={'center'}>{firstName} {lastName}</Text>
          </Box>
          <Box alignItems={'right'}>
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
