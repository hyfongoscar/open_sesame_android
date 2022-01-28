import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useContext } from 'react'

import LoginScreen from '../screens/LoginScreen'
import SignupScreen from '../screens/SignupScreen'
import ChatScreen from '../screens/ChatScreen';
import MessageScreen from '../screens/MessageScreen';
import VoiceEnrollScreen from '../screens/VoiceEnrollScreen'
import VoiceRecordingScreen from '../screens/VoiceRecordingScreen'
import ChangeUsernameScreen from '../screens/ChangeUsernameScreen'
import FriendRequestScreen from '../screens/FriendRequestScreen';
import ChangeProfilePicScreen from '../screens/ChangeProfilePicScreen';

import { AccountAuthContext } from '../contexts/AccountAuthContext'


const Stack = createNativeStackNavigator();

const globalScreenOptions = {
  headerStyle: {backgroundColor: "purple"},
  headerTitleStyle: {color: "white"},
  headerTintColor:"white",
}

export default function AuthStack() {
  const { user } = useContext(AccountAuthContext)

  return (
      <Stack.Navigator screenOptions={globalScreenOptions}>
        {user == null ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Message" component={MessageScreen}/>
            <Stack.Screen name="Chat" component={ChatScreen}/>
            <Stack.Screen name="VoiceEnroll" component={VoiceEnrollScreen} />
            <Stack.Screen name="VoiceRecording" component={VoiceRecordingScreen} />
            <Stack.Screen name="ChangeUsername" component={ChangeUsernameScreen}/>
            <Stack.Screen name="FriendRequest" component={FriendRequestScreen}/>
            <Stack.Screen name="ChangeProfilePic" component={ChangeProfilePicScreen}/>
          </>
        )}
      </Stack.Navigator>
  );
}
