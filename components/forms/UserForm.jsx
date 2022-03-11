import React, { useContext, useEffect, useState } from 'react'

// Package imports
import { extendTheme, NativeBaseProvider, Center, Heading, VStack, FormControl, Input, Button, Box } from 'native-base'
import { AntDesign } from '@expo/vector-icons'
import propTypes from 'prop-types'
import * as EmailValidator from 'email-validator'

// Custom imports
import LoadingSpinner from '../loading-spinner/LoadingSpinner'
import { signUp, editDetails } from '../../utils/HelperFunctions'
import { SpaceBookContext } from '../../context/SpacebookContext'

export default function UserForm ({ type, navigation, firstName, lastName, email }) {
  // Local state
  const [formData, setData] = useState({})
  const [firstNameErrorReason, setFirstNameErrorReason] = useState('')
  const [lastNameErrorReason, setLastNameErrorReason] = useState('')
  const [emailErrorReason, setEmailErrorReason] = useState('')
  const [passwordErrorReason, setPasswordErrorReason] = useState('')
  const [confirmPasswordErrorReason, setConfirmPasswordErrorReason] = useState('')

  // Context API
  const { setErrorAlertProps, loadingSpinnerVisible, setLoadingSpinnerVisible, token, setToken, userId, setUserId, setFormModalVisible, setUserDetailsUpdated } = useContext(SpaceBookContext)

  // Validate form details
  const validateDetails = () => {
    let passedValidation = true

    // First name validation
    if (formData.firstName === undefined || formData.firstName === '') {
      passedValidation = false
      setFirstNameErrorReason('First name is required')
    } else if (formData.firstName.length < 3) {
      passedValidation = false
      setFirstNameErrorReason('First name cannot be less than 3 characters')
    } else {
      setFirstNameErrorReason('')
    }

    // Last Name validation
    if (formData.lastName === undefined || formData.lastName === '') {
      passedValidation = false
      setLastNameErrorReason('Last name is required')
    } else if (formData.lastName.length < 3) {
      passedValidation = false
      setLastNameErrorReason('Last name cannot be less than 3 characters')
    } else {
      setLastNameErrorReason('')
    }

    // Email Validation
    if (formData.email === undefined || formData.surname === '') {
      passedValidation = false
      setEmailErrorReason('Email is required')
    } else if (formData.email.length < 6) {
      passedValidation = false
      setEmailErrorReason('Email cannot be less than 6 characters')
    } else if (EmailValidator.validate(formData.email) === false) {
      passedValidation = false
      setEmailErrorReason('Email not valid')
    } else {
      setEmailErrorReason('')
    }

    // Password Validation
    if (formData.password === undefined || formData.password === '') {
      passedValidation = false
      setPasswordErrorReason('Password is required')
    } else if (formData.password.length < 6) {
      passedValidation = false
      setPasswordErrorReason('Password cannot be less than 6 characters')
    } else if (!/[A-Z]/.test(formData.password)) {
      passedValidation = false
      setPasswordErrorReason('Password must contain a capital letter')
    } else if (!/[_\W0-9]/.test(formData.password)) {
      passedValidation = false
      setPasswordErrorReason('Password must contain a special character')
    } else if (!/\d/.test(formData.password)) {
      passedValidation = false
      setPasswordErrorReason('Password must contain a number')
    } else {
      setPasswordErrorReason('')
    }

    // ConfirmPassword Validation
    if (formData.confirmPassword === undefined || formData.confirmPassword === '') {
      passedValidation = false
      setConfirmPasswordErrorReason('Please re-type your password')
    } else if (formData.confirmPassword !== formData.password) {
      passedValidation = false
      setConfirmPasswordErrorReason('Passwords do not match')
    } else {
      setConfirmPasswordErrorReason('')
    }
    return passedValidation
  }

  // Handle submit
  const onSubmit = () => {
    if (validateDetails()) {
      type === 'signup' ? signUpNewUser() : editUserDetails()
    }
  }

  // Send sign up request to user
  const signUpNewUser = async () => {
    setLoadingSpinnerVisible(true)
    const response = await signUp(setErrorAlertProps, formData)
    if (response.success === true) {
      setToken(response.token)
      setUserId(response.userId)
      setLoadingSpinnerVisible(false)
      navigation.push('Home')
    }
  }

  // Send edit details request to server
  const editUserDetails = async () => {
    setLoadingSpinnerVisible(true)
    const response = await editDetails(token, userId, setErrorAlertProps, formData)
    if (response.success === true) {
      setUserDetailsUpdated(true)
      setLoadingSpinnerVisible(false)
      setFormModalVisible(false)
    }
  }

  // Go back to the login page
  const onBackPress = () => {
    navigation.goBack()
  }

  // Conditional rendering depending on if the form is used in the sign up screen or edit details screen
  const checkTypeHeader = () => {
    if (type === 'signup') {
      return (
        <Box>
          <AntDesign p="10" name="arrowleft" size={24} color="black" onPress={onBackPress} />
          <Heading size="lg" color="coolGray.800" _dark={{ color: 'warmGray.50' }} fontWeight="semibold">
            Welcome
          </Heading>
          <Heading mt="1" color="coolGray.600" _dark={{ color: 'warmGray.200' }} fontWeight="medium" size="xs">
            Sign up to access SpaceBook!
          </Heading>
        </Box>
      )
    } else {
      return null
    }
  }

  // Sets default values for when the form is used on the edit details screen
  const getDefaultValues = (input) => {
    if (type === 'edit') {
      switch (input) {
        case 'firstName':
          return firstName
        case 'lastName':
          return lastName
        case 'email':
          return email
      }
    } else {
      return null
    }
  }

  // Sets the default values if the form is used on the edit details screen
  useEffect(() => {
    if (type === 'edit') {
      setData({ firstName: firstName, lastName: lastName, email: email })
    }
  }, [])

  return (
    <NativeBaseProvider theme={theme}>
      {loadingSpinnerVisible && <LoadingSpinner />}
      <Center h='100%' w="100%">
        <Box safeArea w="90%" maxW="290" py="8">
          {checkTypeHeader()}
          <VStack space={3} mt="5">
            <FormControl isRequired isInvalid={firstNameErrorReason.includes('First name')}>
              <FormControl.Label>First Name</FormControl.Label>
              <Input placeholder='Joe' defaultValue={getDefaultValues('firstName')} onChangeText={value => setData({ ...formData, firstName: value })} />
              {firstNameErrorReason.includes('First name') ? <FormControl.ErrorMessage>{firstNameErrorReason}</FormControl.ErrorMessage> : null }
            </FormControl>
            <FormControl isRequired isInvalid={lastNameErrorReason.includes('Last name')}>
              <FormControl.Label>Last Name</FormControl.Label>
              <Input placeholder='Blogs' defaultValue={getDefaultValues('lastName')} onChangeText={value => setData({ ...formData, lastName: value })} />
              {lastNameErrorReason.includes('Last name') ? <FormControl.ErrorMessage>{lastNameErrorReason}</FormControl.ErrorMessage> : null }
            </FormControl>
            <FormControl isRequired isInvalid={emailErrorReason.includes('Email')}>
              <FormControl.Label>Email</FormControl.Label>
              <Input placeholder='Example@email.com' defaultValue={getDefaultValues('email')} onChangeText={value => setData({ ...formData, email: value })} />
              {emailErrorReason.includes('Email') ? <FormControl.ErrorMessage>{emailErrorReason}</FormControl.ErrorMessage> : null }
            </FormControl>
            <FormControl isRequired isInvalid={passwordErrorReason.includes('Password')}>
              <FormControl.Label>Password</FormControl.Label>
              <Input type="password" onChangeText={value => setData({ ...formData, password: value })} />
              {passwordErrorReason.includes('Password') ? <FormControl.ErrorMessage>{passwordErrorReason}</FormControl.ErrorMessage> : null }
            </FormControl>
            <FormControl isRequired isInvalid={confirmPasswordErrorReason.includes('word')}>
              <FormControl.Label>Confirm Password</FormControl.Label>
              <Input type="password" onChangeText={value => setData({ ...formData, confirmPassword: value })}/>
              {confirmPasswordErrorReason.includes('word') ? <FormControl.ErrorMessage>{confirmPasswordErrorReason}</FormControl.ErrorMessage> : null }
            </FormControl>
            <Button mt="2" bg="title.bg" onPress={onSubmit}>
              {type === 'signup' ? 'Sign Up' : 'Edit Details'}
            </Button>
          </VStack>
        </Box>
      </Center>
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

UserForm.propTypes = {
  type: propTypes.string.isRequired,
  navigation: propTypes.shape({
    navigate: propTypes.func.isRequired,
    push: propTypes.func.isRequired,
    goBack: propTypes.func.isRequired
  }).isRequired,
  firstName: propTypes.string,
  lastName: propTypes.string,
  email: propTypes.string
}

UserForm.defaultProps = {
  firstName: '',
  lastName: '',
  email: ''
}
