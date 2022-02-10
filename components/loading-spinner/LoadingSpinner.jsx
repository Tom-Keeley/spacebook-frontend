import React, { useContext } from 'react'
import { HStack, Spinner, Heading, View, Slide, Alert } from 'native-base'

// ContextAPI
import { SpaceBookContext } from '../../context/SpacebookContext'

export default function LoadingSpinner () {
  const { loadingSpinnerVisible } = useContext(SpaceBookContext)
  return (
    <Slide in={loadingSpinnerVisible} placement="top">
      <Alert justifyContent="center" status="info">
        <View>
          <HStack w={'100%'} h={'100%'} space={2} justifyContent="center">
            <Spinner accessibilityLabel="Loading posts" />
            <Heading color="primary.500" fontSize="md">
              Loading
            </Heading>
          </HStack>
        </View>
      </Alert>
    </Slide>
  )
}
