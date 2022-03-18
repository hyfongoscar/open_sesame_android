import React, { useContext, useState, useEffect } from 'react';
import { Alert, FlatList, StyleSheet, View,  ScrollView, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';

import { AccountAuthContext } from '../contexts/AccountAuthContext'
import { ThemeContext } from '../contexts/ThemeContext'

export default function ChangeColorScreen({ navigation }) {
    const { user } = useContext(AccountAuthContext)
    const { theme, colorPairs } = useContext(ThemeContext)
  
    const changeColor = async (color) => {
        await firestore()
            .collection('profiles')
            .doc(user.email)
            .update({
              color
            })
        Alert.alert("", "Color theme changed!", [
            { text: "OK"}
        ])
    }

    return(
        <View style = {styles.main}>
          <ScrollView>
            <Text style = {styles.label(theme)}>Choose your new color theme</Text>
            <FlatList
              data ={colorPairs}
              keyExtractor={(_, index) => index}
              numColumns={5}
              renderItem={({item}) => (
                <TouchableOpacity onPress={() => changeColor(item.primary)}>
                    <View style = {styles.colorView(item.primary)}></View>
                </TouchableOpacity>
              )}
            />
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
    colorView: (color) =>  ({
      backgroundColor: color,
      height: 50,
      width: 50,
      margin: 10,
    }),
    label: (theme) =>  ({
      fontSize: theme.font,
      padding: 10,
    }),
    ButtonLabel: {
        fontSize: 20,
    },
});
