import React, { useContext, useEffect, useState, useLayoutEffect } from 'react';
import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View, ImageBackground } from 'react-native';

import { AccountAuthContext } from '../contexts/AccountAuthContext'
import { VoiceAuthContext } from '../contexts/VoiceAuthContext'
import { MessageContext } from '../contexts/MessageContext';
import { ThemeContext } from '../contexts/ThemeContext'

export default function MessageScreen({ navigation }) {
  const { friends, setChatter } = useContext(MessageContext)
  const { user, logout } = useContext(AccountAuthContext)
  const { verified } = useContext(VoiceAuthContext)
  const { theme } = useContext(ThemeContext)
  const { recipient, setRecipient } = useContext(MessageContext)
  const { recipientIcon, setRecipientIcon } = useContext(MessageContext)
  const image = { uri: theme.background };

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
            <Text style = {styles.postTime(theme)}> {message.createdAt.toDate().toLocaleString()}</Text>
          </>
        )
      else
        return (
          <>
            <Text style = {styles.messageText(theme)}>{message.text}</Text>
            <Text style = {styles.postTime(theme)}> {message.createdAt.toDate().toLocaleString()}</Text>
          </>
        )
    }
    return (
      <Text style = {styles.nothingText(theme)}>You have not chatted with them yet!</Text>
    )
  }

  return (
    <View style={styles.container}>
        <ImageBackground source={image} resizeMode="cover" style={styles.image}>
            <FlatList
                data ={friends}
                keyExtractor={friend=>friend.uid}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style = {styles.profile}
                        onPress={() => {
                            const chatter = {userName: item.displayName,  userID: item.uid}
                            setChatter(chatter)
                            setRecipient(item.displayName)
                            setRecipientIcon(item.profilePic)
                            navigation.navigate('Chat', chatter)
                        }}
                    >
                        <View style={styles.userInfo}>
                            <View style={styles.imgWrapper}>
                            </View>
                            <View style={styles.textSection}>
                              <View style={{flexDirection:'row', flexWrap:'wrap'}}>
                                <Image
                                    style={styles.userImg}
                                    source={{
                                      uri: item.profilePic,
                                    }}
                                  />
                                <Text style = {styles.userName(theme)}> {item.displayName} </Text>
                              </View>
                              <LastMessage message = {item.lastMessage}/>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
            ></FlatList>
        </ImageBackground>
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
  userName: (theme) => ({
    fontSize: theme.font,
    fontWeight: 'bold',
    color: theme.color,
  }),
  postTime: (theme) => ({
    fontSize: (theme.font * 0.75),
    color: theme.color,
  }),
  messageText: (theme) => ({
    fontSize: (theme.font * 0.8),
    color: "black",
    padding: 5,
  }),
  nothingText: (theme) => ({
    fontSize: (theme.font * 0.7),
    color: '#333333',
    fontStyle: 'italic',
  }),
  lockMessageIcon:{
    width: 30,
    height: 30,
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
  image: {
    flex: 1,
    justifyContent: "center"
  },
});
