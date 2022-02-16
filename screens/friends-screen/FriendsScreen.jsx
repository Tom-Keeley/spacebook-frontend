import React, { useContext, useEffect, useState } from 'react'
import { VStack, HStack, Flex, Input, Icon, Box, Radio, ScrollView, Spacer, Center } from 'native-base'
import { MaterialIcons } from '@expo/vector-icons'

// Context API
import { SpaceBookContext } from '../../context/SpacebookContext'

// Custom imports
import SearchOptions from '../../components/search-options/SearchOptions'
import UserPreview from '../../components/user-preview/UserPreview'

// https://editor.swagger.io/search?q=Ash%20Williams&limit=20&offset=0

export default function FriendsScreen () {
  const [checkBoxValue, setCheckBoxValue] = useState('find-friends')
  const { pagination, token } = useContext(SpaceBookContext)
  const [users, setUsers] = useState([])

  useEffect(async () => {
    try {
      const response = await fetch(`http://localhost:3333/api/1.0.0/search?limit=${pagination}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-Authorization': token
        }
      })
      setUsers(await response.json())
    } catch (err) {
      console.log(err)
    }
  }, [])

  useEffect(() => {
    console.log(users)
  }, [users])

  return (
    <Box safeArea w={'100%'} h={'100%'}>
      <VStack p='5'>
        <Box bg={'white'} py={'2'} px={'3'} m={'1'} borderRadius={'5'} shadow={'5'}>
          <HStack>
            <Input placeholder="Search People & Places" w={'90%'} borderRadius="4" py="3" px="1" fontSize="14" InputLeftElement={<Icon m="2" ml="3" size="6" color="gray.400" as={<MaterialIcons name="search" />} />}/>
            <SearchOptions />
          </HStack>
        </Box>
        <Radio.Group m='2' value={checkBoxValue} onChange={nextValue => { setCheckBoxValue(nextValue) }} name='friendsGroup' accessibilityLabel='Selct your friends or search for a friend'>
          <HStack space={4}>
            <Box>
              <Radio value='find-friends' my={1} size="sm">
                Find Friends
              </Radio>
            </Box>
            <Box>
              <Radio value='friends' my={1} size="sm">
                Friends
              </Radio>
            </Box>
            <Box>
              <Radio value='friend-requests' my={1} size="sm">
                Friend Requests
              </Radio>
            </Box>
          </HStack>
        </Radio.Group>
        <ScrollView h={'650'}>
          {users.map(user => {
            return (
              <UserPreview key={user.user_id} id={user.user_id} firstName={user.user_givenname} lastName={user.user_familyname} />
            )
          })}
        </ScrollView>
      </VStack>
    </Box>
  )
}
