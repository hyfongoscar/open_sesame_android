import React, { useCallback, useEffect, useContext, useState } from 'react'
import { Alert, Image, PermissionsAndroid, StyleSheet, Text, Pressable, View, ImageBackground } from 'react-native'
import { Checkbox } from 'react-native-paper'
import NetInfo from "@react-native-community/netinfo";

import { GiftedChat, Actions, Bubble, Message, MessageText, Send, Time } from 'react-native-gifted-chat'
import DocumentPicker  from 'react-native-document-picker';
import FileViewer from "react-native-file-viewer";
import RNFetchBlob from 'rn-fetch-blob';
import uuid from 'react-native-uuid';
import { Fontisto } from '../components/Icons';

import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

var RNFS = require('react-native-fs');
var locked = false

import { AccountAuthContext } from '../contexts/AccountAuthContext'
import { VoiceAuthContext } from '../contexts/VoiceAuthContext'
import { MessageContext } from '../contexts/MessageContext';
import { SettingContext } from '../contexts/SettingContext'


export default function ChatScreen({ navigation, route }) {
  const [checked, setChecked] = useState(false)

  const { verified } = useContext(VoiceAuthContext)
  const { user } = useContext(AccountAuthContext)
  const { messages, setMessages } = useContext(MessageContext)
  const { theme, getSecondaryColor } = useContext(SettingContext)

  const { chatter } = route.params

  const image = { uri: theme.background };

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

  const onSend = useCallback(async (messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
    const { _id, createdAt, text } = messages[0]

    const messageObj = {
      _id,
      _rid: chatter.uid,
      createdAt,
      locked,
      sender_id: user.uid,
      sender_id_pair: [user.uid, chatter.uid],
      text,
      user: { 
        _id: user.uid,
        name: user.displayName,
        avatar: user.photoURL
      },
      is_file: false,
    }

    firestore().collection('chats').doc(_id).set(messageObj)
    
    await firestore().collection('profiles').doc(user.email).collection("friends").doc(chatter.email)
      .update({
        'lastMessage': messageObj
      })
    await firestore().collection('profiles').doc(chatter.email).collection("friends").doc(user.email)
      .update({
        'lastMessage': messageObj
      })
  }, [])

  const uploadFileToFirebase = async (result, file) => {
    const uploadTask = storage().ref(`allFiles/${file.name}`).putString(result, 'base64',{contentType: file.type});
    uploadTask.on('state_changed', 
      (snapshot) => {
      // Observe state change events such as progress, pause, and resume
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      },
      (error) => {
        // Handle unsuccessful uploads
      }, 
      () => {
        // Handle successful uploads on complete
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL){
          saveFileToDatabase(downloadURL, file)
        })
      }
    )
  }

  const saveFileToDatabase = async (downloadURL, file) => {
    const messageObj = {
      _id: uuid.v4(),
      _rid: chatter.uid,
      createdAt: new Date(),
      file_url: downloadURL,
      is_file: true,
      locked,
      sender_id: user.uid,
      sender_id_pair: [user.uid, chatter.uid],
      text: file.name,
      user: { 
        _id: chatter.uid,
        name: chatter.displayName,
        avatar: chatter.photoURL
      },
    }

    firestore().collection('chats').doc(randomID).set(messageObj)

    await firestore().collection('profiles').doc(user.email).collection("friends").doc(chatter.email)
      .update({
        lastMessage: messageObj
      })
    await firestore().collection('profiles').doc(chatter.email).collection("friends").doc(user.email)
      .update({
        lastMessage: messageObj
      })
  }
  
  const saveFileToDevice = (downloadURL, path) => {
    const { config } = RNFetchBlob
    let options = {
      fileCache: true,
      addAndroidDownloads : {
        useDownloadManager : true, // setting it to true will use the device's native download manager and notification bar.
        notification : false,
        path, // this is the path where your downloaded file will live in
        description : 'Downloading file'
      }
    }
    config(options).fetch('GET', downloadURL)
    .then((res) => {
      console.log(res)
    })
    .catch((err) => {
      console.log(err)
    })
  }

  const filePressed = async (currentMessage) => {
    const { fs } = RNFetchBlob
    let downloadDir = fs.dirs.DownloadDir 
    const path = downloadDir + "/" + currentMessage.text
    const exists = await RNFS.exists(path)
    if (exists) {
      Alert.alert("", "File exists already, do you wish to download again or open the file?", [
        { text: "Open", onPress: () => FileViewer.open(path) },
        { text: "Download", onPress: () => saveFileToDevice(currentMessage.file_url, path)}
      ])
    }
    else {
      saveFileToDevice(currentMessage.file_url, path)
    }
  }

  // Custom Action button at the bottom left
  const renderActions = (props) => {
    return(
      <Actions
        {...props}
        options={{
          ['Document']: async (props) => {
            try {
              const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
              })
              const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                {
                  title: 'ReactNativeCode Read External Storage Permission',
                  message: 'ReactNativeCode App needs access to your storage ',
                },
              );
              if (granted === PermissionsAndroid.RESULTS.GRANTED){
                const result = await RNFetchBlob.fs.readFile(res[0].uri, 'base64')
               // console.log(result)
                uploadFileToFirebase(result, res[0])
              }
            } catch(e){
              if(DocumentPicker.isCancel(e))
                console.log("User cancelled!")
              else 
                console.log(e);
            }
          },
          Cancel: (props) => {console.log("Cancel")}
        }}
        icon={() => (
          <Image
              style={styles.smallerLogo}
              source={require('../../assets/file.png')}
            />

        )}
        onSend={args => console.log(args)}
      />
    )
  }

  // Custom message bubble
  // Overrides MessageText for locked messages
  // Overrides View for files
  const renderBubble = (props) => {
    const { currentMessage } = props;
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: theme.color,
          },
          left: {
            backgroundColor: getSecondaryColor(theme.color),
          }
        }}
        renderMessageText={() => {
          if (currentMessage._rid == user.uid && currentMessage.locked && !verified) {
            return (
              <Pressable 
                style={{ padding: 10}}
                onPress={ () => {
                  Alert.alert("Locked!", "Unlock this message with your voiceprint", [
                    { text: "Unlock", onPress: () => navigation.navigate("VoiceRecording", {option: "verify"}) },
                    { text: "Cancel" }
                  ])
                }}
              >
                <Fontisto name="locked" size={theme.font * 2} color="black" />
              </Pressable>
            )
          }
          else if (currentMessage.is_file) {
            return (
              <Pressable 
                style={{ padding: 5}}
                onPress={ async () => { 
                  Alert.alert("", `Do you wish to download ${currentMessage.text}?`, [
                    { text: "Download", onPress: () => filePressed(currentMessage)},
                    { text: "Cancel" }
                  ])
                }}
              >
                <View style={styles.fileBubble(theme)}>
                  <Image
                    style={styles.messageLogo(theme, currentMessage._rid == user.uid)}
                    source={require('../../assets/file.png')}
                  />
                  <Text style={styles.fileText(theme, currentMessage._rid == user.uid)}>{currentMessage.text}</Text>
                </View>
              </Pressable>
            )
          }
          else if (currentMessage && currentMessage.text) {
            return <MessageText 
              textStyle={{ 
                left: styles.messageText(theme, 1),
                right: styles.messageText(theme, 0)
              }}
              {...props}
            />
          }
        }}
      />
    )
  }

  const renderTime = (props) => (
    <Time
      timeTextStyle={{
        right: {
          color: "#CCCCCC",
          fontSize: theme.font / 2
        },
        left: {
          color: "#444444",
          fontSize: theme.font / 2
        }
      }}
      { ...props }
    />
  )

  // Custom Send bar at the bottom
  const renderSend = (props) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', height: 45 }}>
      <View style={styles.checkboxContainer}>
        <View style={{ flex: 1, }}>
            <Checkbox
                status={checked ? 'checked' : 'unchecked'}
                onPress={() => {
                    setChecked(!checked)
                    locked = !locked
                }}
                style={styles.checkbox}
            />
        </View>
        <View style={{ flex: 1 }}>
            <Text style={styles.label}>{locked ? "Unlock" : "Lock"}</Text>
        </View>
      </View>
      <Send {...props}></Send>
    </View>
  )

  return (
    <GiftedChat
      renderActions = {renderActions}
      renderBubble = {renderBubble}
      renderSend = {renderSend}
      renderTime = {renderTime}
      messages = {messages}
      onSend = {messages => onSend(messages)}
      textStyle={styles.messageText(theme, 1)}
      user = {{
        _id: user.uid,
      }}
    />
  )
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10
  },
  checkboxContainer: {
    flexDirection: "column",
  },
  checkbox: {
  },
  fileBubble: (theme) => ({
    flexDirection:'row',
    flexWrap:'wrap',
  }),
  fileText: (theme, left) => ({
    color: left ? "black" : "white",
    fontSize: theme.font - 5,
    textAlignVertical: "center",
  }),
  label: {
    color: "#000000",
  },
  messageText: (theme, left) => ({
    color: left ? "black" : "white",
    fontSize: theme.font - 5,
    padding: 2
  }),
  smallerLogo:{
    width: 30,
    height: 30
  },
})
