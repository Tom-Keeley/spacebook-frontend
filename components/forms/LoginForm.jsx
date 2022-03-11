import React, { useContext, useEffect, useState } from 'react'

// Package imports
import { Center, Text, Box, Heading, Button, VStack, FormControl, Input, Link, HStack, View, Checkbox } from 'native-base'
import propTypes from 'prop-types'
import * as EmailValidator from 'email-validator'
import AsyncStorage from '@react-native-async-storage/async-storage'

// Custom imports
import ErrorPopup from '../error-popup/ErrorPopup'
import LoadingSpinner from '../loading-spinner/LoadingSpinner'
import { login } from '../../utils/HelperFunctions'
import { SpaceBookContext } from '../../context/SpacebookContext'

export default function LoginForm ({ navigation }) {
  // Local state
  const [formData, setData] = useState({})
  const [emailErrorReason, setEmailErrorReason] = useState('')
  const [passwordErrorReason, setPasswordErrorReason] = useState('')
  const [rememberMe, setRememberMe] = useState(false)

  // Context API
  const { setToken, setUserId, errorAlertVisible, setErrorAlertProps, loadingSpinnerVisible, setLoadingSpinnerVisible, setProfileType } = useContext(SpaceBookContext)

  // Validate log in details
  const validateLoginDetails = () => {
    let passedValidation = true

    // Email validation
    if (formData.email === undefined || formData.email === '') {
      passedValidation = false
      setEmailErrorReason('Email is required')
    } else if (formData.email.length < 6) {
      passedValidation = false
      setEmailErrorReason('Email cannot be less than 6 characters')
    } else if (EmailValidator.validate(formData.email) === false) {
      passedValidation = false
      setEmailErrorReason('Email is not vaild')
    } else {
      setEmailErrorReason('')
    }

    // Password validation
    if (formData.password === undefined || formData.password === '') {
      passedValidation = false
      setPasswordErrorReason('Password is required')
    } else if (formData.password.length < 6) {
      passedValidation = false
      setPasswordErrorReason('Password cannot be less than 6 characters')
    } else {
      setPasswordErrorReason('')
    }

    return passedValidation
  }

  // Handle submit
  const onSubmit = async () => {
    if (validateLoginDetails()) {
      loginUser()
    }
  }

  // Send log in request to server
  const loginUser = async () => {
    if (rememberMe === true) {
      const data = { email: formData.email, password: formData.password }
      await AsyncStorage.setItem('rememberMe', JSON.stringify(data))
    }
    setLoadingSpinnerVisible(true)
    const response = await login(setErrorAlertProps, formData)
    if (response.success === true) {
      setToken(response.token)
      setUserId(response.userId)
      setLoadingSpinnerVisible(false)
      setProfileType('personal')
      navigation.push('Home')
    }
  }

  const rememberMeLogin = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('rememberMe')
      if (jsonValue !== null) {
        setLoadingSpinnerVisible(true)
        const data = JSON.parse(jsonValue)
        const response = await login(setErrorAlertProps, data)
        if (response.success === true) {
          setToken(response.token)
          setUserId(response.userId)
          setLoadingSpinnerVisible(false)
          setProfileType('personal')
          navigation.push('Home')
        }
      }
    } catch (err) {
      console.log('Error signing in')
    }
  }

  useEffect(() => {
    rememberMeLogin()
  }, [])

  return (
    <View w="100%" h='100%'>
      {loadingSpinnerVisible && <LoadingSpinner />}
      {errorAlertVisible && <ErrorPopup />}
      <Box bg="title.bg" h='100%' w="100%">
        <Center w={'100%'} h={'90%'} bg="title.bg">
          <Box safeArea w="90%" bg="white" p='5'>
            <Heading size="lg" fontWeight="600" color="coolGray.800" _dark={{ color: 'warmGray.50' }}>
              Welcome
            </Heading>
            <Heading mt="1" _dark={{ color: 'warmGray.200' }} color="coolGray.600" fontWeight="medium" size="xs">
              Sign in to SpaceBook!
            </Heading>
            <VStack space={3} mt="5">
              <FormControl isRequired isInvalid={emailErrorReason.includes('Email')}>
                <FormControl.Label>Email</FormControl.Label>
                <Input placeholder="example@email.com" onChangeText={value => setData({ ...formData, email: value })} />
                {emailErrorReason.includes('Email') ? <FormControl.ErrorMessage>{emailErrorReason}</FormControl.ErrorMessage> : null}
              </FormControl>
              <FormControl isRequired isInvalid={passwordErrorReason.includes('Password')}>
                <FormControl.Label>Password</FormControl.Label>
                <Input type="password" onChangeText={value => setData({ ...formData, password: value })} />
                {passwordErrorReason.includes('Password') ? <FormControl.ErrorMessage>{passwordErrorReason}</FormControl.ErrorMessage> : null}
                <HStack my={'1'}>
                  <Checkbox onChange={value => setRememberMe(value)} shadow={2} value="test" accessibilityLabel="This is a dummy checkbox" />
                  <Text> Remember me</Text>
                </HStack>
              </FormControl>
              <Button mt="2" bg='title.bg' onPress={() => onSubmit()}>
                Sign in
              </Button>
              <HStack mt="6" justifyContent="center">
                <Text fontSize="sm" color="coolGray.600" _dark={{ color: 'warmGray.200' }}>
                  I&apos;m a new user.{' '}
                </Text>
                <Link _text={{ color: 'indigo.500', fontWeight: 'medium', fontSize: 'sm' }} onPress={() => navigation.push('Sign Up')}>
                  Sign Up
                </Link>
              </HStack>
            </VStack>
          </Box>
        </Center>
      </Box>
    </View>
  )
}

LoginForm.propTypes = {
  navigation: propTypes.shape({
    navigate: propTypes.func.isRequired,
    push: propTypes.func.isRequired
  }).isRequired
}
