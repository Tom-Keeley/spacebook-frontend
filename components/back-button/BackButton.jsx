import React, { useContext } from 'react'

// Package imports
import { HStack, Text, Box, Pressable } from 'native-base'
import { AntDesign } from '@expo/vector-icons'
import propTypes from 'prop-types'

// Custom imports
import { SpaceBookContext } from '../../context/SpacebookContext'
export default function BackButton ({ navigation }) {
  const { setProfileType } = useContext(SpaceBookContext)

  // Go back from viewing a profile
  const goBack = () => {
    setProfileType('personal')
    navigation.navigate('Friends')
  }

  return (
    <Pressable onPress={goBack}>
      <Box m={2} p={2} borderRadius={'5'} shadow={'5'}>
        <HStack w={'100%'}>
          <AntDesign name="arrowleft" size={24} color="black" />
          <Text alignSelf={'center'}>Back</Text>
        </HStack>
      </Box>
    </Pressable>
  )
}

BackButton.propTypes = {
  navigation: propTypes.shape({
    navigate: propTypes.func.isRequired
  }).isRequired
}
