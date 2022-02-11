import React, { useContext, useState } from 'react'
import { Center, Text, Box, Heading, Button, VStack, FormControl, Input, Link, HStack, View } from 'native-base'
import { SpaceBookContext } from '../../context/SpacebookContext'

// Import custom
import ErrorPopup from '../error-popup/ErrorPopup'
import LoadingSpinner from '../loading-spinner/LoadingSpinner'

export default function LoginForm ({ navigation }) {
  const [formData, setData] = useState({})
  const [emailErrorReason, setEmailErrorReason] = useState('')
  const [passwordErrorReason, setPasswordErrorReason] = useState('')
  const { setToken, errorAlertVisible, setErrorAlertProps, loadingSpinnerVisible, setLoadingSpinnerVisible } = useContext(SpaceBookContext)

  const validateLoginDetails = () => {
    let passedValidation = true

    // Email validation
    if (formData.email === undefined || formData.email === '') {
      passedValidation = false
      setEmailErrorReason('Email is required')
    } else if (formData.email.length < 6) {
      passedValidation = false
      setEmailErrorReason('Email cannot be less than 6 characters')
    } else if (!formData.email.includes('@')) {
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

  const onSubmit = async () => {
    if (validateLoginDetails()) {
      login()
    }
  }

  const login = async () => {
    setLoadingSpinnerVisible(true)
    try {
      const response = await fetch('http://localhost:3333/api/1.0.0/login', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      })

      if (response.status === 400) {
        setErrorAlertProps('Unable to sign in', `${await response.text()}`, true)
        setLoadingSpinnerVisible(false)
      } else {
        const json = await response.json()
        console.log(json)
        setToken(json.token)
        setLoadingSpinnerVisible(false)
        navigation.push('Home')
      }
    } catch (err) {
      console.log(err)
      setErrorAlertProps(`${err.message}`, 'Failed to sign in please try again', true)
    }
  }

  const bypass = async () => {
    setLoadingSpinnerVisible(true)
    try {
      const response = await fetch('http://localhost:3333/api/1.0.0/login', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'tom.keeley@mmu.com',
          password: 'testing'
        })
      })

      if (response.status === 400) {
        setErrorAlertProps('Unable to sign in', `${await response.text()}`, true)
        setLoadingSpinnerVisible(false)
      } else {
        const json = await response.json()
        console.log(json)
        setToken(json.token)
        setLoadingSpinnerVisible(false)
        navigation.push('Home')
      }
    } catch (err) {
      console.log(err)
      setErrorAlertProps(`${err.message}`, 'Failed to sign in please try again', true)
    }
  }

  return (
    <View w="100%" h='100%'>
      {loadingSpinnerVisible && <LoadingSpinner />}
      {errorAlertVisible && <ErrorPopup />}
      <Button onPress={bypass}>Bypass</Button>
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
                {emailErrorReason.includes('Email') ? <FormControl.ErrorMessage>{emailErrorReason}</FormControl.ErrorMessage> : null }
              </FormControl>
              <FormControl isRequired isInvalid={passwordErrorReason.includes('Password')}>
                <FormControl.Label>Password</FormControl.Label>
                <Input type="password" onChangeText={value => setData({ ...formData, password: value })}/>
                {passwordErrorReason.includes('Password') ? <FormControl.ErrorMessage>{passwordErrorReason}</FormControl.ErrorMessage> : null}
                <Link _text={{ fontSize: 'xs', fontWeight: '500', color: 'indigo.500' }} alignSelf="flex-end" mt="1">Forget Password?</Link>
              </FormControl>
              <Button mt="2" bg='title.bg' onPress={onSubmit}>
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
