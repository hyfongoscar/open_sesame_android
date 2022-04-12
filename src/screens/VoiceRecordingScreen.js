import React, { useContext, useState, useEffect } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native'
import NetInfo from "@react-native-community/netinfo";

import { VoiceAuthContext } from '../contexts/VoiceAuthContext'
import { ThemeContext } from '../contexts/ThemeContext'
import { LoadingContext } from '../contexts/LoadingContext'

import Loading from '../components/Loading'
import { MaterialCommunityIcons } from '../components/Icons'

export default function VoiceEnrollScreen({ route, navigation }) {
  const { option } = route.params
  
  const [ recordText, setRecordText ] = useState('')
  const [ randNum, setRandNum ] = useState('')

  const { recording, onStartRecord, onStopEnroll, onStopVerify } = useContext(VoiceAuthContext)
  const { theme, getSecondaryColor } = useContext(ThemeContext)
  const { loading, setLoading } = useContext(LoadingContext)

  useEffect(() => {
    NetInfo.fetch().then(networkState => {
      if (!networkState.isConnected)
        Alert.alert("You are now offline.", "You will not be able to upload your voiceprint.")
    });

    var digits = [0,1,2,3,4,5,6,7,8,9],
      randNums = [],
      j = 0

    // generate non-repeating 6-digit number
    while (randNums.length < 4) {
      j = Math.floor(Math.random() * digits.length);
      randNums.push(digits[j]);
      digits.splice(j,1);
    }
    setRandNum(randNums.join(''))
  }, [])

  return (
      <View style={styles.container}>
        <Text style={styles.instructions}>Record yourself saying the following numbers:</Text>
        <Text style={styles.titleText(theme)}> { randNum } </Text>
        <TouchableOpacity
          style={styles.recordOverlay(getSecondaryColor(theme.color))} 
          onPress={ async () => {
            if (!recording){
              onStartRecord()
              setRecordText("Recording...")
            } else {
              setRecordText((option === 'enroll') ? "Enrollment in process..." : "Verification in process...")
              setLoading(true)
              if (option === "enroll") {
                const result = await onStopEnroll().catch((err) => {
                  Alert.alert("Enrollment failed", err.message)
                })
                setRecordText("")
                setLoading(false)
                if (result) {
                  Alert.alert("Enrollment complete", "Your voice will be saved in your account. You can always enroll again for a different voiceprint", [
                    { text: "OK", onPress: () => navigation.navigate('Message') }
                  ]) 
                }
              }
              else if (option === "verify") {
                const results = await onStopVerify(randNum, navigation).catch((err) => {
                  Alert.alert("Verification failed", err.message)
                })
                setRecordText("")
                setLoading(false)
                if (Object.values(results).every(item => item == true)) {
                  Alert.alert("Verification success", `You can now view the message. Verification will expire after ${theme.verificationTime} minutes.`, [
                    { text: "OK", onPress: () => navigation.popToTop() } 
                  ])
                }
                else if (!results.networkSuccess) {
                  Alert.alert("Verification failed", "This is probably a problem on our side. Please try again.", [
                    { text: "OK", onPress: () => setRecordText("") } 
                  ]) 
                }
                else if (!results.speechPassed) {
                  Alert.alert("Verification failed", "The spoken digits are incorrect. Please try again. (Try talking louder and closer to your mic)", [
                    { text: "OK", onPress: () => setRecordText("") } 
                    // TODO: after binding the verification with locaked message, navigate back to the corresponding chat
                  ]) 
                }
                else {
                  Alert.alert("Verification failed", "Your voice data does not match our voice data on the database.", [
                    { text: "OK", onPress: () => navigation.goBack() } 
                  ]) 
                }
              }
            }
          }}
        >
          {recording ? <MaterialCommunityIcons name="microphone-settings" size={30} color="black" /> 
            : <MaterialCommunityIcons name="microphone" size={30} color="black" />}
        </TouchableOpacity>
        <Text
          style={styles.recordText(theme)}
        >{ recordText }</Text>
        { loading ?  (<Loading/>) :  (<></>)}
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "f5f5f5",
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructions: {
    margin: 10,
    fontSize: 18,
    color: "black"
  },
  recordOverlay: (color) => ({
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: color,
    alignItems:'center',
    justifyContent:'center',
  }),
  recordText: (theme) => ({
    fontSize: 18,
    color: theme.color,
  }),
  titleText: (theme) => ({
    fontSize: 32,
    marginBottom: 10,
    color: theme.color,
  }),
});
