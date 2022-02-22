import React, { useContext } from 'react'
import { Alert, Dimensions, StyleSheet, Text, View, Image, ImageBackground } from 'react-native'

import firestore from '@react-native-firebase/firestore';
import prompt from 'react-native-prompt-android';

import { AccountAuthContext } from '../contexts/AccountAuthContext'
import { ThemeContext } from '../contexts/ThemeContext'

export default function SettingScreen({ navigation }) {
    const { user, logout } = useContext(AccountAuthContext)
    const { theme } = useContext(ThemeContext)
    const image = { uri: theme.background };
    console.log(theme)
    return(
        <View style={styles.container}>
            <ImageBackground source={image} resizeMode="cover" style={styles.image}>
                <Image
                    style={styles.userImg}
                    source={{
                        uri:  theme.profile ,
                    }}
                />
                <Text
                    style={styles.text}
                >Username: { theme.displayName }</Text>
                <Text
                    style={styles.text}
                >Email: { user.email }</Text>
                <Text
                    uppercase={false}
                    style={styles.text}
                    onPress={async () => navigation.navigate('FriendRequest')}
                >Add friends</Text>
                <Text
                    uppercase={false}
                    style={styles.text}
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
                >Change Username </Text>
                <Text
                    uppercase={false}
                    style={styles.text}
                    onPress={() => navigation.navigate('ChangeProfilePic')}
                >Change Profile Picture </Text>
                <Text
                    uppercase={false}
                    style={styles.text}
                    onPress={() => navigation.navigate('VoiceEnroll')}
                >Enroll Voiceprint </Text>
                <Text
                    uppercase={false}
                    style={styles.text}
                    onPress={() => navigation.navigate('Change Background Picture')}
                >Change Background Picture</Text>
                <Text
                    uppercase={false}
                    style={styles.text}
                    onPress={() => navigation.navigate('Change Color')}
                >Change Color Theme</Text>
                <Text
                    uppercase={false}
                    style={styles.text}
                    onPress={() => navigation.navigate('Change Font Size')}
                >Change Font Size </Text>
                <Text
                    uppercase={false}
                    style={styles.redText}
                    onPress={async () => {
                        logout();
                    }}
                >Log out</Text>
            </ImageBackground>
        </View>
    );
}

const { width, height } = Dimensions.get('screen');

const styles = StyleSheet.create({
  text: {
    margin: 15,
    paddingBottom: 15,
    color: "black",
    fontSize: 20,
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 1,
  },
  redText: {
    margin: 15,
    paddingBottom: 15,
    color: "red",
    fontSize: 20,
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 1,
  },
  container: {
    flex: 1, 
    paddingLeft: 20,
    paddingRight: 20,
  },
  userImg:{
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  image: {
    flex: 1,
    justifyContent: "center"
  },
});
