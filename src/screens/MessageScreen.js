import React, { useContext, useEffect, useState, useLayoutEffect } from 'react';
import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button } from 'react-native-paper'

import { AccountAuthContext } from '../contexts/AccountAuthContext'
import { VoiceAuthContext } from '../contexts/VoiceAuthContext'
import { MessageContext } from '../contexts/MessageContext';

export default function MessageScreen({ navigation }) {
  const { friends, setChatter } = useContext(MessageContext)
  const { user, logout } = useContext(AccountAuthContext)
  const { verified } = useContext(VoiceAuthContext)

  useEffect(() => {
    if (!user)
      Alert.alert("Error", "User not found!", [
        { text: "Go Back To Login", onPress: () => navigation.navigate("Login") }
      ])
  }, [])

  const LastMessage = (props) => {
    const message = props.message
    if (message) {
      if (message.locked && !verified)
        return (
          <>
            <Image
              style={styles.lockMessageIcon}
              source={require('../../assets/lock.jpeg')}
            />
            <Text style = {styles.postTime}> {message.createdAt.toDate().toLocaleString()}</Text>
          </>
        )
      else
        return (
          <>
            <Text style = {styles.messageText}>{message.text}</Text>
            <Text style = {styles.postTime}> {message.createdAt.toDate().toLocaleString()}</Text>
          </>
        )
    }
    return (
      <Text style = {styles.nothingText}>You have not chatted with them yet!</Text>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        data ={friends}
        keyExtractor={friend=>friend.uid}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style = {styles.profile}
            onPress={() => {
              const chatter = {userName: item.displayName,  userID: item.uid}
              setChatter(chatter)
              navigation.navigate('Chat', chatter)
            }}
          >
            <View style={styles.userInfo}>
              <View style={styles.imgWrapper}>
                <Image
                  style={styles.userImg}
                />
              </View>
              <View style={styles.textSection}>
                <Text style = {styles.userName}> {item.displayName}</Text>
                <LastMessage message = {item.lastMessage}/>
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
          onPress={() => navigation.navigate('Setting')}
      > Setting </Button>
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
    fontSize: 20,
    fontWeight: 'bold',
    color: "#0000ff",
  },
  postTime:{
    fontSize: 15,
    color: '#666',
  },
  messageText:{
    fontSize: 14,
    color: '#333333',
  },
  nothingText:{
    fontSize: 14,
    color: '#333333',
    fontStyle: 'italic',
  },
  lockMessageIcon:{
    width: 30,
    height: 30
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
