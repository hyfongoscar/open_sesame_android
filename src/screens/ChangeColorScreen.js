import React, { useContext, useState, useEffect } from 'react';
import { Alert, Dimensions, StyleSheet, View,  ScrollView, TouchableOpacity } from 'react-native';
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

    const changeColorYellowGreen = async () => {
        await firestore()
            .collection('profiles')
            .doc(user.email)
            .update({
                color: 'yellowgreen',
            })
        Alert.alert("", "Color theme changed!", [
            { text: "OK"}
        ])
    }

    const changeColorViolet = async () => {
        await firestore()
            .collection('profiles')
            .doc(user.email)
            .update({
                color: 'violet',
            })
        Alert.alert("", "Color theme changed!", [
            { text: "OK"}
        ])
    }

    const changeColorAqua = async () => {
        await firestore()
            .collection('profiles')
            .doc(user.email)
            .update({
                color: 'aqua',
            })
        Alert.alert("", "Color theme changed!", [
            { text: "OK"}
        ])
    }

    const changeColorTomato = async () => {
        await firestore()
            .collection('profiles')
            .doc(user.email)
            .update({
                color: 'tomato',
            })
        Alert.alert("", "Color theme changed!", [
            { text: "OK"}
        ])
    }

    const changeColorGold = async () => {
        await firestore()
            .collection('profiles')
            .doc(user.email)
            .update({
                color: 'gold',
            })
        Alert.alert("", "Color theme changed!", [
            { text: "OK"}
        ])
    }

    const changeColorChocolate = async () => {
        await firestore()
            .collection('profiles')
            .doc(user.email)
            .update({
                color: 'chocolate',
            })
        Alert.alert("", "Color theme changed!", [
            { text: "OK"}
        ])
    }

    const changeColorCrimson = async () => {
        await firestore()
            .collection('profiles')
            .doc(user.email)
            .update({
                color: 'crimson',
            })
        Alert.alert("", "Color theme changed!", [
            { text: "OK"}
        ])
    }

    const changeColorPink = async () => {
        await firestore()
            .collection('profiles')
            .doc(user.email)
            .update({
                color: 'pink',
            })
        Alert.alert("", "Color theme changed!", [
            { text: "OK"}
        ])
    }

    const changeColorOlive = async () => {
        await firestore()
            .collection('profiles')
            .doc(user.email)
            .update({
                color: 'olive',
            })
        Alert.alert("", "Color theme changed!", [
            { text: "OK"}
        ])
    }

    const changeColorForestGreen = async () => {
        await firestore()
            .collection('profiles')
            .doc(user.email)
            .update({
                color: 'forestgreen',
            })
        Alert.alert("", "Color theme changed!", [
            { text: "OK"}
        ])
    }

    const changeColorNavy = async () => {
        await firestore()
            .collection('profiles')
            .doc(user.email)
            .update({
                color: 'navy',
            })
        Alert.alert("", "Color theme changed!", [
            { text: "OK"}
        ])
    }

    return(
        <View style = {styles.main}>
            <ScrollView>
            <Text> Choose your new color theme by pressing the following buttons </Text>
            <TouchableOpacity onPress={() => changeColorRed()}>
                <View style = {styles.red}>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => changeColorOrange()}>
                <View style = {styles.orange}>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => changeColorGreen()}>
                <View style = {styles.green}>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => changeColorBlue()}>
                <View style = {styles.blue}>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => changeColorPurple()}>
                <View style = {styles.purple}>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => changeColorGrey()}>
                <View style = {styles.grey}>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => changeColorBlack()}>
                <View style = {styles.black}>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => changeColorBrown()}>
                <View style = {styles.brown}>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => changeColorYellowGreen()}>
                <View style = {styles.yellowgreen}>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => changeColorGold()}>
                <View style = {styles.gold}>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => changeColorNavy()}>
                <View style = {styles.navy}>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => changeColorPink()}>
                <View style = {styles.pink}>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => changeColorCrimson()}>
                <View style = {styles.crimson}>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => changeColorOlive()}>
                <View style = {styles.olive}>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => changeColorForestGreen()}>
                <View style = {styles.forestgreen}>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => changeColorChocolate()}>
                <View style = {styles.chocolate}>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => changeColorTomato()}>
                <View style = {styles.tomato}>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => changeColorAqua()}>
                <View style = {styles.aqua}>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => changeColorViolet()}>
                <View style = {styles.violet}>
                </View>
            </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    main: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    red: {
        backgroundColor: 'red',
        height: 40,
        width: 40,
        marginBottom: 10,
    },
    orange: {
        backgroundColor: 'orange',
        height: 40,
        width: 40,
        marginBottom: 10,
    },
    green: {
        backgroundColor: 'green',
        height: 40,
        width: 40,
        marginBottom: 10,
    },
    blue: {
        backgroundColor: 'blue',
        height: 40,
        width: 40,
        marginBottom: 10,
    },
    purple: {
        backgroundColor: 'purple',
        height: 40,
        width: 40,
        marginBottom: 10,
    },
    grey: {
        backgroundColor: 'grey',
        height: 40,
        width: 40,
        marginBottom: 10,
    },
    black: {
        backgroundColor: 'black',
        height: 40,
        width: 40,
        marginBottom: 10,
    },
    brown: {
        backgroundColor: 'brown',
        height: 40,
        width: 40,
        marginBottom: 10,
    },
    yellowgreen: {
        backgroundColor: 'yellowgreen',
        height: 40,
        width: 40,
        marginBottom: 10,
    },
    gold: {
        backgroundColor: 'gold',
        height: 40,
        width: 40,
        marginBottom: 10,
    },
    navy: {
        backgroundColor: 'navy',
        height: 40,
        width: 40,
        marginBottom: 10,
    },
    pink: {
        backgroundColor: 'pink',
        height: 40,
        width: 40,
        marginBottom: 10,
    },
    crimson: {
        backgroundColor: 'crimson',
        height: 40,
        width: 40,
        marginBottom: 10,
    },
    olive: {
        backgroundColor: 'olive',
        height: 40,
        width: 40,
        marginBottom: 10,
    },
    forestgreen: {
        backgroundColor: 'forestgreen',
        height: 40,
        width: 40,
        marginBottom: 10,
    },
    chocolate: {
        backgroundColor: 'chocolate',
        height: 40,
        width: 40,
        marginBottom: 10,
    },
    aqua: {
        backgroundColor: 'aqua',
        height: 40,
        width: 40,
        marginBottom: 10,
    },
    violet: {
        backgroundColor: 'violet',
        height: 40,
        width: 40,
        marginBottom: 10,
    },
    tomato: {
        backgroundColor: 'tomato',
        height: 40,
        width: 40,
        marginBottom: 10,
    },
    ButtonLabel: {
        fontSize: 20,
    },
});