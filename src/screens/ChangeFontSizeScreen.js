import React, { useContext, useState, useEffect } from 'react';
import { Alert, Dimensions, StyleSheet, View } from 'react-native';
import { Button, Text, Title, TextInput } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import { AccountAuthContext } from '../contexts/AccountAuthContext'
import auth from '@react-native-firebase/auth';

export default function ChangeFontSizeScreen({ navigation }) {
    const user = auth().currentUser;
    const [newFontSize, setFontSize] = useState(0)

    const changeFontSize = async () => {
        await firestore()
            .collection('profiles')
            .doc(user.email)
            .update({
                fontSize: Number(newFontSize),
            })
        Alert.alert("", "Font size changed!", [
            { text: "OK"}
        ])
    }

    return(
        <View>
            <TextInput
                keyboardType = 'numeric'
                label="Enter your new font size here"
                numberOfLines={1}
                onChangeText={(newFontSize) => { setFontSize(newFontSize)}}
                />
            <Button
                uppercase={false}
                onPress={ () => changeFontSize() }
            >Set font size </Button>
        </View>
    );
}



