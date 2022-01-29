import React, { useCallback, useLayoutEffect, useContext, useState, createContext } from 'react'
import { Alert, Image, PermissionsAndroid, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

import { AccountAuthContext } from '../contexts/AccountAuthContext'

export const MessageContext = createContext();

const MessageContextProvider = ({ children }) => {
    const [messages, setMessages] = useState([""]);
    const [lastMessage, setLastMessage] = useState([]);
    const { user } = useContext(AccountAuthContext);
    const [rid, setRID] = useState(0);


    const fetchRID = async (r_email) =>{
        const doc = await firestore()
        .collection('profiles')
        .doc(r_email)
        .get()
        setRID(doc.data().uid)
        
    }    
    const fetchLastMessage = async (sid, rid) => {
        firestore()
        .collection('chats')
        .where('sender_id_pair', 'in',[[sid, rid], [rid, sid]])
        .orderBy('createdAt','desc')
        .limit(1)
        .onSnapshot(querySnapshot => {
            setLastMessage(
            querySnapshot.docs.map(doc => ({
                text:  doc.data().text,
                createdAt: doc.data().createdAt.toDate(),
            }))
            );
        });
    }
   
    useLayoutEffect(() => {    
        const subscriber = firestore()
        .collection('chats')
        .where('sender_id_pair', 'in',[[rid, 1], [1, rid]])
        .orderBy('createdAt','desc')
        .onSnapshot(querySnapshot => {
        setMessages(
            querySnapshot.docs.map(doc => ({
            _id: doc.data()._id,
            sender_id: doc.data().sender_id,
            _rid: doc.data()._rid,
            createdAt: doc.data().createdAt.toDate(),
            text: doc.data().text,
            user: doc.data().user,
            locked: doc.data().locked,
            file_url: doc.data().file_url,
            is_file : doc.data().is_file, 
            }))
        );
        });
        return subscriber;
      })
    return (

    <MessageContext.Provider
            value={{
             messages,fetchRID, setRID, rid,
             fetchLastMessage,lastMessage
            }}
        >
          {children}
        </MessageContext.Provider>
    );
  };
  
  export default MessageContextProvider