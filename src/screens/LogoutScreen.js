import React, { useContext, useState } from 'react';
import { Alert, Dimensions, StyleSheet, View } from 'react-native';
import { Button, Text, Title, TextInput } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import { AccountAuthContext } from '../contexts/AccountAuthContext'

export default function LogoutScreen({ navigation }) {

    //use logout function from AccountAuthContext
    const { logout } = useContext(AccountAuthContext)
    // check username database in firestore
    const showAllUserName = () => {
        firestore()
        .collection('username')
        .get()
        .then(collectionSnapshot => {
            console.log('Total users: ', collectionSnapshot.size);
            collectionSnapshot
                .forEach(documentSnapshot => {
                    console.log('User ID: ', documentSnapshot.id,
                        documentSnapshot.data());
                });
        });
    }

    return (
        <Button
            mode="contained"
            style={styles.button}
            contentStyle={styles.buttonContainer}
            labelStyle={styles.signupButtonLabel}
            onPress={async () => {
                logout();
                // go back to login screen
                navigation.navigate('Login');
            }}
        >Log out</Button>
    );
}