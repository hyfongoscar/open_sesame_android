import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useContext } from 'react'
import { TouchableOpacity, Image } from 'react-native';

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
import ChangeFontSizeScreen from '../screens/ChangeFontSizeScreen';
import ChangeColorScreen from '../screens/ChangeColorScreen';

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
            <Stack.Screen name="Reset Password" component={ForgotPasswordScreen}/>
          </>
        ) : (
          <>
            <Stack.Screen
                name="Message"
                component={MessageScreen}
                options={({navigation}) => ({
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
                    headerRight: () => (
                        <TouchableOpacity onPress={() => navigation.navigate('Setting')}>
                            <Image style={{ width: 30, height: 30, tintColor: "#FFFFFF" }} source={require("../../assets/setting.png")}/>
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
            <Stack.Screen name="Change Font Size" component={ChangeFontSizeScreen}/>
            <Stack.Screen name="Change Color" component={ChangeColorScreen}/>
          </>
        )}
      </Stack.Navigator>
  );
}

