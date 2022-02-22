import React, { useCallback, useEffect, useContext, useState } from 'react'
import { Alert, Image, PermissionsAndroid, StyleSheet, Text, TouchableOpacity, View, ImageBackground } from 'react-native'
import { Checkbox } from 'react-native-paper'

import { GiftedChat, Bubble, MessageText, Send, Actions} from 'react-native-gifted-chat'
import DocumentPicker  from 'react-native-document-picker';
import FileViewer from "react-native-file-viewer";
import RNFetchBlob from 'rn-fetch-blob';
import uuid from 'react-native-uuid';

import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

var RNFS = require('react-native-fs');
var locked = false

import { AccountAuthContext } from '../contexts/AccountAuthContext'
import { VoiceAuthContext } from '../contexts/VoiceAuthContext'
import { MessageContext } from '../contexts/MessageContext';
import { ThemeContext } from '../contexts/ThemeContext'


export default function ChatScreen({ navigation, route }) {
  const [checked, setChecked] = useState(false)
  const { verified } = useContext(VoiceAuthContext)
  const { user } = useContext(AccountAuthContext)
  const { messages, setMessages } = useContext(MessageContext)
  const { theme } = useContext(ThemeContext)
  const image = { uri: theme.background };

  const onSend = useCallback(async (messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
    const { _id, createdAt, text} = messages[0];

    const messageObj = {
      _id,
      sender_id: messages[0].user._id,
      _rid: route.params.userID,
      sender_id_pair: [messages[0].user._id, route.params.userID],
      createdAt,
      text,
      s_user: messages[0].user,
      locked,
      is_file: false,
    }

    firestore().collection('chats').doc(_id).set(messageObj)

    var friendPairID
    await firestore()
      .collection('friendList')
      .where('friend_email_pair', 'in',[[route.params.userEmail, user.email], [user.email, route.params.userEmail]])
      .get()
      .then(querySnapshot => {
        friendPairID = querySnapshot.docs[0].id
      })
    
    await firestore().collection('friendList').doc(friendPairID)
      .update({
        lastMessage: messageObj
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
    const randomID = uuid.v4();
    const s_user = {
      _id: user.uid,
    }
    const messageObj = {
      _id: randomID,
      _rid: route.params.userID,
      createdAt: new Date(),
      locked,
      sender_id: user.uid,
      sender_id_pair: [user.uid,route.params.userID],
      s_user: s_user,
      text: file.name,
      file_url: downloadURL,
      is_file: true,
    }

    firestore().collection('chats').doc(randomID).set(messageObj)

    var friendPairID
    await firestore()
      .collection('friendList')
      .where('friend_email_pair', 'in',[[route.params.userEmail, user.email], [user.email, route.params.userEmail]])
      .get()
      .then(querySnapshot => {
        friendPairID = querySnapshot.docs[0].id
      })
    
    firestore().collection('friendList').doc(friendPairID)
      .update({
        lastMessage: messageObj
      })
    console.log("Done");
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
              source={require('../../assets/file.jpeg')}
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
    if (currentMessage._rid == user.uid && currentMessage.locked && !verified) {
      return (
        <Bubble
          {...props} 
          renderMessageText={() => (
            <TouchableOpacity 
              onPress={ () => {
                Alert.alert("Locked!", "Unlock this message with your voiceprint", [
                  { text: "Unlock", onPress: () => navigation.navigate("VoiceRecording", {option: "verify"}) },
                  { text: "Cancel" }
                ])
              }}
            >
              <Image
                style={styles.largerLogo}
                source={require('../../assets/lock.jpeg')}
              />
            </TouchableOpacity>
          )}
        />
      )
    }
    else if (currentMessage.is_file == true){
      return (
        <Bubble
          {...props}
          touchableProps={{ disabled: true }}
          renderCustomView={() => (
            <TouchableOpacity 
              onPress={ async () => { 
                Alert.alert("", `Do you wish to download ${currentMessage.text}?`, [
                  { text: "Download", onPress: () => filePressed(currentMessage)},
                  { text: "Cancel" }
                ])
              }}
            >
              <View style={{ width: 50, height: 50 }}>
                <Image
                  style={styles.largerLogo}
                  source={require('../../assets/file.jpeg')}
                />
              </View>
            </TouchableOpacity>
          )}
        />
      )
    }
    return <Bubble {...props} />
  }

  // Custom Send bar at the bottom
  const renderSend = (props) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', height: 60 }}>
      <View style={styles.checkboxContainer}>
        <Checkbox
          status={checked ? 'checked' : 'unchecked'}
          onPress={() => {
            setChecked(!checked)
            locked = !locked
          }}
          style={styles.checkbox}
        />
        <Text style={styles.label}>{locked ? "Unlock" : "Lock"}</Text>
      </View>
      <Send {...props}></Send>
    </View>
  )

  return (
    <GiftedChat
      renderActions = {renderActions}
      renderBubble = {renderBubble}
      renderSend = {renderSend}
      messages = {messages}
      onSend = {messages => onSend(messages)}
      user = {{
        _id: user.uid,
      }}
    />
  )
}

const styles = StyleSheet.create({
  largerLogo: {
    width: 50,
    height: 50,
  },
  smallerLogo:{
    width: 30,
    height: 30
  },
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10
  },
  checkboxContainer: {
    flexDirection: "column",
  },
  checkbox: {
    alignSelf: "center",
  },
  label: {
    margin: 5,
    color: "#000000",
  },
})
