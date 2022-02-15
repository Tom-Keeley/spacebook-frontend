import React, { useEffect, useState } from 'react'
import { VStack, HStack, Center, Input, Icon, Box, Radio, Stack, Select, CheckIcon } from 'native-base'
import { MaterialIcons } from '@expo/vector-icons'

// Custom imports
import SearchOptions from '../../components/search-options/SearchOptions'

export default function FriendsScreen () {
  const [checkBoxValue, setCheckBoxValue] = useState('friends')

  useEffect(() => {
    console.log(checkBoxValue)
  }, [checkBoxValue])

  return (
    <Box safeArea w={'100%'} h={'100%'}>
      <VStack p='5'>
      <Box bg={'white'} py={'2'} px={'3'} m={'1'} borderRadius={'5'} shadow={'5'}>
        <HStack>
          <Input placeholder="Search People & Places" w={'90%'} borderRadius="4" py="3" px="1" fontSize="14" InputLeftElement={<Icon m="2" ml="3" size="6" color="gray.400" as={<MaterialIcons name="search" />} />}/>
          <SearchOptions />
        </HStack>
      </Box>
        <Radio.Group value={checkBoxValue} onChange={nextValue => { setCheckBoxValue(nextValue) }} name='friendsGroup' accessibilityLabel='Selct your friends or search for a friend'>
          <Center w={'100%'}>
            <HStack p={'2'}>
              <Box px={'2'}>
                <Radio value='friends' my={1}>
                  Friends
                </Radio>
              </Box>
              <Box px={'2'}>
                <Radio value='friend-requests' my={1}>
                  Friend Requests
                </Radio>
              </Box>
            </HStack>
          </Center>
        </Radio.Group>
      </VStack>
    </Box>
  )
}
