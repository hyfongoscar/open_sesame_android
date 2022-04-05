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

import Loading from '../components/Loading'

import firestore from '@react-native-firebase/firestore';
import { AccountAuthContext } from '../contexts/AccountAuthContext'
import { ThemeContext } from '../contexts/ThemeContext'
import { MessageContext } from '../contexts/MessageContext'
import { LoadingContext } from '../contexts/LoadingContext'



const Stack = createNativeStackNavigator();

export default function AuthStack() {
  const { user } = useContext(AccountAuthContext)
  const { theme } = useContext(ThemeContext)
  const { chatter } = useContext(MessageContext)
  const { loading } = useContext(LoadingContext)

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
            pin: chatter.uid,
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
              pin: "",
          })
      Alert.alert("", "Cleared Pinned User!", [
          { text: "OK"}
      ])
    }

  return (
      <Stack.Navigator screenOptions={globalScreenOptions}>
        { 
          loading == true ? (
            {/* <Stack.Screen name="OpenSesame" component={Loading} /> */}
          ) : 
          user == null ? (
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
                      style={{ fontSize: 20, color: "white" }}
                    > Open Sesame </Text>
                    <TouchableOpacity onPress={() => clearPinUser()}>
                        <Image
                            style={{ width: 30, height: 30, tintColor: "#FFFFFF" }}
                            source={require("../../assets/unpin.png")}
                        />
                    </TouchableOpacity>
                  </View>
                ),
                  headerRight: () => (
                      <TouchableOpacity onPress={() => navigation.navigate('Setting')}>
                          <Image style={{ width: 30, height: 30, tintColor: "#FFFFFF" }} source={require("../../assets/setting.png")}/>
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
                      style={{ width: 30, height: 30, borderRadius: 15 }}
                      source={{
                        uri: chatter.profilePic
                      }}
                    />
                    <Text
                      style={{ fontSize: 20, color: "white" }}
                    > {chatter.displayName} </Text>
                    <TouchableOpacity onPress={() => changePinUser()}>
                        <Image
                            style={{ width: 30, height: 30, tintColor: "#FFFFFF" }}
                            source={require("../../assets/pin.png")}
                        />
                    </TouchableOpacity>
                  </View>
                ),
                headerRight: () => (
                  <TouchableOpacity onPress={() => navigation.navigate('Setting')}>
                    <Image 
                      style={{ width: 30, height: 30, tintColor: "#FFFFFF" }}
                      source={require("../../assets/setting.png")}
                    />
                  </TouchableOpacity>
                ),
              })}
            />
            <Stack.Screen name="VoiceEnroll" component={VoiceEnrollScreen} />
            <Stack.Screen name="VoiceRecording" component={VoiceRecordingScreen} />
            <Stack.Screen name="FriendRequest" component={FriendRequestScreen}/>
            <Stack.Screen name="ChangeProfilePic" component={ChangeProfilePicScreen}/>
            <Stack.Screen name="Setting" component={SettingScreen}/>
            <Stack.Screen name="Change Background Picture" component={ChangeBackgroundPictureScreen}/>
            <Stack.Screen name="Change Color" component={ChangeColorScreen}/>
          </>
        )}
        
      </Stack.Navigator>
  );
}

