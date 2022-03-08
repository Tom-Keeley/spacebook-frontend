import React from 'react'
import { Fab, Icon } from 'native-base'
import { AntDesign } from '@expo/vector-icons'

export default function CreatePost () {
  return (
    <Fab renderInPortal={false} shadow={2} size="sm" icon={<Icon color="white" as={<AntDesign name="plus" />} size="sm" />} />
  )
}
