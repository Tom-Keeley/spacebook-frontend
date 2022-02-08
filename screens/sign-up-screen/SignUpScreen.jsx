import React from 'react'
import { extendTheme, NativeBaseProvider, Center, Heading, VStack, FormControl, Input, Button, Box } from 'native-base'

export default function SignUpScreen () {
  return (
    <NativeBaseProvider theme={theme}>
      <Center w="100%">
        <Box safeArea p="2" w="90%" maxW="290" py="8">
          <Heading size="lg" color="coolGray.800" _dark={{
            color: 'warmGray.50'
          }} fontWeight="semibold">
            Welcome
          </Heading>
          <Heading mt="1" color="coolGray.600" _dark={{
            color: 'warmGray.200'
          }} fontWeight="medium" size="xs">
            Sign up to access SpaceBook!
          </Heading>
          <VStack space={3} mt="5">
            <FormControl isRequired>
              <FormControl.Label>First name</FormControl.Label>
              <Input />
            </FormControl>
            <FormControl isRequired>
              <FormControl.Label>Surname</FormControl.Label>
              <Input />
            </FormControl>
            <FormControl isRequired>
              <FormControl.Label>Email</FormControl.Label>
              <Input />
            </FormControl>
            <FormControl isRequired>
              <FormControl.Label>Password</FormControl.Label>
              <Input type="password" />
            </FormControl>
            <FormControl isRequired>
              <FormControl.Label>Confirm Password</FormControl.Label>
              <Input type="password" />
            </FormControl>
            <Button mt="2" colorScheme="indigo">
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
