import React, { useContext, useEffect, useState } from 'react'
import { VStack, HStack, Input, Icon, Box, Radio, ScrollView } from 'native-base'
import { MaterialIcons } from '@expo/vector-icons'

// Context API
import { SpaceBookContext } from '../../context/SpacebookContext'

// Custom imports
import SearchOptions from '../../components/search-options/SearchOptions'
import UserCard from '../../components/user-card/UserCard'

// https://editor.swagger.io/search?q=Ash%20Williams&limit=20&offset=0

export default function FriendsScreen () {
  const [radioValue, setRadioValue] = useState('find-friends')
  const { pagination, token, userId, setErrorAlertProps } = useContext(SpaceBookContext)

  // State values for friend related data
  const [users, setUsers] = useState([])
  const [friends, setFriends] = useState([])
  const [friendRequests, setFriendRequests] = useState([])

  // Get data when page loads
  useEffect(async () => {
    try {
      const friendsResponse = await fetch(`http://localhost:3333/api/1.0.0/user/${userId}/friends`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-Authorization': token
        }
      })

      switch (friendsResponse.status) {
        case (200): {
          setFriends(await friendsResponse.json())
          break
        }
        case (401): {
          setErrorAlertProps('Unauthorised', 'You are not authorised to perform this action please log in', true)
          break
        }
        case (403): {
          setErrorAlertProps('Error', 'Can only view the friends of yourself or your friends', true)
          break
        }
        case (404): {
          setErrorAlertProps('Not Found', 'User not found please try again', true)
          break
        }
        case (500): {
          setErrorAlertProps('Server Error', 'Sever error occured please try again later', true)
          break
        }
      }
    } catch (err) {
      console.log(err)
      setErrorAlertProps('Error', 'An error occured please try again later', true)
    }

    try {
      const friendRequestResponse = await fetch('http://localhost:3333/api/1.0.0/friendrequests', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-Authorization': token
        }
      })

      switch (friendRequestResponse.status) {
        case (200): {
          setFriendRequests(await friendRequestResponse.json())
          break
        }
        case (401): {
          setErrorAlertProps('Unauthorised', 'You are not authorised to do this action please log in', true)
          break
        }
        case (500): {
          setErrorAlertProps('Server Error', 'Server error occured please try again', true)
          break
        }
      }
    } catch (err) {
      console.log(err)
      setErrorAlertProps('Error', 'Error occured please try again later', true)
    }
  }, [])

  useEffect(async () => {
    try {
      const response = await fetch(`http://localhost:3333/api/1.0.0/search?limit=${pagination}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-Authorization': token
        }
      })
      switch (response.status) {
        case (200): {
          setUsers(await response.json())
          break
        }
        case (401): {
          setErrorAlertProps('Unauthorised', 'You are not authorised to perform this action please log in', true)
          break
        }
        case (500): {
          setErrorAlertProps('Server Error', 'Server error occured please try again later', true)
          break
        }
      }
    } catch (err) {
      console.log(err)
      setErrorAlertProps('Error', 'Error occured please try again later', true)
    }
  }, [pagination])

  useEffect(() => {
    console.log(users)
    console.log(friendRequests)
    console.log(friends)
  }, [users, friendRequests, friends])

  const returnData = () => {
    if (radioValue === 'find-friends') {
      return (
        users.map(user => {
          return (
            <UserCard type='find' key={user.user_id} id={user.user_id} firstName={user.user_givenname} lastName={user.user_familyname} />
          )
        }))
    } else if (radioValue === 'friend-requests') {
      return (
        friendRequests.map(request => {
          return (
            <UserCard type='request' key={request.user_id} id={request.user_id} firstName={request.first_name} lastName={request.last_name} />
          )
        }))
    } else if (radioValue === 'friends') {
      return (
        friends.map(friend => {
          return (
            <UserCard type='friend' key={friend.user_id} id={friend.user_id} firstName={friend.user_givenname} lastName={friend.user_familyname} />
          )
        }))
    }
  }

  return (
    <Box safeArea w={'100%'} h={'100%'}>
      <VStack p='5'>
        <Box bg={'white'} py={'2'} px={'3'} m={'1'} borderRadius={'5'} shadow={'5'}>
          <HStack>
            <Input placeholder="Search People & Places" w={'90%'} borderRadius="4" py="3" px="1" fontSize="14" InputLeftElement={<Icon m="2" ml="3" size="6" color="gray.400" as={<MaterialIcons name="search" />} />} />
            <SearchOptions />
          </HStack>
        </Box>
        <Radio.Group m='2' value={radioValue} onChange={nextValue => { setRadioValue(nextValue) }} name='friendsGroup' accessibilityLabel='Selct your friends or search for a friend'>
          <HStack space={4}>
            <Box>
              <Radio value='find-friends' my={1} size="sm">
                Find Friends
              </Radio>
            </Box>
            <Box>
              <Radio value='friends' my={1} size="sm">
                Friends
              </Radio>
            </Box>
            <Box>
              <Radio value='friend-requests' my={1} size="sm">
                Friend Requests
              </Radio>
            </Box>
          </HStack>
        </Radio.Group>
        <ScrollView h={'650'}>
          {returnData()}
        </ScrollView>
      </VStack>
    </Box>
  )
}
