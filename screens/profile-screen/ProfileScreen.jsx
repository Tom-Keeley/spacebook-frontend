import React, { useContext } from 'react'
import { VStack, Center } from 'native-base'
import propTypes from 'prop-types'

// Custom imports
import EditDetails from '../../components/edit-details/EditDetails'
import ErrorPopup from '../../components/error-popup/ErrorPopup'
import LoadingSpinner from '../../components/loading-spinner/LoadingSpinner'
import ProfileInformation from '../../components/profile-information/ProfileInformation'
import PersonalDetails from '../../components/personal-details/PersonalDetails'

// ContextAPI
import { SpaceBookContext } from '../../context/SpacebookContext'

export default function ProfileScreen ({ route, navigation }) {
  const { loadingSpinnerVisible, errorAlertVisible, firstName, lastName, email } = useContext(SpaceBookContext)
  const { profileType } = route.params
  console.log(profileType)

  return (
    <Center w={'100%'} h={'100%'}>
      {errorAlertVisible && <ErrorPopup />}
      {loadingSpinnerVisible && <LoadingSpinner />}
      <VStack >
        <ProfileInformation />
        <PersonalDetails />
        <EditDetails navigation={navigation} firstName={firstName} lastName={lastName} email={email} />
      </VStack>
    </Center>
  )
}

ProfileScreen.propTypes = {
  navigation: propTypes.shape({
    navigate: propTypes.func.isRequired
  }).isRequired,
  route: propTypes.shape({
    params: propTypes.object
  })
}
