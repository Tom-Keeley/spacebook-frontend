import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { SSRProvider } from '@react-aria/ssr'

//  Screen Imports
import WelcomeScreen from './screens/welcome-screen/WelcomeScreen'
import SignUpScreen from './screens/sign-up-screen/SignUpScreen'
import HomeScreen from './screens/home-screen/HomeScreen'

// ContextAPI Import
import SpaceBookContextProvider from './context/SpacebookContext'

const Stack = createNativeStackNavigator()

export default function App () {
  return (
    <SSRProvider>
      <SpaceBookContextProvider>
        <NavigationContainer>
          <Stack.Navigator name="Welcome-screen" initialRouteName='Welcome' screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Sign Up" component={SignUpScreen}/>
            <Stack.Screen name="Home" component={HomeScreen}/>
          </Stack.Navigator>
        </NavigationContainer>
      </SpaceBookContextProvider>
    </SSRProvider>
  )
}
