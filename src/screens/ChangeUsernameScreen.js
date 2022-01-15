import React, { useContext, useState, useEffect } from 'react';
import { Alert, Dimensions, StyleSheet, View } from 'react-native';
import { Button, Text, Title, TextInput } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import { AccountAuthContext } from '../contexts/AccountAuthContext'

export default function ChangeUsernameScreen({ navigation }) {
    const email = auth.currentUser.email
    const userDocRef = doc(db,"username", email)
    const [user, setUser] = useState({})
    const userNameCollection = firestore().collection('username');

    useEffect(() => {
        const getUser = async () => {
          const snap = await getDoc(userDocRef)
          setUser({email, ...snap.data()})
        }
        getUser()
      },[])

    const changeName = () => {
        userNameCollection
            .doc(user.email)
            .update({
                name: newUserName,
            })
            .then(() => {
                console.log('Username changed!');
            });
    }
    return (
        <View style={styles.container}>
            {return <View key={user.email || 'email'}>
                    <Text>{user.name}</Text>
                    <Text>{user.id}</Text>
                </View>})}
        </View>
        <TextInput
            label="NewUserName"
            style={styles.input}
            value={password}
            numberOfLines={1}
            secureTextEntry={true}
            onChangeText={(newUserName) => setNewUserName(newUserName)}
        />
        <Button
            mode="contained"
            style={styles.button}
            contentStyle={styles.buttonContainer}
            labelStyle={styles.signupButtonLabel}
            onPress={ () => {changeName()}}
        >Change Username</Button>
    );
}