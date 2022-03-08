import React, { useEffect, useLayoutEffect, useContext, useState, createContext } from 'react'
import firestore from '@react-native-firebase/firestore';

import { AccountAuthContext } from '../contexts/AccountAuthContext'
import { LoadingContext } from '../contexts/LoadingContext'

export const MessageContext = createContext();

const MessageContextProvider = ({ children }) => {
  const [messages, setMessages] = useState([])
  const [friends, setFriends] = useState([])
  const [chatter, setChatter] = useState(null)

  const { user } = useContext(AccountAuthContext)
  const { setLoading } = useContext(LoadingContext)



  const fetchUID = async (email) =>{
    const doc = await firestore()
      .collection('profiles')
      .doc(email)
      .get()
    return doc.data().uid
  }

  const fetchDisplayName = async (email) => {
    const doc = await firestore()
      .collection('profiles')
      .doc(email)
      .get()
    return doc.data().displayName
  }

  const fetchProfilePic = async (email) => {
    const doc = await firestore()  
      .collection('profiles')
      .doc(email)
      .get()
    return doc.data().photoURL
  }


  // friend lists and their last messages
  useEffect(() => {
    if (user) {
      const subscriber = firestore()
        .collection('profiles').doc(user.email)
        .collection('friends')
        .onSnapshot(async querySnapshot => {
          // setLoading(true)
          const tempFriends = querySnapshot.docs.map(async doc => {
            const friend_email = doc.id
            const friend_uid = await fetchUID(friend_email)
            const friend_name = await fetchDisplayName(friend_email)
            const friend_profilePic = await fetchProfilePic(friend_email)
            return {
              uid: friend_uid,
              email: friend_email,
              displayName: friend_name || "",
              profilePic : friend_profilePic,
              lastMessage: doc.data().lastMessage
            }
          })
          setFriends(await Promise.all(tempFriends))
          // setLoading(false)
        })
      return subscriber
    }
  }, [user])

  // each chat messages when clicked on a user
  useEffect(() => {
    if (chatter) {
      firestore()
        .collection('chats')
        .where('sender_id_pair', 'in',[[chatter.uid, user.uid], [user.uid, chatter.uid]])
        .orderBy('createdAt','desc')
        .onSnapshot(querySnapshot => {
          if (querySnapshot.size)
            setMessages(
              querySnapshot.docs.map(doc => ({
                _id: doc.data()._id,
                sender_id: doc.data().sender_id,
                _rid: doc.data()._rid,
                createdAt: doc.data().createdAt.toDate(),
                text: doc.data().text,
                user: doc.data().s_user,
                locked: doc.data().locked,
                file_url: doc.data().file_url,
                is_file : doc.data().is_file, 
              }))
            )
          else
            setMessages([])
        });
      }
  }, [chatter, setChatter])

  return (
    <MessageContext.Provider
      value={{
        friends, messages, chatter, 
        setChatter, setMessages,
      }}>
      {children}
    </MessageContext.Provider>
  )
}
  
export default MessageContextProvider
