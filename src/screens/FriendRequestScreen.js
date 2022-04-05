import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import { Alert, StyleSheet, View, Text, TouchableOpacity, FlatList } from 'react-native'
import { Button, Title, TextInput } from 'react-native-paper';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import { AccountAuthContext } from '../contexts/AccountAuthContext'
import { ThemeContext } from '../contexts/ThemeContext'

export default function FriendRequestScreen({ navigation }){
  const { user } = useContext(AccountAuthContext)
  const { themeColor } = useContext(ThemeContext)

  const themeStyle = {
    color: themeColor
  }

  const [email, setEmail] = useState('')
  const [requestList, setRequestList] = useState();

  useLayoutEffect(() => {
    const subscriber = firestore()
      .collection('friendRequest')
      .where('r_email', '==', user.email)
      .where('confirmed','==',false)  
      // .orderBy('createdAt','desc')
      .onSnapshot(querySnapshot => {
        setRequestList(
          querySnapshot.docs.map(doc => ({
            s_email: doc.data().s_email,
            r_email: doc.data().r_email,
            createdAt: doc.data().createdAt,
          }))
        );
      });
      return subscriber;
  })

  const sendFriendRequest = async () => {
    var emailExists
    await auth().fetchSignInMethodsForEmail(email).then((results) => {
      emailExists = (results.length > 0)
    })

    const friendQuery = await firestore()
      .collection('profiles')
      .doc(user.email)
      .collection("friends")
      .doc(email)
      .get()

    const sentQuery = await firestore()
      .collection('friendRequest')
      .where('r_email', '==', email)
      .where('confirmed','==',false)  
      .get()

    if (email == user.email) 
      Alert.alert("", "You cannot add yourself as friend.")
    else if (friendQuery.data()) 
      Alert.alert("", "You have already added this user.")
    else if (sentQuery.docs.length > 0) 
      Alert.alert("", "You have already sent a request to this user. Please wait for them to accept. :)")
    else if (emailExists) {
      firestore().collection('friendRequest').doc().set({
        s_email: user.email,
        r_email: email,
        createdAt: new Date(),
        confirmed: false,
      })
      Alert.alert("Request sent!", "Please wait for them to accept your request")
    }
    else 
      Alert.alert("We cannot found this user", "Please check their email again")
  }

  const acceptFriendRequest = async (s_email, r_email) =>{
    const query = await firestore()
      .collection('friendRequest')
      .where('s_email','==',s_email)
      .where('r_email','==',r_email)
      .get()
    await query.docs[0].ref.update({confirmed: true})
    
    await firestore().collection('profiles').doc(s_email).collection("friends").doc(r_email)
      .set({
        lastMessage: null
      })
    await firestore().collection('profiles').doc(r_email).collection("friends").doc(s_email)
      .set({
        lastMessage: null
      })
    Alert.alert("Success", s_email + " is now your friend!")
  }
  
  return (
    <View>
      <TextInput
        label="Your friend's email"
        numberOfLines={1}
        onChangeText={setEmail}
      />
      <Button
        onPress={ () => {sendFriendRequest()}}
      >Send Friend request</Button>

      <Text style = {StyleSheet.flatten([styles.label, themeStyle])}>{"\n"}Pending requests{"\n"}</Text>
      <FlatList
        data ={requestList}
        keyExtractor={request => request.s_email}
        renderItem={({item}) => (
          <TouchableOpacity 
            style = {styles.profile}
          >
            <View style={styles.userInfo}>
              <View style={styles.textSection}>
                <Text style = {styles.userName}> {item.s_email}</Text>
                <Button onPress={() => {acceptFriendRequest(item.s_email, item.r_email)}}>Accept</Button>
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
  label: {
    fontSize: 17
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
