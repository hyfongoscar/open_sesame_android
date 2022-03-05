import React, { useContext, useState, useEffect } from 'react';
import { Alert, Dimensions, StyleSheet, View,  ScrollView } from 'react-native';
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
        <View>
            <ScrollView>
            <Text> Choose your new color theme by pressing the following buttons </Text>
            <Button
                color="#ff0000"
                labelStyle={styles.ButtonLabel}
                uppercase={false}
                onPress={ () => changeColorRed() }
            >Red </Button>
            <Button
                color="#ffa500"
                labelStyle={styles.ButtonLabel}
                uppercase={false}
                onPress={ () => changeColorOrange() }
            >Orange </Button>
            <Button
                color="#008000"
                labelStyle={styles.ButtonLabel}
                uppercase={false}
                onPress={ () => changeColorGreen() }
            >Green </Button>
            <Button
                color="#0000ff"
                labelStyle={styles.ButtonLabel}
                uppercase={false}
                onPress={ () => changeColorBlue() }
            >Blue </Button>
            <Button
                color="#800080"
                labelStyle={styles.ButtonLabel}
                uppercase={false}
                onPress={ () => changeColorPurple() }
            >Purple </Button>
            <Button
                color="#808080"
                labelStyle={styles.ButtonLabel}
                uppercase={false}
                onPress={ () => changeColorGrey() }
            >Grey </Button>
            <Button
                color="#000000"
                labelStyle={styles.ButtonLabel}
                uppercase={false}
                onPress={ () => changeColorBlack() }
            >Black </Button>
            <Button
                color="#a52a2a"
                labelStyle={styles.ButtonLabel}
                uppercase={false}
                onPress={ () => changeColorBrown() }
            >Brown </Button>
            <Button
                color="#9acd32"
                labelStyle={styles.ButtonLabel}
                uppercase={false}
                onPress={ () => changeColorYellowGreen() }
            >Yellow Green </Button>
            <Button
                color="#ffd700"
                labelStyle={styles.ButtonLabel}
                uppercase={false}
                onPress={ () => changeColorGold() }
            >Gold </Button>
            <Button
                color="#000080"
                labelStyle={styles.ButtonLabel}
                uppercase={false}
                onPress={ () => changeColorNavy() }
            >Navy </Button>
            <Button
                color="#ffc0cb"
                labelStyle={styles.ButtonLabel}
                uppercase={false}
                onPress={ () => changeColorPink() }
            >Pink </Button>
            <Button
                color="#dc143c"
                labelStyle={styles.ButtonLabel}
                uppercase={false}
                onPress={ () => changeColorCrimson() }
            >Crimson </Button>
            <Button
                color="#808000"
                labelStyle={styles.ButtonLabel}
                uppercase={false}
                onPress={ () => changeColorOlive() }
            >Olive </Button>
            <Button
                color="#228b22"
                labelStyle={styles.ButtonLabel}
                uppercase={false}
                onPress={ () => changeColorForestGreen() }
            >Forest Green </Button>
            <Button
                color="#d2691e"
                labelStyle={styles.ButtonLabel}
                uppercase={false}
                onPress={ () => changeColorChocolate() }
            >Chocolate </Button>
            <Button
                color="#ff6347"
                labelStyle={styles.ButtonLabel}
                uppercase={false}
                onPress={ () => changeColorTomato() }
            >Tomato </Button>
            <Button
                color="#00ffff"
                labelStyle={styles.ButtonLabel}
                uppercase={false}
                onPress={ () => changeColorAqua() }
            >Aqua </Button>
            <Button
                color="#ee82ee"
                labelStyle={styles.ButtonLabel}
                uppercase={false}
                onPress={ () => changeColorViolet() }
            >Violet </Button>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    ButtonLabel: {
        fontSize: 20,
    },
});