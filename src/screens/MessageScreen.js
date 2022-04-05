import React, { useContext, useEffect, useState, useLayoutEffect } from 'react';
import { Alert, Button, Dimensions, FlatList, Image, ImageBackground, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import NetInfo from "@react-native-community/netinfo";

import { AccountAuthContext } from '../contexts/AccountAuthContext'
import { VoiceAuthContext } from '../contexts/VoiceAuthContext'
import { MessageContext } from '../contexts/MessageContext';
import { ThemeContext } from '../contexts/ThemeContext'

export default function MessageScreen({ navigation }) {
  const { friends, setChatter } = useContext(MessageContext)
  const { user } = useContext(AccountAuthContext)
  const { verified } = useContext(VoiceAuthContext)
  const { theme, getSecondaryColor } = useContext(ThemeContext)

  useEffect(() => {
    if (!user)
      Alert.alert("Error", "User not found!", [
        { text: "Go Back To Login", onPress: () => navigation.navigate("Login") }
      ])
    
    NetInfo.fetch().then(networkState => {
      if (!networkState.isConnected)
        Alert.alert("You are now offline.", "Please check your network connection.")
    });
  }, [])

  const LastMessage = (props) => {
    const message = props.message
    if (message) {
      if (message.locked && !verified && message._rid == user.uid)
        return (
          <>
            <Image
              style={styles.lockMessageIcon}
              source={require('../../assets/lock.png')}
            />
            <Text style = {styles.postTime(theme, getSecondaryColor)}> {message.createdAt.toDate().toLocaleString().slice(4,16)}</Text>
          </>
        )
      else
        return (
          <>
            <Text style = {styles.messageText(theme)}>{message.text}</Text>
            <Text style = {styles.postTime(theme, getSecondaryColor)}> {message.createdAt.toDate().toLocaleString().slice(4,16)}</Text>
          </>
        )
    }
    return (
      <Text style = {styles.nothingText(theme)}>You have not chatted with them yet!</Text>
    )
  }

  return (
    <View style={styles.container}>
        <ImageBackground 
          source={{ uri: theme.background }}
          resizeMode="cover"
          style={styles.image}
        >
            <FlatList
              data ={friends}
              keyExtractor={friend=>friend.uid}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style = {styles.profile}
                  onPress={() => {
                      setChatter(item)
                      navigation.navigate('Chat', { chatter: item })
                  }}
                >
                  <View style={styles.friend(index == friends.length - 1)}>
                    <View style={styles.friendInfo(theme)}>
                      <Image
                          style={styles.userImg(theme)}
                          source={{
                            uri: item.photoURL,
                          }}
                        />
                      <Text style = {styles.userName(theme)}> {item.displayName} </Text>
                    </View>
                    <LastMessage message = {item.lastMessage}/>
                  </View>
                </TouchableOpacity>
              )}
          ></FlatList>
        </ImageBackground>
    </View>
  );
};

const { width, height } = Dimensions.get('screen');

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
  friend: (last) => ({
    flexDirection:'column',
    justifyContent:'space-between',
    paddingTop: 30,
    paddingBottom: 30,
    paddingLeft: 15,
    paddingRight: 15,
    borderBottomWidth: last ? 0 : 1,
    borderColor: "lightgrey",
    width
  }),
  friendInfo: (theme) => ({
    flexDirection:'row',
    flexWrap:'wrap',
    paddingBottom: theme.font / 2
  }),
  image: {
    flex: 1,
    justifyContent: "center"
  },
  lockMessageIcon:{
    width: 30,
    height: 30,
  },
  messageText: (theme) => ({
    fontSize: (theme.font * 0.8),
    color: "black",
  }),
  nothingText: (theme) => ({
    fontSize: (theme.font * 0.7),
    color: '#333333',
    fontStyle: 'italic',
  }),
  userImg: (theme) => ({
    width: theme.font * 2,
    height: theme.font * 2,
    borderRadius: theme.font,
  }),
  userInfoText:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  userName: (theme) => ({
    fontSize: theme.font,
    fontWeight: 'bold',
    color: theme.color,
    textAlignVertical: "center",
    paddingLeft: theme.font / 3
  }),
  postTime: (theme, getSecondaryColor) => ({
    fontSize: (theme.font * 0.75),
    color: getSecondaryColor(theme.color),
  }),
  profile:{
    width:'100%',
  },
});
