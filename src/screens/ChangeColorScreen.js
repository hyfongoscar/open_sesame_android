import React, { useContext, useState, useEffect } from 'react';
import { Alert, Dimensions, StyleSheet, View } from 'react-native';
import { Button, Text, Title, TextInput } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import { AccountAuthContext } from '../contexts/AccountAuthContext'
import auth from '@react-native-firebase/auth';

export default function ChangeColorScreen({ navigation }) {
    const user = auth().currentUser;
    const [newColor, setColor] = useState('')

    const changeColorRed = async () => {
        await firestore()
            .collection('profiles')
            .doc(user.email)
            .update({
                color: 'red',
            })
        Alert.alert("", "Color theme changed!", [
            { text: "OK"}
        ])
    }

    const changeColorOrange = async () => {
        await firestore()
            .collection('profiles')
            .doc(user.email)
            .update({
                color: 'orange',
            })
        Alert.alert("", "Color theme changed!", [
            { text: "OK"}
        ])
    }

    const changeColorYellow = async () => {
        await firestore()
            .collection('profiles')
            .doc(user.email)
            .update({
                color: 'yellow',
            })
        Alert.alert("", "Color theme changed!", [
            { text: "OK"}
        ])
    }

    const changeColorGreen = async () => {
        await firestore()
            .collection('profiles')
            .doc(user.email)
            .update({
                color: 'green',
            })
        Alert.alert("", "Color theme changed!", [
            { text: "OK"}
        ])
    }

    const changeColorBlue = async () => {
        await firestore()
            .collection('profiles')
            .doc(user.email)
            .update({
                color: 'blue',
            })
        Alert.alert("", "Color theme changed!", [
            { text: "OK"}
        ])
    }

    const changeColorPurple = async () => {
        await firestore()
            .collection('profiles')
            .doc(user.email)
            .update({
                color: 'purple',
            })
        Alert.alert("", "Color theme changed!", [
            { text: "OK"}
        ])
    }

    const changeColorGrey = async () => {
        await firestore()
            .collection('profiles')
            .doc(user.email)
            .update({
                color: 'grey',
            })
        Alert.alert("", "Color theme changed!", [
            { text: "OK"}
        ])
    }

    const changeColorBlack = async () => {
        await firestore()
            .collection('profiles')
            .doc(user.email)
            .update({
                color: 'black',
            })
        Alert.alert("", "Color theme changed!", [
            { text: "OK"}
        ])
    }

    const changeColorBrown = async () => {
        await firestore()
            .collection('profiles')
            .doc(user.email)
            .update({
                color: 'brown',
            })
        Alert.alert("", "Color theme changed!", [
            { text: "OK"}
        ])
    }

    return(
        <View>
            <Text> Choose your new color theme by pressing the following buttons </Text>
            <Button
                uppercase={false}
                onPress={ () => changeColorRed() }
            >Red </Button>
            <Button
                uppercase={false}
                onPress={ () => changeColorOrange() }
            >Orange </Button>
            <Button
                uppercase={false}
                onPress={ () => changeColorYellow() }
            >Yellow </Button>
            <Button
                uppercase={false}
                onPress={ () => changeColorGreen() }
            >Green </Button>
            <Button
                uppercase={false}
                onPress={ () => changeColorBlue() }
            >Blue </Button>
            <Button
                uppercase={false}
                onPress={ () => changeColorPurple() }
            >Purple </Button>
            <Button
                uppercase={false}
                onPress={ () => changeColorGrey() }
            >Grey </Button>
            <Button
                uppercase={false}
                onPress={ () => changeColorBlack() }
            >Black </Button>
            <Button
                uppercase={false}
                onPress={ () => changeColorBrown() }
            >Brown </Button>
        </View>
    );
}
