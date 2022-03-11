import { VStack } from 'native-base'
import React, { useState, useEffect } from 'react'
import { Calendar } from 'react-native-calendars'
import { TimePicker } from 'react-native-simple-time-picker'

export default function SelectDate () {
  const [selectedDate, setSelectedDate] = useState({})
  const [time, setTime] = useState(0)

  const setDate = (day) => {
    console.log(day)
    const dateSelected = {}
    const date = day.dateString
    dateSelected[date] = { selected: true, marked: true, selectedColor: 'blue' }
    setSelectedDate(dateSelected)
  }

  useEffect(() => {
    console.log(selectedDate)
    console.log(time)
  }, [selectedDate, time])

  return (
    <VStack>
      <Calendar onDayPress={day => { setDate(day) }} markedDates={selectedDate} />
      <TimePicker onChange={(time) => {
        setTime(time)
      }} />
    </VStack>
  )
}
