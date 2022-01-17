import React, { useState, useCallback, useEffect, useLayoutEffect } from 'react'
import { StyleSheet, TouchableOpacity, Image, View, Text, Platform, PermissionsAndroid} from 'react-native'
import { Button, Checkbox } from 'react-native-paper';
import { GiftedChat, Bubble, MessageText, Send, Actions} from 'react-native-gifted-chat'
import DocumentPicker  from 'react-native-document-picker';
import FileViewer from "react-native-file-viewer";
import RNFetchBlob from 'rn-fetch-blob';
import firestore from '@react-native-firebase/firestore';
import storage, {getStorage, ref, uploadBytesResumable, getDownloadURL} from '@react-native-firebase/storage';
var RNFS = require('react-native-fs');
export default function ChatScreen({navigation,route}) {
  

  const [messages, setMessages] = useState([]);
  const [checked, setChecked] = useState(false);

  function getRandomString(length) {
    var randomChars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    var result = '';
    for ( var i = 0; i < length; i++ ) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
}

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
            file_type: doc.data().file_type,
            file_url: doc.data().file_url,
            downloaded: doc.data().downloaded,
            is_file : doc.data().is_file, 
          }))
        );
      });
    return subscriber;
  });

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
    const {_id, createdAt, text, user} = messages[0]
    const sender_id_pair = [user._id, route.params.userID]
    const sender_id = user._id
    const _rid = route.params.userID
    const locked = checked
    const file_type = "text" 
    const file_url = "none"
    const downloaded = true
    const is_file= false
    firestore().collection('chats').doc(_id).set({
      _id,
      sender_id,
      _rid,
      sender_id_pair,
      createdAt,
      text,
      user,
      locked,
      file_type,
      file_url,
      downloaded,
      is_file,
    });
  }, [])
 
  /*
  function downloadFromFirebase(currentMessage){
    const { config, fs } = RNFetchBlob
    let PictureDir = fs.dirs.PictureDir // this is the pictures directory. You can check the available directories in the wiki.
    let options = {
      fileCache: true,
      addAndroidDownloads : {
        useDownloadManager : true, // setting it to true will use the device's native download manager and will be shown in the notification bar.
        notification : false,
        path:  PictureDir + "/me_", // this is the path where your downloaded file will live in
        description : 'Downloading file'
      }
    }
    config(options).fetch('GET',currentMessage.file_url).then((res) => {
      // do some magic here
    })
  }
  */
  function openFile(path){
    FileViewer.open(path);
  }

   const FileText = (props) => {
    const { currentMessage } = props;
    const { config, fs } = RNFetchBlob
    if(!currentMessage.downloaded)
    {
      firestore().collection('chats').doc(currentMessage._id).update({downloaded:true});
      let DownloadDir = fs.dirs.DownloadDir // this is the pictures directory. You can check the available directories in the wiki.
      let options = {
      fileCache: true,
      addAndroidDownloads : {
        useDownloadManager : true, // setting it to true will use the device's native download manager and will be shown in the notification bar.
        notification : false,
        path:  DownloadDir + "/" + currentMessage.text, // this is the path where your downloaded file will live in
        description : 'Downloading file'
      }
    }
      config(options).fetch('GET',currentMessage.file_url).then((res) => {
        // do some magic here
      })
    }
    let DownloadDir = fs.dirs.DownloadDir
    const path = DownloadDir + "/" + currentMessage.text;
    return (
      <MessageText {...props}/>
    );  
  }
  
  const CustomMessageText = (props) => {
    const { currentMessage } = props;
    return (
      <TouchableOpacity onPress={()=>{alert("Locked")}}>
        <Image
          style={styles.lockedLogo}
          source={require('../../assets/lock.jpeg')}
        />
      </TouchableOpacity>
    );  
  }
  async function normalizePath(path){
    const filePrefix = 'file://';
    if(path.startsWith(filePrefix)){
      path=path.substring(filePrefix.length);
      try{
        path=decodeURI(path);
      }
      catch(e){}
    }
  }

  async function uploadFileToFirebase(result, file){
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
        });
      }
    );
  }

  function saveFileToDatabase(downloadURL, file){
    const randomID = getRandomString(8) + "-" +  getRandomString(4) + "-" + getRandomString(4) + "-" + getRandomString(4) + "-" + getRandomString(12);
    firestore().collection('chats').doc(randomID).set({
      _id: randomID,
      _rid: route.params.userID,
      createdAt: new Date(),
      locked: checked,
      sender_id: 1,
      sender_id_pair: [1,route.params.userID],
      user:{
        _id: 1,
      },
      text: file.name,
      file_type: file.type,
      file_url: downloadURL,
      downloaded: false,
      is_file: true,
    });
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
                         });                   
                        console.log('res : ' + JSON.stringify(res));
                        console.log('URI : ' + res[0].uri);
                        console.log('Type : ' + res[0].type);
                        console.log('File Name : ' + res[0].name);
                        console.log('File Size : ' + res[0].size);
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
                      }
                     catch(e){
                         if(DocumentPicker.isCancel(e)){
                           console.log("User cancelled!")
                         } else {
                           throw e;
                        }
                      }

                     },
                    Cancel: (props) => {console.log("Cancel")}
                }}
                icon={() => (
                   <Button
                       name={'add'}
                       size={28}
                       color={'blue'}
                       style={{left:0, bottom:0}}                           
                  />
               )}
               onSend={args => console.log(args)}
            />
         )
    }
       
  const renderBubble = (props) => {
    const { currentMessage } = props;
    if(currentMessage.is_file == true)
    {
      const { config, fs } = RNFetchBlob
      let DownloadDir = fs.dirs.DownloadDir
      const path = DownloadDir + "/" + currentMessage.text;
      return(
        <Bubble
          {...props}
          touchableProps={{ disabled: true }} // <= put this in to fix!
          renderCustomView={() => (
            <TouchableOpacity onPress={() => openFile(path)}>
              <View style={{ width: 50, height: 50 }}>
                <Image
                  style={styles.lockedLogo}
                  source={require('../../assets/file.jpeg')}
                />
              </View>
          </TouchableOpacity>
      )}
      />
      )
    }
    return <Bubble {...props} />
  };


  const renderMessageText = (props) => {
    const { currentMessage } = props;
  
    if (currentMessage.locked && currentMessage.user._id != 1){
      return <CustomMessageText {...props} />
    }
    if(currentMessage.is_file){
      return <FileText {...props}/>
    }
    
    return <MessageText {...props} />
  };

  const renderSend= (props) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', height: 60 }}>
      <Checkbox
        status={checked ? 'checked' : 'unchecked'}
        onPress={() => {
          setChecked(!checked);
        }}
      />
      <Send {...props}>
      </Send>
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
  lockedLogo: {
    width: 50,
    height: 50,
  },
  button: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10
  },
})
