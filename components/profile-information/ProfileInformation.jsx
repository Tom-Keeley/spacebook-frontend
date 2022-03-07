import React, { useContext, useState, useEffect } from 'react'
import { Box, Avatar, Center, Text } from 'native-base'
import ChangeProfilePicture from '../change-profile-picture/ChangeProfilePicture'

import { SpaceBookContext } from '../../context/SpacebookContext'
import { getUserProfilePic } from '../../utils/HelperFunctions'

export default function ProfileInformation () {
  const [image, setImage] = useState(null)
  const { firstName, email, token, userId, setErrorAlertProps } = useContext(SpaceBookContext)

  useEffect(async () => {
    const profilePictureResponse = await getUserProfilePic(token, userId, setErrorAlertProps)
    if (profilePictureResponse.success === true) {
      setImage(profilePictureResponse.data)
    }
  }, [])

  return (
    <>
      <Box bg={'white'} p={'10'} m={'2'} borderRadius={'5'} shadow={'5'}>
        <Avatar bg="green.500" alignSelf="center" size="2xl" source={{ uri: image }}></Avatar>
        <Box w={'100%'} mt='2'>
        <ChangeProfilePicture setImage={setImage} />
        </Box>
        <Center><Text fontSize="3xl">{`Welcome ${firstName}`}</Text></Center>
        <Center><Text fontSize="md">{`${email}`}</Text></Center>
      </Box>
    </>
  )
}
