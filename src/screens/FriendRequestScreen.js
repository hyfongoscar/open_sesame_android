import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import { Alert, StyleSheet, View, Text, TouchableOpacity, FlatList } from 'react-native'
import { Button, Title, TextInput } from 'react-native-paper';
import firestore, {arrayUnion} from '@react-native-firebase/firestore';

import { AccountAuthContext } from '../contexts/AccountAuthContext'



export default function FriendRequestScreen({ navigation }){
    const [email, setEmail] = useState('')
    const {user} = useContext(AccountAuthContext);
    const [info, setInfo] = useState();

    useLayoutEffect(() => {
        const subscriber = firestore()
          .collection('friendRequest')
          .where('rid','==',1)
          .where('confirmed','==',false)  
         // .orderBy('createdAt','desc')
          .onSnapshot(querySnapshot => {
            setInfo(
              querySnapshot.docs.map(doc => ({
                s_email: doc.data().s_email,
                r_email: doc.data().r_email,
                rid: doc.data().rid,
                sid: doc.data().sid,
                createdAt: doc.data().createdAt,
              }))
            );
          });
         return subscriber;
    })

    const getID = (email) =>{
        return 2;
    }

    const sendFriendRequest = async () => {
        const rEmail = await firestore()
        .collection('username')
        .doc(email) 
        .get();
        if(rEmail.exists)
        {
            firestore().collection('friendRequest').doc().set({
                s_email: "hello@gmail.com",
                r_email: email,
                sid: 1,
                rid: getID(email),
                sender_id_pair: [1, getID(email)],
                createdAt: new Date(),
                confirmed: false,
            });
        }
        else 
            Alert.alert("Email Not Registered")
    }

    const acceptFriendRequest = async (sid, rid, s_email, r_email) =>{
        const q = await firestore()
          .collection('friendRequest')
          .where('sid','==',sid)
          .where('rid','==',1)
           .get();
        q.docs[0].ref.update({confirmed: true});

        firestore().collection('friendList').doc().set({
            email_pair: [r_email, s_email], 
            friend_id_pair: [sid, rid],
        })
      
    }
    
    return (
        <View>
            <TextInput
                label="Enter Email Address"
                numberOfLines={1}
                onChangeText={(email) => setEmail(email)}
            />
            <Button
                onPress={ () => {sendFriendRequest()}}
            >Send Friend request</Button>
      <FlatList
        data ={info}
        keyExtractor={item=>item.sid}
        renderItem={({item}) => (
          <TouchableOpacity 
            style = {styles.profile}
          >
            <View style={styles.userInfo}>
              <View style={styles.textSection}>
                <Text style = {styles.userName}> {item.s_email}</Text>
                <Button onPress={() => {acceptFriendRequest(item.sid, item.rid, item.s_email, item.r_email)}}>Accepted</Button>
              </View>
            </View>   
          </TouchableOpacity>
        )}
      >
      </FlatList>
      </View>
    );
}

const styles = StyleSheet.create({
    button: {
      marginTop: 10,
    },
    container: {
      flex: 1, 
      paddingLeft: 20,
      paddingRight: 20,
      alignItems: 'center', 
      justifyContent: 'center'
    },
    profile:{
      width:'100%',
    },
    textSection:{
      flexDirection: 'column',
      justifyContent: 'center',
      padding: 15,
      paddingLeft: 0,
      marginLeft: 10,
      width: 399
    },
    userInfoText:{
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 5,
    },
    userName:{
      fontSize: 14,
      fontWeight: 'bold',
    },
    postTime:{
      fontSize: 12,
      color: '#666',
    },
    messageText:{
      fontSize: 14,
      color: '#333333',
    },
    imgWrapper:{
      paddingTop: 15,
      paddingBottom: 15,
    },
    userImg:{
      width: 50,
      height: 50,
      borderRadius: 25,
    },
    userInfo:{
      flexDirection:'column',
      justifyContent:'space-between',
    },
  });
