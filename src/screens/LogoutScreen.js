import React, { useContext, useState } from 'react';
import { Alert, Dimensions, StyleSheet, View } from 'react-native';
import { Button, Text, Title, TextInput } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import { AccountAuthContext } from '../contexts/AccountAuthContext'

export default function LogoutScreen({ navigation }) {

    const { logout } = useContext(AccountAuthContext)

    return (
        <Button
            mode="contained"
            onPress={async () => {
                logout();
                // go back to login screen
                navigation.navigate('Login');
            }}
        >Log out</Button>
    );
}