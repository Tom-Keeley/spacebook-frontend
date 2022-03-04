import React, { useState, useContext, useEffect } from 'react'
import { extendTheme, NativeBaseProvider } from 'native-base'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { getNumOfFriendRequests } from '../../utils/HelperFunctions'

// Custom imports
import ProfileScreen from '../profile-screen/ProfileScreen'
import FriendsScreen from '../friends-screen/FriendsScreen'
import SettingsScreen from '../settings-screen/SettingsScreen'
import { Ionicons, FontAwesome5 } from '@expo/vector-icons'
import { SpaceBookContext } from '../../context/SpacebookContext'

export default function HomeScreen () {
  const [tabOptions, setTabOptions] = useState({})
  const { token, setErrorAlertProps } = useContext(SpaceBookContext)
  const Tab = createBottomTabNavigator()

  const numOfFriendRequests = async () => {
    const response = await getNumOfFriendRequests(token, setErrorAlertProps)
    if (response.success === true && response.num > 0) {
      setTabOptions({ tabBarIcon: () => (<FontAwesome5 name='user-friends' size={24} color='black' />), tabBarBadge: response.num })
    } else {
      setTabOptions({ tabBarIcon: () => (<FontAwesome5 name='user-friends' size={24} color='black' />) })
    }
  }

  useEffect(() => {
    numOfFriendRequests()
  }, [])

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
