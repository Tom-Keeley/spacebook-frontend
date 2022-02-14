import React from 'react'
import { extendTheme, NativeBaseProvider } from 'native-base'
import PropTypes from 'prop-types'

// Custom imports
import UserForm from '../../components/forms/UserForm'

export default function SignUpScreen ({ navigation }) {
  return (
    <NativeBaseProvider theme={theme}>
      <UserForm type="signup" navigation={navigation} />
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
SignUpScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired
  }).isRequired
}
