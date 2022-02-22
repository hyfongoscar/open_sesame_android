import React, { useContext, useState, useEffect } from 'react';
import { Alert, Dimensions, StyleSheet, View, Image,  PermissionsAndroid, ImageBackground } from 'react-native';
import { Button, Text, Title, TextInput } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { AccountAuthContext } from '../contexts/AccountAuthContext'
import DocumentPicker  from 'react-native-document-picker';
import FileViewer from "react-native-file-viewer";
import RNFetchBlob from 'rn-fetch-blob';

export default function ChangeBackgroundPictureScreen({ navigation }) {
    const { user } = useContext(AccountAuthContext)
    const [url, setURL] = useState(user.backgroundURL)

    const image = { uri: url };

    const uploadBackgroundPic = async() =>{
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
            const uploadTask = storage().ref(`backgroundPic/${file.name}`).putString(result, 'base64',{contentType: file.type});
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
                updateBackgroundPic(downloadURL)
                })
            })
        }

    const updateBackgroundPic = async (downloadURL) => {
      await firestore().collection('profiles').doc(user.email).update({
          backgroundURL: downloadURL,
      });
      setURL(downloadURL);
      Alert.alert("Successfully Changed Background Picture");
    }

    const removeBackgroundPic = async () => {
      await firestore().collection('profiles').doc(user.email).update({
        backgroundURL: firestore.FieldValue.delete(),
      });
      Alert.alert("Successfully Removed Background Picture");
    }


    return (
      <View style={styles.container}>
        <ImageBackground source={image} resizeMode="cover" style={styles.image}>
            <Button
                uppercase={false}
                onPress={()=>{ uploadBackgroundPic() }}
            >Upload Background Picture</Button>

            <Button
                uppercase={false}
                onPress={()=>{ removeBackgroundPic() }}
            >Remove Background Picture</Button>
        </ImageBackground>
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    userImg:{
      width: 100,
      height: 100,
    },
    image: {
        flex: 1,
        justifyContent: "center"
    },
});
