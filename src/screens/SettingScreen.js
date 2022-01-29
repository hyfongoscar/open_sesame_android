import React, { useContext, useState, useEffect } from 'react';
import { Alert, Dimensions, StyleSheet, View } from 'react-native';
import { Button, Text, Title, TextInput } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import { AccountAuthContext } from '../contexts/AccountAuthContext'
import auth from '@react-native-firebase/auth';

export default function SettingScreen({ navigation }) {
    const { logout } = useContext(AccountAuthContext)
    return(
        <View style={styles.container}>
            <Button
                mode="contained"
                style={styles.button}
                contentStyle={styles.buttonContainer}
                labelStyle={styles.navButtonText}
                onPress={() => navigation.navigate('ChangeUsername')}
            > Change username </Button>
            <Button
                mode="contained"
                style={styles.button}
                contentStyle={styles.buttonContainer}
                labelStyle={styles.navButtonText}
                onPress={() => navigation.navigate('VoiceEnroll')}
            > Enroll Voiceprint </Button>
            <Button
                mode="contained"
                style={styles.button}
                contentStyle={styles.buttonContainer}
                labelStyle={styles.navButtonText}
                onPress={() => navigation.navigate('VoiceVerify')}
            > Verify Voiceprint </Button>
            <Button
                mode="contained"
                style={styles.button}
                contentStyle={styles.buttonContainer}
                labelStyle={styles.navButtonText}
                onPress={async () => {
                    logout();
                    navigation.navigate('Login');
                }}
            >Log out</Button>
        </View>
    );
}