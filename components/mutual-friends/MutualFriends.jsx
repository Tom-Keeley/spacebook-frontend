import React, { useContext, useState, useEffect } from 'react'

// Package imports
import { getFriends, getUsersFriends } from '../../utils/HelperFunctions'
import { Text } from 'native-base'
import propTypes from 'prop-types'

// Custom imports
import { SpaceBookContext } from '../../context/SpacebookContext'
export default function MutualFriends ({ id }) {
  // Local State
  const [count, setCount] = useState(0)

  // Context API
  const { token, userId, setErrorAlertProps } = useContext(SpaceBookContext)

  // Get friends list on load
  useEffect(() => {
    getFriendsLists()
  }, [])

  // Show how many mutual friends a user has
  const getFriendsLists = async () => {
    const friendsResponse = await getFriends(token, userId, setErrorAlertProps)
    const userFriendsResponse = await getUsersFriends(token, id, setErrorAlertProps)

    let friends = []
    let userFriends = []

    if (friendsResponse.success === true && userFriendsResponse.success === true) {
      friends = friendsResponse.friends
      userFriends = userFriendsResponse.userFriends
    }

    let matches = 0
    friends.forEach(f => {
      const found = userFriends.find(uf => uf.user_givenname === f.user_givenname && uf.user_familyname === f.user_familyname)
      if (found) {
        matches++
      }
    })
    setCount(matches)
  }

  return (
    <Text>You have {count} mutual {count === 1 ? 'friend' : 'friends'}</Text>
  )
}

MutualFriends.propTypes = {
  id: propTypes.number.isRequired
}
