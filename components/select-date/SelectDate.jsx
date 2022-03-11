import React, { useState, useContext } from 'react'

// Package imports
import { VStack, Button, useToast } from 'native-base'
import { Calendar } from 'react-native-calendars'
import { TimePicker } from 'react-native-simple-time-picker'
import propTypes from 'prop-types'

// Custom imports
import { createNewPost } from '../../utils/HelperFunctions'
import { SpaceBookContext } from '../../context/SpacebookContext'

export default function SelectDate ({ text }) {
  // Local State
  const [selectedDate, setSelectedDate] = useState({})
  const [postDate, setPostDate] = useState('')
  const [time, setTime] = useState(0)

  // Context API
  const { token, userId, setErrorAlertProps } = useContext(SpaceBookContext)

  // INIT
  const toast = useToast()

  const setDate = (day) => {
    const dateSelected = {}
    const date = day.dateString
    dateSelected[date] = { selected: true, marked: true, selectedColor: 'blue' }
    setSelectedDate(dateSelected)
    setPostDate(day.dateString)
  }

  const schedulePost = async () => {
    const interval = setInterval(async () => {
      const tempCurrentDate = new Date()
      const currentDate = tempCurrentDate.toISOString().split('T')[0]
      let currentHours = tempCurrentDate.getHours()
      let currentMinuets = tempCurrentDate.getMinutes()
      if (currentHours < 10) {
        currentHours = '0' + currentHours
      }
      if (currentMinuets < 10) {
        currentMinuets = '0' + currentMinuets
      }
      const currentTime = currentHours.toString() + ':' + currentMinuets.toString()
      const postTime = time.hours + ':' + time.minutes

      if (currentDate === postDate && currentTime === postTime) {
        const response = await createNewPost(token, userId, text, setErrorAlertProps)
        if (response.success === true) {
          console.log('POST UPLOADED')
          toast.show({
            title: 'Post uploaded',
            status: 'success',
            placement: 'top'
          })
          clearInterval(interval)
        }
      }
    }, 15000)
  }

  return (
    <VStack>
      <Calendar onDayPress={day => { setDate(day) }} markedDates={selectedDate} />
      <TimePicker onChange={(time) => {
        setTime(time)
      }} />
      <Button onPress={() => schedulePost()} my={2}>Schedule Post</Button>
    </VStack>
  )
}

SelectDate.propTypes = {
  text: propTypes.string.isRequired
}
