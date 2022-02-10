import React from 'react'
import { extendTheme, NativeBaseProvider, Center, Text } from 'native-base'

// Custom  imports
import LoginForm from '../../components/forms/LoginForm'

export default function WelcomeScreen ({ navigation }) {
  return (
    <NativeBaseProvider theme={theme}>
        <Center bg="title.bg" w={'100%'} h={'10%'}>
          <Text color={'white'} fontSize={'5xl'}>SpaceBook</Text>
        </Center>
        <LoginForm navigation={navigation} />
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
