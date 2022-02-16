import React from 'react'
import { Box, Text, Button, HStack, Flex, Center } from 'native-base'
import propTypes from 'prop-types'

export default function UserPreview ({ id, firstName, lastName }) {
  return (
    <Box bg={'white'} pt={'2'} m={'2'} borderRadius={'5'} shadow={'5'}>
      <HStack>
        <Box w={'100%'}>
          <Box>
            <Text alignSelf={'center'}>{firstName} {lastName}</Text>
          </Box>
          <Box alignItems={'right'}>
            <Center>
              <HStack>
                <Flex direction='row'>
                  <Button variant={'ghost'}>Add Friend</Button>
                  <Button variant={'ghost'}>View Profile</Button>
                </Flex>
              </HStack>
            </Center>
          </Box>
        </Box>
      </HStack>
    </Box>
  )
}

UserPreview.propTypes = {
  id: propTypes.number.isRequired,
  firstName: propTypes.string.isRequired,
  lastName: propTypes.string.isRequired
}
