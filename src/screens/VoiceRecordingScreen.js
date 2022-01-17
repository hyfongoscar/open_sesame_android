import React, { useContext, useState } from 'react'
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native'
import { Button, Title } from 'react-native-paper'

import { VoiceAuthContext } from '../contexts/VoiceAuthContext'


export default function VoiceEnrollScreen({ route, navigation }) {
  const { option } = route.params
  const { recording, recordSecs, recordTime, onStartRecord, onStopRecord } = useContext(VoiceAuthContext)
  const [ recordText, setRecordText ] = useState('')

  return (
      <View style={styles.container}>
        <Text style={styles.instructions}>Record yourself saying the following numbers:</Text>
        <Text style={styles.titleText}>135790</Text>
        <Text style={styles.instructions}>Press the button below to start recording your voice.</Text>
        <Text style={styles.instructions}>Press the button again to stop recording.</Text>
        <Text style={styles.instructions}>Your voice will be saved in your account.</Text>
        <TouchableOpacity style={styles.recordOverlay} >
          <Button
            mode="contained"
            style={styles.recordButton}
            labelStyle={styles.recordButtonLabel}
            onPress={ async () => {
              if (!recording){
                onStartRecord()
              } else {
                setRecordText("Enrolling in process...")
                const success = await onStopRecord(option)
                if (success)
                  navigation.navigate('Message')
                else 
                  setRecordText(`Failed to ${option}, please try again`)
              }
            }}
          >{recording ? "Stop" : "Start"}</Button>
        </TouchableOpacity>
        <Text
          style={styles.recordText}
        >{ recordText }</Text>
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
    color: "black"
  },
  recordButton: {
    width: 100,  
    height: 100,   
    borderRadius: 50,
    backgroundColor: '#00ffff',
    position: 'absolute',
  },
  recordButtonLabel: {
    paddingTop: 33,
    color: '#000000',
  },
  recordOverlay: {
    width:100,
    height:100,
    borderRadius:50,
    borderWidth: 1,
    borderColor:'rgba(0,0,0,0.2)',
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'#fff',
  },
  recordText: {
    fontSize: 22,
    color: '#add8e6',
  },
  titleText: {
    fontSize: 32,
    marginBottom: 10,
  },
});
