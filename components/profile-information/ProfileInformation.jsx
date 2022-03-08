import React, { useContext, useState, useEffect } from 'react'
import { Box, Avatar, Center, Text, Button, AddIcon, CheckIcon } from 'native-base'
import ChangeProfilePicture from '../change-profile-picture/ChangeProfilePicture'
import MutualFriends from '../mutual-friends/MutualFriends'
import propTypes from 'prop-types'

import { SpaceBookContext } from '../../context/SpacebookContext'
import { getUserProfilePic, sendFriendRequest } from '../../utils/HelperFunctions'

export default function ProfileInformation ({ id, buttonLocation, userFirstName, userLastName }) {
  const [image, setImage] = useState(null)
  const { firstName, email, token, userId, setErrorAlertProps, profileType } = useContext(SpaceBookContext)
  const [buttonIcon, setButtonIcon] = useState(<AddIcon size="4" />)
  const [buttonVariant, setButtonVariant] = useState('solid')
  const [buttonText, setButtonText] = useState('Add Friend')

  useEffect(async () => {
    getProfilePic()
  }, [])

  useEffect(() => {
    getProfilePic()
  }, [profileType])

  const addFriend = async () => {
    const response = await sendFriendRequest(token, id, setErrorAlertProps)
    if (response.success === true) {
      setButtonText('Request sent')
      setButtonVariant('outline')
      setButtonIcon(<CheckIcon size="4"/>)
    }
  }

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
