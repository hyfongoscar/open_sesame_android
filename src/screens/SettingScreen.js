import React, { useContext } from 'react';
import { Alert, Dimensions, StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';

import firestore from '@react-native-firebase/firestore';
import prompt from 'react-native-prompt-android';

import { AccountAuthContext } from '../contexts/AccountAuthContext'

export default function SettingScreen({ navigation }) {
    const { user, logout } = useContext(AccountAuthContext)
    return(
        <View style={styles.container}>
            <Button
                mode="contained"
                uppercase={false}
                style={styles.button}
                onPress={async () => navigation.navigate('FriendRequest')}
            >Add friends</Button>
            <Button
                mode="contained"
                uppercase={false}
                style={styles.button}
                onPress={() => {
                  prompt("Enter new username", "",
                    [
                      {text: 'Cancel'},
                      {text: 'OK', onPress: async (newUserName) => {
                        if (!newUserName) {
                          Alert.alert("", "Please enter a username")
                          return
                        }
                        const profile = {
                          displayName: newUserName,
                          photoURL: user.photoURL,
                        }
                        await user.updateProfile(profile)
                        await firestore()
                          .collection('profiles')
                          .doc(user.email)
                          .update({
                            displayName: newUserName,
                          })
                      }},
                    ],
                    {
                      type: 'plain-text',
                      placeholder: 'Username'
                    }
                );
                }}
            > Change Username </Button>
            <Button
                mode="contained"
                uppercase={false}
                style={styles.button}
                contentStyle={styles.buttonContainer}
                labelStyle={styles.navButtonText}
                onPress={() => navigation.navigate('ChangeProfilePic')}
            >Change Profile Picture </Button>
            <Button
                mode="contained"
                uppercase={false}
                style={styles.button}
                onPress={() => navigation.navigate('VoiceEnroll')}
            > Enroll Voiceprint </Button>
            <Button
                mode="contained"
                uppercase={false}
                style={styles.button}
                onPress={async () => {
                  logout();
                }}
            >Log out</Button>
        </View>
    );
}

const { width, height } = Dimensions.get('screen');

const styles = StyleSheet.create({
  button: {
    marginTop: 10,
    borderBottomStyle: "solid"
  },
  container: {
    flex: 1, 
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: 'center', 
    justifyContent: 'center'
  },
});
