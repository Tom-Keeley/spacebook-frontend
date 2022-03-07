import React, { useState, useContext, useEffect } from 'react'
import { extendTheme, NativeBaseProvider } from 'native-base'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

// Custom imports
import ProfileScreen from '../profile-screen/ProfileScreen'
import FriendsScreen from '../friends-screen/FriendsScreen'
import SettingsScreen from '../settings-screen/SettingsScreen'
import { Ionicons, FontAwesome5 } from '@expo/vector-icons'
import { SpaceBookContext } from '../../context/SpacebookContext'

export default function HomeScreen () {
  const { numOfFriendRequests, totalFriendRequests, token, setErrorAlertProps } = useContext(SpaceBookContext)
  const [tabOptions, setTabOptions] = useState({})
  const Tab = createBottomTabNavigator()

  const renderTabBadge = async () => {
    if (totalFriendRequests > 0) {
      setTabOptions({ tabBarIcon: () => (<FontAwesome5 name='user-friends' size={24} color='black' />), tabBarBadge: totalFriendRequests })
    } else {
      setTabOptions({ tabBarIcon: () => (<FontAwesome5 name='user-friends' size={24} color='black' />) })
    }
  }

  useEffect(async () => {
    await numOfFriendRequests(token, setErrorAlertProps)
    renderTabBadge()
  }, [])

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
