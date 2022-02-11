import React, { useContext } from 'react'
import { View, Text, extendTheme, NativeBaseProvider } from 'native-base'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

// ContextAPI
import { SpaceBookContext } from '../../context/SpacebookContext'

// Custom imports
import ProfileScreen from '../profile-screen/ProfileScreen'
import FriendsScreen from '../friends-screen/FriendsScreen'
import FeedScreen from '../feed-screen/FeedScreen'
import SettingsScreen from '../settings-screen/SettingsScreen'
import { Ionicons, FontAwesome, FontAwesome5 } from '@expo/vector-icons'

export default function HomeScreen () {
  const Tab = createBottomTabNavigator()
  const { token } = useContext(SpaceBookContext)
  return (
    <NativeBaseProvider theme={theme}>
    <View>
      <Text>
        Logged in
      </Text>
      <Text>
        {token}
      </Text>
    </View>
    <Tab.Navigator initialRouteName='Profile' screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Feed" component={FeedScreen} options={{ tabBarIcon: () => (<FontAwesome name='feed' size={24} color='black' />) }}/>
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: () => (<Ionicons name='person' size={24} color='black' />) }}/>
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
