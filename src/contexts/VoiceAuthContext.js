import React, { createContext, useState } from 'react';
// import AudioRecorderPlayer from 'react-native-audio-recorder-player'
import AudioRecord from 'react-native-audio-record'
import storage from '@react-native-firebase/storage';

export const VoiceAuthContext = createContext();

const VoiceAuthContextProvider = ({ children }) => {
  const [recording, setRecording] = useState(false)
  const [recordSecs, setRecordSecs] = useState()
  const [recordTime, setRecordTime] = useState()

  // const audioRecorderPlayer = new AudioRecorderPlayer()
  const options = {
    sampleRate: 16000,
    channels: 1,
    bitsPerSample: 16,
    audioSource: 6,
    wavFile: 'test.wav'
  };

  const onStartRecord = async () => {
    AudioRecord.init(options);
    AudioRecord.start();
    setRecording(true)
  };

  const onStopRecord = async (option) => {
    audioFile = await AudioRecord.stop();
    referenceUrl = 'voicedata/user1/enroll.wav'
    setRecording(false)
    const reference = storage().ref(referenceUrl);
    await reference.putFile(audioFile).then(() => {
      console.log('Audio uploaded to the bucket!');
    });
    const url = await reference.getDownloadURL();

    let result = false;
    
    switch(option) {
      case 'enroll':
        console.log(`{"url": ${url}}`)
        await fetch('http://35.215.162.230:8080/enroll', {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: `{"url": "${url}"}`
        }).then((response) => {
          result = true
        }).catch((error) => {
          console.log(error)
        });
      case 'verify':
      default:
    }
    return result
  };

  return (
      <VoiceAuthContext.Provider
          value={{
            recording,
            recordSecs,
            recordTime,
            onStartRecord,
            onStopRecord
          }}
      >
        {children}
      </VoiceAuthContext.Provider>
  );
};

export default VoiceAuthContextProvider
