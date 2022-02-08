import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

//  Screen Imports
import WelcomeScreen from './screens/welcome-screen/WelcomeScreen'
import SignUpScreen from './screens/sign-up-screen/SignUpScreen'
const Stack = createNativeStackNavigator()

export default function App () {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Welcome'>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Sign Up" component={SignUpScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

// screenOptions={{ headerShown: false }}
