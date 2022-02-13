import React from 'react'
import { extendTheme, NativeBaseProvider } from 'native-base'

// Custom imports
import SignUpForm from '../../components/forms/UserForm'

export default function SignUpScreen ({ navigation }) {
  return (
    <NativeBaseProvider theme={theme}>
      <SignUpForm type="signup" navigation={navigation} />
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
