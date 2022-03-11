import React, { useState, useEffect } from 'react'
import { Button, Box, HStack, ScrollView } from 'native-base'
import { FontAwesome } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Draft from '../draft/Draft'
import propTypes from 'prop-types'

export default function DraftMenu ({ text, setTextAreaDefaultText }) {
  const [draftPosts, setDraftPosts] = useState([])
  const [selectedDraft, setSelectedDraft] = useState(0)

  useEffect(async () => {
    const jsonValue = await AsyncStorage.getItem('drafts')
    const data = JSON.parse(jsonValue)
    setDraftPosts(data)
  }, [])

  const saveDraft = async () => {
    if (selectedDraft === 0) {
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
    } else {
      updateDraft()
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
    setSelectedDraft(0)
    setDraftPosts(data)
  }

  const updateDraft = async () => {
    const jsonValue = await AsyncStorage.getItem('drafts')
    const data = JSON.parse(jsonValue)
    data.forEach(draft => {
      if (draft.id === selectedDraft) {
        const index = data.findIndex(el => el.id === selectedDraft)
        data[index].text = text
      }
    })
    await AsyncStorage.setItem('drafts', JSON.stringify(data))
    setDraftPosts(data)
  }

  useEffect(() => {
    console.log(selectedDraft)
  }, [selectedDraft])

  return (
    <Box my='1' justifyContent={'center'}>
      <Button onPress={() => saveDraft()} leftIcon={<FontAwesome name="save" size={24} color="white" />}>Save Draft</Button>
      <ScrollView horizontal>
        <HStack>
          {draftPosts.map(draft => <Draft key={draft.id} id={draft.id} text={draft.text} setTextAreaDefaultText={setTextAreaDefaultText} deleteDraft={deleteDraft} selectedDraft={selectedDraft} setSelectedDraft={setSelectedDraft}/>)}
        </HStack>
      </ScrollView>
    </Box>
  )
}

DraftMenu.propTypes = {
  text: propTypes.string.isRequired,
  setTextAreaDefaultText: propTypes.func.isRequired
}
