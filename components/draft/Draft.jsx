import React from 'react'
import { Box, VStack, Text, Button, Pressable } from 'native-base'

export default function Draft({ id, text, setTextAreaDefaultText, deleteDraft }) {
  return (
    <Pressable onPress={() => setTextAreaDefaultText(true, text)}>
      <Box key={id} p={'10'} m={'5'} borderRadius={'5'} shadow={'5'}>
        <VStack >
          <Button onPress={() => deleteDraft(id)}>Delete</Button>
          <Text>{text}</Text>
        </VStack>
      </Box>
    </Pressable>
  )
}
