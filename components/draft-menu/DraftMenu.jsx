import React, { useState, useEffect } from 'react'

// Package imports
import { Button, Box, HStack, ScrollView } from 'native-base'
import { FontAwesome } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Draft from '../draft/Draft'
import propTypes from 'prop-types'

export default function DraftMenu ({ text, setTextAreaDefaultText }) {
  // Local state
  const [draftPosts, setDraftPosts] = useState([])
  const [selectedDraft, setSelectedDraft] = useState(0)

  // Fetch drafts on load
  useEffect(async () => {
    const jsonValue = await AsyncStorage.getItem('drafts')
    const data = JSON.parse(jsonValue)
    setDraftPosts(data)
  }, [])

  // Save a draft to async storage
  const saveDraft = async () => {
    if (selectedDraft === 0) {
      try {
        const jsonValue = await AsyncStorage.getItem('drafts')
        if (jsonValue === null) {
          const draft = [{ id: 1, text: text }]
          await AsyncStorage.setItem('drafts', JSON.stringify(draft))
        } else {
          const data = JSON.parse(jsonValue)
          const newData = { id: (data.length + 1), text: text }
          data.push(newData)
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

  // Delete a draft from async storage
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

  // Update a draft in async storage
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

  return (
    <Box my='1' justifyContent={'center'}>
      {text !== '' ? <Button onPress={() => saveDraft()} leftIcon={<FontAwesome name="save" size={24} color="white" />}>Save Draft</Button> : null}
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
