import React, { useContext, useEffect, useState, useLayoutEffect } from 'react';
import { Alert, Button, Dimensions, FlatList, Image, ImageBackground, StyleSheet, Text, Platform, Pressable, View } from 'react-native';
import { Title, TextInput } from 'react-native-paper';
import NetInfo from "@react-native-community/netinfo";

import { AccountAuthContext } from '../contexts/AccountAuthContext'
import { VoiceAuthContext } from '../contexts/VoiceAuthContext'
import { MessageContext } from '../contexts/MessageContext';
import { SettingContext } from '../contexts/SettingContext'

import { Fontisto } from '../components/Icons';

export default function MessageScreen({ navigation }) {
  const { friends, setChatter } = useContext(MessageContext)
  const { user } = useContext(AccountAuthContext)
  const { verified } = useContext(VoiceAuthContext)
  const { theme, getSecondaryColor, changePinUser, clearPinUser } = useContext(SettingContext)
  const [search, setSearch] = useState("")

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

  const LastMessage = ({ message }) => {
    if (message && Object.keys(message).length != 0) {
      var date = message.createdAt.toDate()
      var months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ]
      const hour = (date.getHours() < 10 ? '0' : '') + date.getHours() 
      const minute = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes() 
      date = months[date.getMonth()] + " " + date.getDay() + " " + hour + ":" + minute
      if (message.locked && !verified && message._rid == user.uid)
        return (
          <View style={styles.messageContainer}>
            <Fontisto name="locked" size={30} color="black" />
            <Text style = {styles.postTime(theme, getSecondaryColor)}>{date}</Text>
          </View>
        )
      else
        return (
          <View style={styles.messageContainer}>
            <Text style = {styles.messageText(theme)}>{message.text}</Text>
            <Text style = {styles.postTime(theme, getSecondaryColor)}>{date}</Text>
          </View>
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
        { (theme.pin) ? (
            <Pressable
              onPress={() => {
                setChatter(theme.pin)
                navigation.navigate('Chat', { chatter: theme.pin })
              }}
              onLongPress={() => clearPinUser()}
            >
              <View style={styles.pinnedFriend}>
                <View style={styles.friendInfo(theme)}>
                  <Image
                    style={styles.userImg(theme)}
                    source={{
                      uri: theme.pin.photoURL,
                    }}
                  />
                  <Text style = {styles.userName(theme)}> {theme.pin.displayName} </Text>
                </View>
                <LastMessage message={theme.pin.lastMessage}/>
              </View>
            </Pressable>
          ) : (<></>)
        }
        <TextInput
            label="Search Here"
            value={search}
            onChangeText={(search) => setSearch(search)}
        />
        <FlatList
          data ={friends}
          keyExtractor={friend=>friend.uid}
          renderItem={({ item, index }) => {
            if (search === ""){
              return (
                <Pressable
                  onPress={() => {
                    setChatter(item)
                    navigation.navigate('Chat', { chatter: item })
                  }}
                  onLongPress={() => {
                    changePinUser(item)
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
                    <LastMessage message={item.lastMessage}/>
                  </View>
                </Pressable>
              )
            }
            if (item.displayName.toUpperCase().includes(search.toUpperCase().trim().replace(/\s/g, ""))){
              return (
                <Pressable
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
                          uri: item.profilePic,
                        }}
                      />
                      <Text style = {styles.userName(theme)}> {item.displayName} </Text>
                    </View>
                    <LastMessage message = {item.lastMessage}/>
                  </View>
                </Pressable>
              )
            }
          }}
        ></FlatList>
      </ImageBackground>
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  button: {
    marginTop: 10,
  },
  container: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
  },
  friend: (last) => ({
    paddingTop: 20,
    paddingBottom: 30,
    paddingLeft: 15,
    paddingRight: 15,
    borderBottomWidth: last ? 0 : 1,
    borderColor: "lightgrey",
    width: width - 40,
  }),
  pinnedFriend: {
    marginTop: 10,
    marginBottom: 10,
    paddingTop: 20,
    paddingBottom: 40,
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 2,
    borderColor: "lightgrey",
    width: width - 40,
  },
  friendInfo: (theme) => ({
    flexDirection:'row',
    flexWrap:'wrap',
    paddingBottom: theme.font / 2
  }),
  messageContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap:'wrap',
    justifyContent: "space-between"
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
    textAlign: 'right'
  }),
});