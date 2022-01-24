import React, { useCallback, useLayoutEffect, useState } from 'react'
import { Alert, Image, PermissionsAndroid, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import CheckBox from '@react-native-community/checkbox'

import { GiftedChat, Bubble, MessageText, Send, Actions} from 'react-native-gifted-chat'
import DocumentPicker  from 'react-native-document-picker';
import FileViewer from "react-native-file-viewer";
import RNFetchBlob from 'rn-fetch-blob';

import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

var RNFS = require('react-native-fs');
var locked = false

export default function ChatScreen({ navigation, route }) {
  
  const [messages, setMessages] = useState([])
  const [checked, setChecked] = useState(false)

  useLayoutEffect(() => {
    const subscriber = firestore()
      .collection('chats')
      .where('sender_id_pair', 'in',[[route.params.userID, 1], [1, route.params.userID]])
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
  });

  const getRandomString = (length) => {
    var randomChars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var result = '';
    for ( var i = 0; i < length; i++ ) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
  }

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
    const {_id, createdAt, text, user} = messages[0]
    firestore().collection('chats').doc(_id).set({
      _id,
      sender_id: user._id,
      _rid: route.params.userID,
      sender_id_pair: [user._id, route.params.userID],
      createdAt,
      text,
      user,
      locked,
      is_file: false,
    });
  }, [])

  const CustomMessageText = (props) => {
    const { currentMessage } = props;
    return (
      <TouchableOpacity onPress={()=>{alert("Locked")}}>
        <Image
          style={styles.largerLogo}
          source={require('../../assets/lock.jpeg')}
        />
      </TouchableOpacity>
    )
  }

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
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
       // getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL){
          console.log('File available at', downloadURL);
          saveFileToDatabase(downloadURL, file)
        })
      }
    )
  }

  const saveFileToDatabase = (downloadURL, file) => {
    const randomID = getRandomString(8) + "-" +  getRandomString(4) + "-" + getRandomString(4) + "-" + getRandomString(4) + "-" + getRandomString(12);
    firestore().collection('chats').doc(randomID).set({
      _id: randomID,
      _rid: route.params.userID,
      createdAt: new Date(),
      locked,
      sender_id: 1,
      sender_id_pair: [1,route.params.userID],
      user:{
        _id: 1,
      },
      text: file.name,
      file_url: downloadURL,
      is_file: true,
    })
  }
  
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
                console.log(result)
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

  const renderBubble = (props) => {
    const { currentMessage } = props;
    if (currentMessage.is_file == true){
      return(
        <Bubble
          {...props}
          touchableProps={{ disabled: true }} // <= put this in to fix!
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

  const renderMessageText =  (props) => {
    const { currentMessage } = props;
    if (currentMessage.locked && currentMessage.user._id != 1){
      return <CustomMessageText {...props} />
    }
    return <MessageText {...props} />
  }

  const renderSend = (props) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', height: 60 }}>
      <View style={styles.checkboxContainer}>
        <CheckBox
          value={checked}
          onValueChange={(newValue) => {
            setChecked(newValue)
            locked = newValue
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
      renderBubble = {renderBubble}
      renderMessageText = {renderMessageText}
      renderActions = {renderActions}
      renderSend = {renderSend}
      messages= {messages}
      onSend= {messages => onSend(messages)}
      user={{
        _id: 1,
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
