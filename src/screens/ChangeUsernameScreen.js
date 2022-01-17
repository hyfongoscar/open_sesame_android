import React, { useContext, useState, useEffect } from 'react';
import { Alert, Dimensions, StyleSheet, View } from 'react-native';
import { Button, Text, Title, TextInput } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import { AccountAuthContext } from '../contexts/AccountAuthContext'
import auth from '@react-native-firebase/auth';

export default function ChangeUsernameScreen({ navigation }) {
    const user = auth().currentUser;
    const [newUserName, setNewUserName] = useState('')
    const userNameCollection = firestore().collection('username');

    const changeName = () => {
        userNameCollection
            //.doc(user.email)
            .doc('samsamho718@gmail.com')
            .update({
                name: newUserName,
            })
            .then(() => {
                console.log('Username changed!');
            });
    }
    return (
        <View>
            <TextInput
                label="NewUserName"
                numberOfLines={1}
                onChangeText={(newUserName) => setNewUserName(newUserName)}
            />
            <Button
                onPress={ () => {changeName()}}
            >Change Username</Button>
        </View>
    );
}