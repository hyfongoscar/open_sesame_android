import React, { useContext, useEffect, useState } from 'react'
import { Alert, StyleSheet, View, Text } from 'react-native'
import { Button, Title } from 'react-native-paper'

import { AccountAuthContext } from '../contexts/AccountAuthContext'
import { ThemeContext } from '../contexts/ThemeContext'

export default function VoiceEnrollScreen({ navigation }) {

  const { user } = useContext(AccountAuthContext)
  const { theme, getSecondaryColor } = useContext(ThemeContext)

  useEffect(() => {
    if (!user)
      Alert.alert("Error", "User not found!", [
        { text: "Go Back To Login", onPress: () => navigation.navigate("Login") }
      ])
  }, [])

  return (
      <View style={styles.container}>
        <Title style={styles.titleText(theme)}>Enroll your voiceprint</Title>
        <Text style={styles.instructions}>To start using this application, you must first enroll your voiceprint</Text>
        <Text style={styles.instructions}>Record yourself saying a series of numbers.</Text>
        <Text style={styles.instructions}>Your voice will be saved in your account.</Text>
        <Button
          color={getSecondaryColor(theme.color)}
          labelStyle={{color: "black"}}
          mode="contained"
          onPress={() => navigation.navigate("VoiceRecording", {
            option: "enroll"
          })}
        >Start Enrollment</Button>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructions: {
    color: "grey",
    margin: 10,
    fontSize: 18,
  },
  titleText: (theme) => ({
    color: theme.color,
    fontSize: 32,
    marginBottom: 10,
  }),
});
