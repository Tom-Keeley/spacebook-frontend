import React, { useState, useEffect } from 'react'
import { Button, Box, HStack, ScrollView, Text, VStack, Pressable } from 'native-base'
import { FontAwesome } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Draft from '../draft/Draft'

export default function DraftMenu ({ text, setTextAreaDefaultText }) {
  const [draftPosts, setDraftPosts] = useState([])

  useEffect(async () => {
    const jsonValue = await AsyncStorage.getItem('drafts')
    const data = JSON.parse(jsonValue)
    setDraftPosts(data)
  }, [])

  const saveDraft = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('drafts')
      console.log(jsonValue)
      if (jsonValue === null) {
        const draft = [{ id: 1, text: text }]
        await AsyncStorage.setItem('drafts', JSON.stringify(draft))
      } else {
        const data = JSON.parse(jsonValue)
        console.log(typeof data)
        console.log(data.length)
        const newData = { id: (data.length + 1), text: text }
        data.push(newData)
        console.log(newData)
        await AsyncStorage.setItem('drafts', JSON.stringify(data))
        setDraftPosts([...draftPosts, newData])
      }
    } catch (err) {
      console.log(err)
    }
  }

  const deleteDraft = async (id) => {
    const jsonValue = await AsyncStorage.getItem('drafts')
    const data = JSON.parse(jsonValue)
    data.forEach(draft => {
      if (draft.id === id) {
        const index = data.findIndex(el => el.id === id)
        data.splice(index, 1)
      }
    })
    await AsyncStorage.setItem('drafts', JSON.stringify(data))
    setDraftPosts(data)
  }

  return (
    <Box my='1' justifyContent={'center'}>
      <Button onPress={() => saveDraft()} leftIcon={<FontAwesome name="save" size={24} color="white" />}>Save Draft</Button>
      <ScrollView horizontal>
        <HStack>
          {draftPosts.map(draft => <Draft key={draft.id} id={draft.id} text={draft.text} setTextAreaDefaultText={setTextAreaDefaultText} deleteDraft={deleteDraft}/>)}
        </HStack>
      </ScrollView>
    </Box>
  )
}
