import React, { useState, useContext, useEffect } from 'react'
import { viewASinglePost } from '../../utils/HelperFunctions'
import { SpaceBookContext } from '../../context/SpacebookContext'
import { Button, Modal, Text } from 'native-base'
import propTypes from 'prop-types'

export default function ViewPost ({ postData, viewPostVisible, setViewPostVisible }) {
  const { token, setErrorAlertProps } = useContext(SpaceBookContext)
  const [postAuthor, setPostAuthor] = useState('')
  const [postText, setPostText] = useState('')

  useEffect(async () => {
    const response = await viewASinglePost(token, postData.id, postData.postId, setErrorAlertProps)
    if (response.success === true) {
      setPostAuthor(response.post.author)
      setPostText(response.post.text)
    }
  }, [])

  return (
    <>
      <Modal isOpen={viewPostVisible} onClose={() => setViewPostVisible(false)}>
        <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>{`${postAuthor.first_name} ${postAuthor.last_name}s Post`}</Modal.Header>
          <Modal.Body>
            <Text>{postText}</Text>
          </Modal.Body>
          <Modal.Footer>
            <Button.Group space={2}>
              <Button variant="ghost" colorScheme="blueGray" onPress={() => {
                setViewPostVisible(false)
              }}>
                Close
              </Button>
            </Button.Group>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </>
  )
}

ViewPost.propTypes = {
  postData: propTypes.object.isRequired,
  viewPostVisible: propTypes.bool.isRequired,
  setViewPostVisible: propTypes.func.isRequired
}
