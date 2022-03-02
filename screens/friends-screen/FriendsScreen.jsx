import React, { useContext, useEffect, useState } from 'react'
import { VStack, HStack, Input, Icon, Box, Radio, ScrollView } from 'native-base'
import { MaterialIcons } from '@expo/vector-icons'
import propTypes from 'prop-types'

// Context API
import { SpaceBookContext } from '../../context/SpacebookContext'

// Custom imports
import SearchOptions from '../../components/search-options/SearchOptions'
import UserCard from '../../components/user-card/UserCard'
import ErrorPopup from '../../components/error-popup/ErrorPopup'

export default function FriendsScreen ({ navigation }) {
  const { pagination, token, userId, setErrorAlertProps, errorAlertVisible } = useContext(SpaceBookContext)

  // State values for this component
  const [radioValue, setRadioValue] = useState('find-friends')
  const [users, setUsers] = useState([])
  const [friends, setFriends] = useState([])
  const [friendRequests, setFriendRequests] = useState([])
  const [friendRequestsBackup, setFriendRequestsBackup] = useState([])
  const [offset, setOffset] = useState(0)
  const [endOfResults, setEndOfResults] = useState(false)

  // Get data when page loads
  useEffect(async () => {
    try {
      const friendsResponse = await fetch(`http://localhost:3333/api/1.0.0/user/${userId}/friends`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
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

  const searchData = async (searchValue) => {
    if (radioValue === 'find-friends') {
      try {
        const response = await fetch(`http://localhost:3333/api/1.0.0/search?q=${searchValue}`, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
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
        setErrorAlertProps('Error', 'An error occured please try again later', true)
        console.log(err)
      }
    } else if (radioValue === 'friends') {
      if (searchValue.length > 0) {
        try {
          const response = await fetch(`http://localhost:3333/api/1.0.0/search?q=${searchValue}&searchin=friends`, {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'X-Authorization': token
            }
          })
          switch (await response.status) {
            case (200): {
              console.log(response.json())
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
          setErrorAlertProps('Error', 'An error occured please try again later', true)
          console.log(err)
        }
      }
    } else if (radioValue === 'friend-requests') {
      if (friendRequestsBackup.length === 0) {
        setFriendRequestsBackup(friendRequests)
      }

      if (searchValue.length > 0) {
        // DO ANOTHER CALL TO THE DATABASE RATHER THAN FILTERING ITS EASIER!!
        console.log('here')
        const tempArray = []
        const rg = new RegExp('.{1,' + searchValue.length + '}', 'g')

        friendRequests.forEach(friendRequest => {
          console.log(friendRequest)
          const searchValueSplit = searchValue.match(rg)
          const compareValue = (friendRequest.first_name + ' ' + friendRequest.last_name).match(rg)
          searchValueSplit.forEach((string, index) => {
            if (string === compareValue[index]) {
              tempArray.push(friendRequest)
            }
          })
        })
        setFriendRequests(tempArray)
      } else if (searchValue.length === 0) {
        setFriendRequests(friendRequestsBackup)
      }
    }
  }

  const changePage = (type) => {
    if (type === 'up' && endOfResults === false) {
      setOffset(offset + pagination)
    } else if (type === 'down' && offset > 0) {
      setOffset(offset - pagination)
    }
  }

  const getUsersOffset = async () => {
    try {
      const response = await fetch(`http://localhost:3333/api/1.0.0/search?limit=${pagination}&offset=${offset}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'X-Authorization': token
        }
      })
      switch (response.status) {
        case (200): {
          const tempUsers = await response.json()
          setUsers(tempUsers)
          if (tempUsers.length < pagination) {
            setEndOfResults(true)
          } else {
            setEndOfResults(false)
          }
          break
        }
        case (400): {
          setErrorAlertProps('Start of Results', 'Cannot go back any further', true)
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
      setErrorAlertProps('Error', 'An error occured please try again later', true)
    }
  }

  useEffect(() => {
    getUsersOffset()
  }, [offset])

  useEffect(() => {
    if (offset === 0) {
      getUsersOffset()
    }
    setOffset(0)
  }, [pagination])

  const renderLists = () => {
    if (radioValue === 'find-friends') {
      return (
        users.map(user => {
          return (
            <UserCard type='find' key={user.user_id} id={user.user_id} firstName={user.user_givenname} lastName={user.user_familyname} navigation={navigation}/>
          )
        }))
    } else if (radioValue === 'friend-requests') {
      return (
        friendRequests.map(request => {
          return (
            <UserCard type='request' key={request.user_id} id={request.user_id} firstName={request.first_name} lastName={request.last_name} friendRequests={friendRequests} setFriendRequests={setFriendRequests} navigation={navigation}/>
          )
        }))
    } else if (radioValue === 'friends') {
      return (
        friends.map(friend => {
          return (
            <UserCard type='friend' key={friend.user_id} id={friend.user_id} firstName={friend.user_givenname} lastName={friend.user_familyname} navigation={navigation} />
          )
        }))
    }
  }

  const renderRefine = () => {
    if (radioValue === 'find-friends') {
      return <SearchOptions changePage={changePage} />
    } else {
      return null
    }
  }

  return (
    <Box safeArea w={'100%'} h={'100%'}>
      {errorAlertVisible && <ErrorPopup />}
      <VStack p='5'>
        <Box bg={'white'} py={'2'} px={'3'} m={'1'} borderRadius={'5'} shadow={'5'}>
          <HStack>
            <Input onChangeText={value => searchData(value)} placeholder="Search Users" w={'100%'} borderRadius="4" py="3" px="1" fontSize="14" InputLeftElement={<Icon m="2" ml="3" size="6" color="gray.400" as={<MaterialIcons name="search" />} />} />
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
        {renderRefine()}
        <ScrollView h={'600'}>
          {renderLists()}
        </ScrollView>
      </VStack>
    </Box>
  )
}

FriendsScreen.propTypes = {
  navigation: propTypes.shape({
    navigate: propTypes.func.isRequired
  }).isRequired
}
