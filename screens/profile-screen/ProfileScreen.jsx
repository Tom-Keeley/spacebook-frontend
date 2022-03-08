import React, { useContext } from 'react'
import { VStack, Center, ScrollView } from 'native-base'
import propTypes from 'prop-types'

// Custom imports
import EditDetails from '../../components/edit-details/EditDetails'
import ErrorPopup from '../../components/error-popup/ErrorPopup'
import LoadingSpinner from '../../components/loading-spinner/LoadingSpinner'
import ProfileInformation from '../../components/profile-information/ProfileInformation'
import PersonalDetails from '../../components/personal-details/PersonalDetails'
import CreatePost from '../../components/create-post/CreatePost'
import ListOfPosts from '../../components/list-of-posts/ListOfPosts'

// ContextAPI
import { SpaceBookContext } from '../../context/SpacebookContext'

export default function ProfileScreen ({ route, navigation }) {
  const { loadingSpinnerVisible, errorAlertVisible, firstName, lastName, email, profileType, userId } = useContext(SpaceBookContext)
  const { id, buttonLocation, userFirstName, userLastName } = route.params
  console.log(profileType, ' ' + id + ' ' + userFirstName + ' ' + userLastName)

  const renderComponents = () => {
    if (profileType === 'personal') {
      return (
        <>
          <ProfileInformation profileType={profileType} />
          <PersonalDetails />
          <EditDetails navigation={navigation} firstName={firstName} lastName={lastName} email={email} />
          <ListOfPosts id={userId} />
        </>
      )
    } else if (profileType === 'userProfile') {
      return (
        <>
          <ProfileInformation profileType={profileType} id={id} buttonLocation={buttonLocation} userFirstName={userFirstName} userLastName={userLastName} />
          {buttonLocation === 'friend' ? <ListOfPosts id={id} /> : null}
        </>
      )
    }
  }

  return (
    <Center w={'100%'} h={'100%'}>
      <ScrollView h="500">
        {errorAlertVisible && <ErrorPopup />}
        {loadingSpinnerVisible && <LoadingSpinner />}
        <VStack >
          {renderComponents()}
        </VStack>
      </ScrollView>
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
