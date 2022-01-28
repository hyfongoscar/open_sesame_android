import React, { useContext, useState, useEffect } from 'react';
import { Alert, Dimensions, StyleSheet, View } from 'react-native';
import { Button, Text, Title, TextInput } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import { AccountAuthContext } from '../contexts/AccountAuthContext'

export default function ChangeUsernameScreen({ navigation }) {
  const { user } = useContext(AccountAuthContext)
    const [newUserName, setNewUserName] = useState('')

    const changeName = async () => {
      const profile = {
        displayName: newUserName,
        photoURL: user.photoURL,
      }
      await user.updateProfile(profile)
      await firestore()
        .collection('profiles')
        .doc(email)
        .update({
          displayName: newUserName,
        })
    }
    return (
      <View>
        <TextInput
            label="NewUserName"
            numberOfLines={1}
            onChangeText={(newUserName) => setNewUserName(newUserName)}
        />
        <Button
            onPress={ () => changeName()}
        >Change Username</Button>
      </View>
    );
}
