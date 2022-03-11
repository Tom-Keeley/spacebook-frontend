import React, { useState, useContext, useEffect } from 'react'

// Package imports
import { extendTheme, NativeBaseProvider } from 'native-base'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

// Custom imports
import ProfileScreen from '../profile-screen/ProfileScreen'
import FriendsScreen from '../friends-screen/FriendsScreen'
import SettingsScreen from '../settings-screen/SettingsScreen'
import { Ionicons, FontAwesome5 } from '@expo/vector-icons'
import { SpaceBookContext } from '../../context/SpacebookContext'

export default function HomeScreen () {
  // Local state
  const [tabOptions, setTabOptions] = useState({})

  // Context API
  const { numOfFriendRequests, totalFriendRequests, token, setErrorAlertProps } = useContext(SpaceBookContext)

  // Init
  const Tab = createBottomTabNavigator()

  // Render a notification badge if there are friend requests
  const renderTabBadge = async () => {
    if (totalFriendRequests > 0) {
      setTabOptions({ tabBarIcon: () => (<FontAwesome5 name='user-friends' size={24} color='black' />), tabBarBadge: totalFriendRequests })
    } else {
      setTabOptions({ tabBarIcon: () => (<FontAwesome5 name='user-friends' size={24} color='black' />) })
    }
  }

  // Get number of friend requests and render badge if there are on render
  useEffect(async () => {
    await numOfFriendRequests(token, setErrorAlertProps)
    renderTabBadge()
  }, [])

  // If number of friend requests changes re render badge
  useEffect(() => {
    renderTabBadge()
  }, [totalFriendRequests])

  return (
    <NativeBaseProvider theme={theme}>
      <Tab.Navigator initialRouteName='Profile' screenOptions={{ headerShown: false }}>
        <Tab.Screen name="Profile" component={ProfileScreen} initialParams={{ profileType: 'personal' }} options={{ tabBarIcon: () => (<Ionicons name='person' size={24} color='black' />) }}/>
        <Tab.Screen name="Friends" component={FriendsScreen} options={tabOptions}/>
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
