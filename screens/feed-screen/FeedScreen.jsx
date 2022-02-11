import React from 'react'
import { Fab, View } from 'native-base'
import { AntDesign } from '@expo/vector-icons'

export default function FeedScreen () {
  return (
    <View w='100%' h='100%'>
      <div>FeedScreen</div>
      <Fab renderInPortal={false} shadow={2} right={2} bottom={50} size="sm" icon={<AntDesign name="plus" size={24} color="white" />} />
    </View>
  )
}
