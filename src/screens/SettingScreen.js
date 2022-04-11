import React, { useContext, useEffect } from 'react'
import { Alert, Dimensions, StyleSheet, Text, View, Image, ImageBackground, ScrollView, TouchableOpacity } from 'react-native'

import firestore from '@react-native-firebase/firestore';
import prompt from 'react-native-prompt-android';
import { SvgUri } from 'react-native-svg';
import { EvilIcons, FontAwesome5, Fontisto, Ionicons, MaterialIcons } from '../components/Icons';

import { AccountAuthContext } from '../contexts/AccountAuthContext'
import { ThemeContext } from '../contexts/ThemeContext'

export default function SettingScreen({ navigation }) {
  const { user, logout } = useContext(AccountAuthContext)
  const { theme } = useContext(ThemeContext)

  const changeUsername = () => {
    prompt("Edit username", "",
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
            Alert.alert("", "Username changed!")
        }},
      ],
      {
        type: 'plain-text',
        placeholder: 'Username'
      }
    );
  }

  const changeVerificationTime = () => {
    prompt("Verification will timeout after", "",
      [
        {text: 'Cancel'},
        {text: 'OK', onPress: async (newTime) => {
            if (!newTime) {
              Alert.alert("", "Please enter a time")
              return
            }
            await firestore()
                .collection('profiles')
                .doc(user.email)
                .update({
                    verificationTime: newTime,
                })
            Alert.alert("", "Time changed!")
        }},
      ],
      {
        type: 'plain-text',
        placeholder: 'Time (in minutes, default: 5)'
      }
    );
  }

  return(
    <View style={styles.container}>
      <ScrollView>
        <ImageBackground 
          source={{
            uri: theme.background
          }}
          resizeMode="cover"
          style={styles.image}
        >
          <View style={styles.firstRow(theme)}>
            <TouchableOpacity onPress={() => navigation.navigate('ChangeProfilePic')}>
              { theme.photoURL.split('.').pop() == 'svg' ? (
                  <SvgUri
                    width={100}
                    height={100}
                    style={styles.userImg}
                    uri={theme.photoURL}
                  />
                ) : ( 
                  <Image
                    style={styles.userImg}
                    source={{
                      uri:  theme.photoURL,
                    }}
                  />
                )
              }
            </TouchableOpacity>
            <TouchableOpacity onPress={() => changeUsername()}>
              <View style={styles.username} >
                <FontAwesome5 name="user-alt" size={theme.font} style={styles.icon(theme)} />
                <Text
                  style={styles.usernameText(theme)}
                >{ theme.displayName }</Text>
                <EvilIcons name="pencil" size={theme.font * 1.5} color="#000000"style={styles.icon(theme)} />
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.row(theme)}>
            <MaterialIcons name="email" size={theme.font * 1.5} style={styles.icon(theme)} />
            <Text
                style={styles.text(theme)}
            >{ user.email }</Text>
            <EvilIcons name="pencil" size={theme.font * 1.5} style={styles.icon(theme)} />
          </View>
          <View style={styles.row(theme)}>
            <FontAwesome5 name="user-friends" size={theme.font} style={styles.icon(theme)} />
            <Text
                uppercase={false}
                style={styles.text(theme)}
                onPress={async () => navigation.navigate('FriendRequest')}
            >Add friends</Text>
          </View>
          <View style={styles.row(theme)}>
            <MaterialIcons name="keyboard-voice" size={theme.font * 1.5} style={styles.icon(theme)} />
            <Text
                uppercase={false}
                style={styles.text(theme)}
                onPress={() => navigation.navigate('VoiceEnroll')}
            >Enroll Voiceprint</Text>
          </View>
          <View style={styles.row(theme)}>
            <MaterialIcons name="timer" size={theme.font * 1.5} style={styles.icon(theme)} />
            <Text
                uppercase={false}
                style={styles.text(theme)}
                onPress={() => changeVerificationTime()}
            >Change Verification Time</Text>
          </View>
          <View style={styles.row(theme)}>
            <Fontisto name="picture" size={theme.font} style={styles.icon(theme)} />
            <Text
                uppercase={false}
                style={styles.text(theme)}
                onPress={() => navigation.navigate('ChangeBackground')}
            >Change Background Picture</Text>
          </View>
          <View style={styles.row(theme)}>
            <Ionicons name="color-palette-outline" size={theme.font * 1.5} style={styles.icon(theme)} />
            <Text
                uppercase={false}
                style={styles.text(theme)}
                onPress={() => navigation.navigate('ChangeColor')}
            >Change Color Theme</Text>
          </View>
          <View style={styles.row(theme)}>
            <FontAwesome5 name="font" size={theme.font} style={styles.specialIcon(theme)} />
            <Text
                uppercase={false}
                style={styles.text(theme)}
                onPress={() => {
                  prompt("Edit font size", "",
                    [
                      {text: 'Cancel'},
                      {text: 'OK', onPress: async (newFontSize) => {
                          if (!newFontSize || isNaN(newFontSize)) {
                            Alert.alert("", "Please enter a number")
                            return
                          }
                          await firestore()
                            .collection('profiles')
                            .doc(user.email)
                            .update({
                              fontSize: Number(newFontSize),
                            })
                          Alert.alert("", "Font size changed!")
                      }},
                    ],
                    {
                      type: 'plain-text',
                      placeholder: 'Font Size'
                    }
                );
                }}
            >Change Font Size</Text>
          </View>
          <View style={styles.row(theme)}>
            <Ionicons name="log-out-outline" size={theme.font * 1.5} style={styles.redIcon(theme)} />
            <Text
                uppercase={false}
                style={styles.redText(theme)}
                onPress={async () => {
                    logout();
                }}
            >Log out</Text>
          </View>
        </ImageBackground>
      </ScrollView>
    </View>
  );
}

const { width, height } = Dimensions.get('screen');

const styles = StyleSheet.create({
  firstRow: (theme) => ({
    flexDirection:'row',
    flexWrap:'wrap',
    alignItems: 'center',
    paddingBottom: theme.font / 2,
  }),
  username: {
    flexDirection:'row',
    flexWrap:'wrap',
    justifyContent: "center",
  },
  row: (theme) => ({
    margin: theme.font * 2 / 3,
    flexDirection:'row',
    flexWrap:'wrap',
    paddingBottom: theme.font,
    borderBottomColor: 'lightgrey',
    borderBottomWidth: 1,
  }),
  usernameText: (theme) => ({
    color: "black",
    fontSize: theme.font,
    textAlignVertical: "center",
  }),
  icon: (theme) => ({
    color: "black",
    textAlignVertical: "center",
    marginLeft: theme.font * 1.8 / 3,
    marginRight: theme.font * 1.8 / 3,
  }),
  specialIcon: (theme) => ({
    color: "black",
    textAlignVertical: "center",
    marginLeft: theme.font * 2.8 / 3,
    marginRight: theme.font * 2.8 / 3,
  }),
  redIcon: (theme) => ({
    color: "red",
    textAlignVertical: "center",
    marginLeft: theme.font * 2 / 3,
    marginRight: theme.font * 2 / 3,
  }),
  text: (theme) => ({
    color: "black",
    fontSize: theme.font,
    textAlignVertical: "center",
  }),
  redText: (theme) => ({
    color: "red",
    fontSize: theme.font,
    textAlignVertical: "center",
  }),
  container: {
    flex: 1, 
    paddingLeft: 20,
    paddingRight: 20,
  },
  userImg:{
    width: 100,
    height: 100,
    borderRadius: 50,
    margin: 10
  },
  image: {
    flex: 1,
    justifyContent: "center"
  },
});
