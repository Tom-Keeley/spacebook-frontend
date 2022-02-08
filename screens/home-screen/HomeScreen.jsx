import React, { useContext } from 'react'
import { View, Text, extendTheme, NativeBaseProvider } from 'native-base'
import { SpaceBookContext } from '../../context/SpacebookContext'

export default function HomeScreen () {
  const { token } = useContext(SpaceBookContext)
  return (
    <NativeBaseProvider theme={theme}>
    <View>
      <Text>
        Logged in
      </Text>
      <Text>
        {token}
      </Text>
    </View>
    </NativeBaseProvider>
  )
}

const theme = extendTheme({
  colors: {
    title: {
      bg: '#4267B2'
    }
  }
})
