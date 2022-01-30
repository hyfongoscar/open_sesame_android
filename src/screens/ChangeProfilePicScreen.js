import React, { useContext, useState, useEffect } from 'react';
import { Alert, Dimensions, StyleSheet, View, Image,  PermissionsAndroid } from 'react-native';
import { Button, Text, Title, TextInput } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { AccountAuthContext } from '../contexts/AccountAuthContext'
import DocumentPicker  from 'react-native-document-picker';
import FileViewer from "react-native-file-viewer";
import RNFetchBlob from 'rn-fetch-blob';



export default function ChangeProfilePicScreen({ navigation }) {
    const { user } = useContext(AccountAuthContext)
    const [url, setURL] = useState(user.photoURL)
 
    const uploadProfilePic = async() =>{
        try {
          const res = await DocumentPicker.pick({
            type: [DocumentPicker.types.images],
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
    }

    const uploadFileToFirebase = async (result, file) => {
        const uploadTask = storage().ref(`profilePic/${file.name}`).putString(result, 'base64',{contentType: file.type});
        uploadTask.on('state_changed', 
        (snapshot) => {
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
            uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL){
            console.log('File available at', downloadURL);
            updateProfilePic(downloadURL)
            })
        })
    }

  const updateProfilePic = async (downloadURL) => {
    await firestore().collection('profiles').doc(user.email).update({
        photoURL: downloadURL,     
    });

    const profile = {
        displayName: user.displayName,
        photoURL: downloadURL,
    }
    await user.updateProfile(profile);
    setURL(downloadURL);
    Alert.alert("Successfully Change Profile Picture");
  }
    return (
      <View>
        <Image
            style={styles.userImg}
            source={{
             uri: url,
        }}
            
        />
        <Button onPress={()=>{uploadProfilePic()}}
        >Upload Profile Picture</Button>
      </View>
    );
}

const styles = StyleSheet.create({
    userImg:{
      width: 100,
      height: 100,
      borderRadius: 50,
    },
});
  
