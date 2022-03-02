import React from 'react'
import { extendTheme, NativeBaseProvider } from 'native-base'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

// Custom imports
import ProfileScreen from '../profile-screen/ProfileScreen'
import FriendsScreen from '../friends-screen/FriendsScreen'
import SettingsScreen from '../settings-screen/SettingsScreen'
import { Ionicons, FontAwesome5 } from '@expo/vector-icons'

export default function HomeScreen () {
  const Tab = createBottomTabNavigator()
  return (
    <NativeBaseProvider theme={theme}>
      <Tab.Navigator initialRouteName='Profile' screenOptions={{ headerShown: false }}>
        <Tab.Screen name="Profile" component={ProfileScreen} initialParams={{ profileType: 'personal' }} options={{ tabBarIcon: () => (<Ionicons name='person' size={24} color='black' />) }}/>
        <Tab.Screen name="Friends" component={FriendsScreen} options={{ tabBarIcon: () => (<FontAwesome5 name='user-friends' size={24} color='black' />) }}/>
        <Tab.Screen name="Settings" component={SettingsScreen} options={{ tabBarIcon: () => (<Ionicons name='settings' size={24} color='black' />) }}/>
      </Tab.Navigator>
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
