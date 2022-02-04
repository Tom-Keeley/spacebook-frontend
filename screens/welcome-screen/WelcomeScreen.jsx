import React, { useState } from 'react'
import { Center, Text, NativeBaseProvider, extendTheme, Box, Heading, Button, VStack, FormControl, Input, Link, HStack } from 'native-base'

export default function WelcomeScreen () {
  const [formData, setData] = useState({})
  const [emailErrorReason, setEmailErrorReason] = useState('')
  const [passwordErrorReason, setPasswordErrorReason] = useState('')

  const validateLoginDetails = () => {
    let passedValidation = true

    // Email validation
    if (formData.email === undefined || formData.email === '') {
      passedValidation = false
      setEmailErrorReason('Email is required')
    } else if (formData.email.length < 3) {
      passedValidation = false
      setEmailErrorReason('Email cannot be less than 3 characters')
    } else {
      setEmailErrorReason('')
    }

    // Password validation
    if (formData.password === undefined || formData.password === '') {
      passedValidation = false
      setPasswordErrorReason('Password is required')
    } else if (formData.password.length < 3) {
      passedValidation = false
      setPasswordErrorReason('Password cannot be less than 3 characters')
    } else {
      setPasswordErrorReason('')
    }

    return passedValidation
  }

  const onSubmit = () => {
    validateLoginDetails() ? console.log('Submitted') : console.log('Failed')
  }

  return (
    <NativeBaseProvider theme={theme}>
      <Center w={'100%'} h={'10%'} bg="title.bg">
        <Text color={'white'} fontSize={'5xl'}>SpaceBook</Text>
      </Center>
      <Center w={'100%'} h={'90%'}>
      <Box safeArea w="90%" maxW="300">
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
            <Link _text={{ color: 'indigo.500', fontWeight: 'medium', fontSize: 'sm' }} href="#">
              Sign Up
            </Link>
          </HStack>
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
