import React, { useState } from 'react'
import { Box, VStack, Text, Button, Pressable, HStack, Center } from 'native-base'
import { Feather, AntDesign } from '@expo/vector-icons'
import propTypes from 'prop-types'

export default function Draft ({ id, text, setTextAreaDefaultText, deleteDraft, selectedDraft, setSelectedDraft }) {
  const [editing, setEditing] = useState(false)

  const handleOnPress = () => {
    setTextAreaDefaultText(true, text)
    if (selectedDraft === id) {
      setSelectedDraft(0)
      setEditing(false)
    } else {
      setEditing(true)
      setSelectedDraft(id)
    }
  }

  const renderEditing = () => {
    if (editing === true) {
      return (
        <HStack>
          <Text alignSelf={'center'}>Currently Editing </Text>
          <Feather name="edit" size={24} color="black" />
        </HStack>
      )
    } else {
      return null
    }
  }

  return (
    <Pressable m={'5'} onPress={() => handleOnPress()}>
      <Box minW={'200'} minH='150' w="100%" key={id} p={'2'} borderRadius={'5'} shadow={'5'}>
        <VStack>
          <Box>
            <Button variant={'ghost'} width='5' ml={'auto'} mr={0} leftIcon={<AntDesign name="closecircle" size={24} color="black" />} onPress={() => deleteDraft(id)} />
          </Box>
          <Center>
            {renderEditing()}
            <Text>{text}</Text>
          </Center>
        </VStack>
      </Box>
    </Pressable>
  )
}

Draft.propTypes = {
  id: propTypes.number.isRequired,
  text: propTypes.string.isRequired,
  setTextAreaDefaultText: propTypes.func.isRequired,
  deleteDraft: propTypes.func.isRequired,
  selectedDraft: propTypes.number.isRequired,
  setSelectedDraft: propTypes.func.isRequired
}
