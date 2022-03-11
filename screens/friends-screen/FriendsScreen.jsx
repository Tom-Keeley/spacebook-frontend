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
import { getfriendRequests, getUsersPaginated, searchUsers } from '../../utils/HelperFunctions'

export default function FriendsScreen ({ navigation }) {
  const { pagination, token, setErrorAlertProps, errorAlertVisible } = useContext(SpaceBookContext)

  // State values for this component
  const [radioValue, setRadioValue] = useState('all')
  const [users, setUsers] = useState([])
  const [friends, setFriends] = useState([])
  const [friendRequests, setFriendRequests] = useState([])
  const [friendRequestsBackup, setFriendRequestsBackup] = useState([])
  const [offset, setOffset] = useState(0)
  const [endOfResults, setEndOfResults] = useState(false)

  // Get data when page loads
  useEffect(async () => {
    const friendsResponse = await getUsersPaginated(token, setErrorAlertProps, 'friends', pagination, offset)
    console.log(friendsResponse)
    if (friendsResponse.success === true) {
      setFriends(friendsResponse.users)
    }

    const friendRequestResponse = await getfriendRequests(token, setErrorAlertProps)
    if (friendRequestResponse.success === true) {
      setFriendRequests(friendRequestResponse.friendRequests)
      setFriendRequestsBackup(friendRequestResponse.friendRequests)
    }
  }, [])

  const searchData = async (searchValue) => {
    if (searchValue.length > 0 && (radioValue === 'all' || radioValue === 'friends')) {
      const searchResults = await searchUsers(token, setErrorAlertProps, radioValue, searchValue)
      if (searchResults.success === true) {
        if (radioValue === 'all') {
          setUsers(searchResults.results)
        } else if (radioValue === 'friends') {
          setFriends(searchResults.results)
        }
      }
    } else if (radioValue === 'friend-requests') {
      if (searchValue.length > 0) {
        const tempArray = []
        const rg = new RegExp('.{1,' + searchValue.length + '}', 'g')

        friendRequests.forEach(friendRequest => {
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

  const getUsersPagination = async () => {
    const results = await getUsersPaginated(token, setErrorAlertProps, radioValue, pagination, offset)
    if (results.success === true) {
      if (radioValue === 'all') {
        setUsers(results.users)
      } else if (radioValue === 'friends') {
        setFriends(results.users)
      }
      if (results.length < pagination) {
        setEndOfResults(true)
      } else {
        setEndOfResults(false)
      }
    }
  }

  useEffect(() => {
    getUsersPagination()
  }, [offset])

  useEffect(() => {
    if (offset === 0) {
      getUsersPagination()
    }
    setOffset(0)
  }, [pagination])

  const renderLists = () => {
    if (radioValue === 'all') {
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
    if (radioValue === 'all' || radioValue === 'friends') {
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
        <Radio.Group m='2' value={radioValue} defaultValue='all' onChange={nextValue => { setRadioValue(nextValue) }} name='friendsGroup' accessibilityLabel='Selct your friends or search for a friend'>
          <HStack space={4}>
            <Box>
              <Radio value='all' my={1} size="sm">
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
