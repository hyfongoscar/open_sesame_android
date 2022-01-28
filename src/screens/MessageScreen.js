import React, { useContext, useEffect, useState, useLayoutEffect } from 'react';
import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button } from 'react-native-paper'
import firestore, {arrayUnion} from '@react-native-firebase/firestore';
import Moment from 'moment';

import { AccountAuthContext } from '../contexts/AccountAuthContext'
import { MessageContext } from '../contexts/MessageContext';



export default function MessageScreen({ navigation }) {
  const { fetchLastMessage, lastMessage } = useContext(MessageContext);
  const { user, logout } = useContext(AccountAuthContext);
  const [profile, setProfile] = useState();
  
  useLayoutEffect(() => {    
    const subscriber = firestore()
    .collection('friendList')
    .where('friend_email_pair', 'array-contains', user.email)
   // .orderBy('createdAt','desc')
    .onSnapshot(querySnapshot => {
    setProfile(
        querySnapshot.docs.map(doc => ({
          // rid: (doc.data().friend_id_pair[0] == 1)?doc.data().friend_id_pair[1]:doc.data().friend_id_pair[0],
          worthless: fetchLastMessage(doc.data().friend_email_pair[0], doc.data().friend_email_pair[1]),
          r_email:  (doc.data().friend_email_pair[0] == user.email) ? doc.data().friend_email_pair[1] : doc.data().friend_email_pair[0],
          // lastMessageText: lastMessage[0].text,
          // lastMessageTime: lastMessage[0].createdAt,
        }))
      );
    });
    
    return subscriber;
  })

  const getDisplayName = async (email) => {
    const query = await firestore()
      .collection('profiles')
      .doc(email)
      .get()
    return query._data.displayName || ""
  }

  const getId = async (email) => {
    const data = await firestore()
      .collection('profiles')
      .doc(email)
      .get()._data
    return data.uid || ""
  }
  
  useEffect(() => {
    if (!user)
      Alert.alert("Error", "User not found!", [
        { text: "Go Back To Login", onPress: () => navigation.navigate("Login") }
      ])
  }, [])

  return (
    <View style={styles.container}>
      <FlatList
        data ={profile}
        keyExtractor={item=>item.rid}
        renderItem={({item}) => (
          <TouchableOpacity 
            style = {styles.profile}
            onPress={() => navigation.navigate('Chat', {userName: item.r_email,  userID: item.rid})}
          >
            <View style={styles.userInfo}>
              <View style={styles.imgWrapper}>
                <Image
                  style={styles.userImg}
                />
              </View>
              <View style={styles.textSection}>
                <Text style = {styles.userName}> {item.r_email}</Text>
                <Text style = {styles.messageText}> {item.lastMessageText}</Text>
                <Text style = {styles.postTime}> {Moment(item.lastMessageTime).format('D MMM H:mm')}</Text>
              </View>
            </View>   
          </TouchableOpacity>
        )}
      ></FlatList>
       <Button
          mode="contained"
          style={styles.button}
          contentStyle={styles.buttonContainer}
          labelStyle={styles.navButtonText}
          onPress={() => navigation.navigate('ChangeProfilePic')}
      >Change Profile Picture </Button>
      <Button
          mode="contained"
          style={styles.button}
          contentStyle={styles.buttonContainer}
          labelStyle={styles.navButtonText}
          onPress={() => navigation.navigate('FriendRequest')}
      >Add Friend </Button>
      <Button
          mode="contained"
          style={styles.button}
          contentStyle={styles.buttonContainer}
          labelStyle={styles.navButtonText}
          onPress={() => navigation.navigate('ChangeUsername')}
      > Change username </Button>

      <Button
          mode="contained"
          style={styles.button}
          contentStyle={styles.buttonContainer}
          labelStyle={styles.navButtonText}
          onPress={() => navigation.navigate('VoiceEnroll')}
      > Enroll Voiceprint </Button>
          
      <Button
          mode="contained"
            style={styles.button}
            contentStyle={styles.buttonContainer}
            labelStyle={styles.navButtonText}
          onPress={async () => {
              logout();
          }}
      >Log out</Button>
    </View>
  );
};


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
