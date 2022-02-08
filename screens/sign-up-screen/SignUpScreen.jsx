import React, { useEffect, useState } from 'react'
import { extendTheme, NativeBaseProvider, Center, Heading, VStack, FormControl, Input, Button, Box } from 'native-base'

export default function SignUpScreen () {
  const [formData, setData] = useState({})
  const [firstNameErrorReason, setFirstNameErrorReason] = useState('')
  const [surnameErrrorReason, setSurnameErrorReason] = useState('')
  const [emailErrorReason, setEmailErrorReason] = useState('')
  const [passwordErrorReason, setPasswordErrorReason] = useState('')
  const [confirmPasswordErrorReason, setConfirmPasswordErrorReason] = useState('')

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

    // Surname validation
    if (formData.surname === undefined || formData.surname === '') {
      passedValidation = false
      setSurnameErrorReason('Surname is required')
    } else if (formData.surname.length < 3) {
      passedValidation = false
      setSurnameErrorReason('Surname cannot be less than 3 characters')
    } else {
      setSurnameErrorReason('')
    }

    // Email Validation
    if (formData.email === undefined || formData.surname === '') {
      passedValidation = false
      setEmailErrorReason('Email is required')
    } else if (formData.email.length < 3) {
      passedValidation = false
      setEmailErrorReason('Email cannot be less than 3 characters')
    } else {
      setEmailErrorReason('')
    }

    // Password Validation
    if (formData.password === undefined || formData.password === '') {
      passedValidation = false
      setPasswordErrorReason('Password is required')
    } else if (formData.password.length < 3) {
      passedValidation = false
      setPasswordErrorReason('Password cannot be less than 3 characters')
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

  useEffect(() => {
    console.log(formData)
  }, [formData])

  useEffect(() => {
    console.log(confirmPasswordErrorReason)
  }, [confirmPasswordErrorReason])

  const onSubmit = () => {
    validateDetails() ? console.log('Submitted') : console.log('Failed')
  }

  return (
    <NativeBaseProvider theme={theme}>
      <Center w="100%">
        <Box safeArea p="2" w="90%" maxW="290" py="8">
          <Heading size="lg" color="coolGray.800" _dark={{ color: 'warmGray.50' }} fontWeight="semibold">
            Welcome
          </Heading>
          <Heading mt="1" color="coolGray.600" _dark={{ color: 'warmGray.200' }} fontWeight="medium" size="xs">
            Sign up to access SpaceBook!
          </Heading>
          <VStack space={3} mt="5">
            <FormControl isRequired isInvalid={firstNameErrorReason.includes('First name')}>
              <FormControl.Label>First name</FormControl.Label>
              <Input placeholder='Joe' onChangeText={value => setData({ ...formData, firstName: value })} />
              {firstNameErrorReason.includes('First name') ? <FormControl.ErrorMessage>{firstNameErrorReason}</FormControl.ErrorMessage> : null }
            </FormControl>
            <FormControl isRequired isInvalid={surnameErrrorReason.includes('Surname')}>
              <FormControl.Label>Surname</FormControl.Label>
              <Input placeholder='Blogs' onChangeText={value => setData({ ...formData, surname: value })} />
              {surnameErrrorReason.includes('Surname') ? <FormControl.ErrorMessage>{surnameErrrorReason}</FormControl.ErrorMessage> : null }
            </FormControl>
            <FormControl isRequired isInvalid={emailErrorReason.includes('Email')}>
              <FormControl.Label>Email</FormControl.Label>
              <Input placeholder='Example@email.com' onChangeText={value => setData({ ...formData, email: value })} />
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
              Sign up
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
