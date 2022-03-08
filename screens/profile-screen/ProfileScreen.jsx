import React, { useContext } from 'react'
import { VStack, Center } from 'native-base'
import propTypes from 'prop-types'

// Custom imports
import EditDetails from '../../components/edit-details/EditDetails'
import ErrorPopup from '../../components/error-popup/ErrorPopup'
import LoadingSpinner from '../../components/loading-spinner/LoadingSpinner'
import ProfileInformation from '../../components/profile-information/ProfileInformation'
import PersonalDetails from '../../components/personal-details/PersonalDetails'
import CreatePost from '../../components/create-post/CreatePost'

// ContextAPI
import { SpaceBookContext } from '../../context/SpacebookContext'

export default function ProfileScreen ({ route, navigation }) {
  const { loadingSpinnerVisible, errorAlertVisible, firstName, lastName, email, profileType } = useContext(SpaceBookContext)
  const { id, buttonLocation, userFirstName, userLastName } = route.params
  console.log(profileType, ' ' + id + ' ' + userFirstName + ' ' + userLastName)

  const renderComponents = () => {
    if (profileType === 'personal') {
      return (
        <>
          <ProfileInformation profileType={profileType} />
          <PersonalDetails />
          <EditDetails navigation={navigation} firstName={firstName} lastName={lastName} email={email} />
        </>
      )
    } else if (profileType === 'userProfile') {
      return (
        <>
          <ProfileInformation profileType={profileType} id={id} buttonLocation={buttonLocation} userFirstName={userFirstName} userLastName={userLastName} />
        </>
      )
    }
  }

  return (
    <Center w={'100%'} h={'100%'}>
      {errorAlertVisible && <ErrorPopup />}
      {loadingSpinnerVisible && <LoadingSpinner />}
      <VStack >
        {renderComponents()}
      </VStack>
      {profileType === 'userProfile' && buttonLocation === 'friend' ? <CreatePost id={id} /> : null}
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
