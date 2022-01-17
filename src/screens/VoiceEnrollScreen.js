import React, { useContext, useState } from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { Button, Title } from 'react-native-paper'

export default function VoiceEnrollScreen({ navigation }) {
  return (
      <View style={styles.container}>
        <Title style={styles.titleText}>Enroll your voiceprint</Title>
        <Text style={styles.instructions}>Press the button below to start recording your voice.</Text>
        <Text style={styles.instructions}>Press the button again to stop recording.</Text>
        <Text style={styles.instructions}>Your voice will be saved in your account.</Text>
        <Button
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
    margin: 10,
    fontSize: 18,
  },
  titleText: {
    fontSize: 32,
    marginBottom: 10,
  },
});
