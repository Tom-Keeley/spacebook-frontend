import React, { useContext, useState, useEffect } from 'react'

// Package imports
import { Box, Avatar, Center, Text, Button, AddIcon, CheckIcon } from 'native-base'
import propTypes from 'prop-types'

// Custom imports
import ChangeProfilePicture from '../change-profile-picture/ChangeProfilePicture'
import MutualFriends from '../mutual-friends/MutualFriends'
import { SpaceBookContext } from '../../context/SpacebookContext'
import { getUserProfilePic, sendFriendRequest } from '../../utils/HelperFunctions'

export default function ProfileInformation ({ id, buttonLocation, userFirstName, userLastName }) {
  // Local state
  const [image, setImage] = useState(null)
  const [buttonIcon, setButtonIcon] = useState(<AddIcon size="4" />)
  const [buttonVariant, setButtonVariant] = useState('solid')
  const [buttonText, setButtonText] = useState('Add Friend')

  // Context API
  const { firstName, email, token, userId, setErrorAlertProps, profileType } = useContext(SpaceBookContext)

  // Get profile picture on load
  useEffect(async () => {
    getProfilePic()
  }, [])

  // When the profile type changes re fetch the profile picture
  useEffect(() => {
    getProfilePic()
  }, [profileType])

  // Send a friend request
  const addFriend = async () => {
    const response = await sendFriendRequest(token, id, setErrorAlertProps)
    if (response.success === true) {
      setButtonText('Request sent')
      setButtonVariant('outline')
      setButtonIcon(<CheckIcon size="4"/>)
    }
  }

  // Fetch profile picture depending on if its own or another users profile
  const getProfilePic = async () => {
    if (profileType === 'personal') {
      const profilePictureResponse = await getUserProfilePic(token, userId, setErrorAlertProps)
      if (profilePictureResponse.success === true) {
        setImage(profilePictureResponse.data)
      }
    } else if (profileType === 'userProfile') {
      const profilePictureResponse = await getUserProfilePic(token, id, setErrorAlertProps)
      if (profilePictureResponse.success === true) {
        setImage(profilePictureResponse.data)
      }
    }
  }

  // Conditional rendering depending on if its the users own profile or another profile
  const renderName = () => {
    if (profileType === 'personal') {
      return (
        <>
          <Center><Text fontSize="3xl">{`Welcome ${firstName}`}</Text></Center>
          <Center><Text fontSize="md">{`${email}`}</Text></Center>
        </>
      )
    } else if (profileType === 'userProfile') {
      return (
        <Center>
          <Text fontSize="3xl">{`${userFirstName} ${userLastName}`}</Text>
          {buttonLocation === 'friend' ? <MutualFriends id={id} /> : null }
          {buttonLocation === 'user' ? <Button onPress={addFriend} variant={buttonVariant} leftIcon={buttonIcon}>{buttonText}</Button> : null}
        </Center>
      )
    }
  }

  return (
    <>
      <Box bg={'white'} p={'10'} m={'2'} borderRadius={'5'} shadow={'5'}>
        <Avatar bg="green.500" alignSelf="center" size="2xl" source={{ uri: image }}></Avatar>
        <Box w={'100%'} mt='2'>
        {profileType === 'personal' ? <ChangeProfilePicture setImage={setImage} /> : null}
        </Box>
        {renderName()}
      </Box>
    </>
  )
}

ProfileInformation.propTypes = {
  id: propTypes.number.isRequired,
  buttonLocation: propTypes.string.isRequired,
  userFirstName: propTypes.string.isRequired,
  userLastName: propTypes.string.isRequired
}

ProfileInformation.defaultProps = {
  id: 0,
  buttonLocation: '',
  userFirstName: '',
  userLastName: ''
}
