import React, { useContext, useState, useEffect } from 'react'
import { Box, Avatar, Center, Text, Button, AddIcon } from 'native-base'
import ChangeProfilePicture from '../change-profile-picture/ChangeProfilePicture'
import MutualFriends from '../mutual-friends/MutualFriends'
import propTypes from 'prop-types'

import { SpaceBookContext } from '../../context/SpacebookContext'
import { getUserProfilePic } from '../../utils/HelperFunctions'

export default function ProfileInformation ({ id, buttonLocation, userFirstName, userLastName }) {
  const [image, setImage] = useState(null)
  const { firstName, email, token, userId, setErrorAlertProps, profileType } = useContext(SpaceBookContext)

  useEffect(async () => {
    getProfilePic()
  }, [])

  useEffect(() => {
    getProfilePic()
  }, [profileType])

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
        <>
          <Center><Text fontSize="3xl">{`${userFirstName} ${userLastName}`}</Text></Center>
          {buttonLocation === 'friend' ? <MutualFriends id={id} /> : null }
          {buttonLocation === 'user' ? <Button leftIcon={<AddIcon size="4" />}>Add Friend</Button> : null}
        </>
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
