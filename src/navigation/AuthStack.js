import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect, useContext } from 'react'
import { TouchableOpacity, Image, Text, View, Alert } from 'react-native';

import LoginScreen from '../screens/LoginScreen'
import SignupScreen from '../screens/SignupScreen'
import ChatScreen from '../screens/ChatScreen';
import MessageScreen from '../screens/MessageScreen';
import VoiceEnrollScreen from '../screens/VoiceEnrollScreen'
import VoiceRecordingScreen from '../screens/VoiceRecordingScreen'
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen'
import SettingScreen from '../screens/SettingScreen'
import FriendRequestScreen from '../screens/FriendRequestScreen';
import ChangeProfilePicScreen from '../screens/ChangeProfilePicScreen';
import ChangeBackgroundPictureScreen from '../screens/ChangeBackgroundPictureScreen';
import ChangeColorScreen from '../screens/ChangeColorScreen';


import firestore from '@react-native-firebase/firestore';
import { AccountAuthContext } from '../contexts/AccountAuthContext'
import { ThemeContext } from '../contexts/ThemeContext'
import { MessageContext } from '../contexts/MessageContext'

import { AntD, MaterialCommunityIcons } from '../components/Icons';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  const { user } = useContext(AccountAuthContext)
  const { theme } = useContext(ThemeContext)
  const { chatter } = useContext(MessageContext)

  const globalScreenOptions = {
    headerStyle: {backgroundColor: theme.color},
    headerTitleStyle: {color: "white"},
    headerTintColor:"white",
  }

  const changePinUser = async ()  => {
    await firestore()
      .collection('profiles')
      .doc(user.email)
      .update({
        pin: chatter,
      })
    Alert.alert("", "Pinned User changed!", [
      { text: "OK"}
    ])
  }

  const clearPinUser = async ()  => {
    await firestore()
      .collection('profiles')
      .doc(user.email)
      .update({
        pin: firestore.FieldValue.delete(),
      })
      Alert.alert("", "Cleared Pinned User!", [
        { text: "OK"}
      ])
    }

  return (
    <Stack.Navigator screenOptions={globalScreenOptions}>
      {user == null ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="Reset Password" component={ForgotPasswordScreen}/>
          </>
        ) : (
          <>
            <Stack.Screen
              name="Message"
              component={MessageScreen}
              options={({navigation}) => ({
                headerTitle: () => (
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text
                      style={{ fontSize: 20, color: "white", marginRight: 10 }}
                    >Open Sesame</Text>
                    <TouchableOpacity onPress={() => clearPinUser()}>
                      <MaterialCommunityIcons name="pin-off" size={25} color="white" />
                    </TouchableOpacity>
                  </View>
                ),
                headerRight: () => (
                  <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                    <AntD name="setting" size={30} color="white" />
                  </TouchableOpacity>
                ),
              })}
            />
            <Stack.Screen
              name="Chat"
              component={ChatScreen}
              options={({navigation}) => ({
                headerTitle: () => (
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Image
                      style={{ width: 30, height: 30, borderRadius: 15}}
                      source={{
                        uri: chatter.photoURL
                      }}
                    />
                    <Text
                      style={{ fontSize: 20, color: "white", marginRight: 10 }}
                    > {chatter.displayName} </Text>
                    <TouchableOpacity onPress={() => changePinUser()}>
                      <MaterialCommunityIcons name="pin" size={25} color="white" />
                    </TouchableOpacity>
                  </View>
                ),
                headerRight: () => (
                  <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                    <AntD name="setting" size={30} color="white" />
                  </TouchableOpacity>
                ),
              })}
            />
            <Stack.Screen
              name="VoiceEnroll"
              component={VoiceEnrollScreen} 
              options={() => ({
                title: "Enroll your voiceprint"
              })}
            />
            <Stack.Screen
              name="VoiceRecording"
              component={VoiceRecordingScreen}
              options={() => ({
                title: "Recording"
              })}
            />
            <Stack.Screen
              name="FriendRequest"
              component={FriendRequestScreen}
              options={() => ({
                title: "Friend Requests"
              })}
            />
            <Stack.Screen
              name="ChangeProfilePic"
              component={ChangeProfilePicScreen}
              options={() => ({
                title: "Profile picture"
              })}
            />
            <Stack.Screen
              name="Settings"
              component={SettingScreen}
            />
            <Stack.Screen
              name="ChangeBackground"
              component={ChangeBackgroundPictureScreen}
              options={() => ({
                title: "Background picture"
              })}
            />
            <Stack.Screen
              name="ChangeColor"
              component={ChangeColorScreen}
              options={() => ({
                title: "Theme color"
              })}
            />
          </>
        )}
        
      </Stack.Navigator>
  );
}

