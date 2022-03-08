import React, { useContext, useState, useEffect } from 'react'
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
import { getPostsForAUser } from '../../utils/HelperFunctions'

// ContextAPI
import { SpaceBookContext } from '../../context/SpacebookContext'
export default function ProfileScreen ({ route, navigation }) {
  const { token, userId, setErrorAlertProps, loadingSpinnerVisible, errorAlertVisible, firstName, lastName, email, profileType } = useContext(SpaceBookContext)
  const { id, buttonLocation, userFirstName, userLastName } = route.params
  const [posts, setPosts] = useState([])
  console.log(profileType, ' ' + id + ' ' + userFirstName + ' ' + userLastName)

  const getPosts = async () => {
    if (profileType === 'personal') {
      const results = await getPostsForAUser(token, userId, setErrorAlertProps)
      setPosts(results.posts)
    } else if (profileType === 'userProfile') {
      const results = await getPostsForAUser(token, id, setErrorAlertProps)
      setPosts(results.posts)
    }
  }

  useEffect(() => {
    getPosts()
  }, [])

  const renderComponents = () => {
    if (profileType === 'personal') {
      return (
        <>
          <ProfileInformation profileType={profileType} />
          <PersonalDetails />
          <EditDetails navigation={navigation} firstName={firstName} lastName={lastName} email={email} />
          <ListOfPosts id={userId} getPosts={getPosts} posts={posts}/>
        </>
      )
    } else if (profileType === 'userProfile') {
      return (
        <>
          <ProfileInformation profileType={profileType} id={id} buttonLocation={buttonLocation} userFirstName={userFirstName} userLastName={userLastName} />
          {buttonLocation === 'friend' ? <ListOfPosts id={id} getPosts={getPosts} posts={posts} /> : null}
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
      {profileType === 'userProfile' && buttonLocation === 'friend' ? <CreatePost id={id} getPosts={getPosts} /> : null}
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
