import React, { createContext, useState } from 'react';
// import AudioRecorderPlayer from 'react-native-audio-recorder-player'
import AudioRecord from 'react-native-audio-record'
import storage from '@react-native-firebase/storage';

export const VoiceAuthContext = createContext();
const THRESHOLD = 10

const VoiceAuthContextProvider = ({ children }) => {
  const [recording, setRecording] = useState(false)

  // const audioRecorderPlayer = new AudioRecorderPlayer()
  const options = {
    sampleRate: 16000,
    channels: 1,
    bitsPerSample: 16,
    audioSource: 6,
    wavFile: 'test.wav'
  };

  const uploadToFirebase = async (file, referenceUrl) => {
    const reference = storage().ref(referenceUrl);
    await reference.putFile(file).then(() => {
      console.log('Audio uploaded to the bucket!');
    });
    const url = await reference.getDownloadURL();
    return url
  }

  const onStartRecord = async () => {
    AudioRecord.init(options);
    AudioRecord.start();
    setRecording(true)
  };

  const onStopEnroll = async () => {
    audioFile = await AudioRecord.stop();
    setRecording(false)
    const downloadUrl = await uploadToFirebase(audioFile, `voicedata/user1/enroll.wav`)

    var success = false
    await fetch(`http://35.215.162.230:8080/enroll`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: `{"url": "${downloadUrl}", "user": "oscar"}`
    }).then(async (response) => {
      returnResults = await response.json()
      if (returnResults.url === downloadUrl)
        success = true
    }).catch((err) => {
      console.log(err)
    })
    return success
  };

  const onStopVerify = async () => {
    audioFile = await AudioRecord.stop();
    setRecording(false)
    const downloadUrl = await uploadToFirebase(audioFile, `voicedata/user1/verify.wav`)

    var returnObj = {
      networkSuccess: false,
      thresholdPassed: false
    }
    await fetch(`http://35.215.162.230:8080/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: `{"url": "${downloadUrl}", "user": "oscar"}`
    }).then(async (response) => {
      const returnResults = await response.json()
      if (returnResults.url === downloadUrl)
        returnObj.networkSuccess = true
      if (parseFloat(returnResults.score) > THRESHOLD)
        returnObj.thresholdPassed = true
    }).catch((err) => {
      console.log(err)
    })
    return returnObj
  };

  return (
      <VoiceAuthContext.Provider
          value={{
            recording,
            onStartRecord,
            onStopEnroll,
            onStopVerify
          }}
      >
        {children}
      </VoiceAuthContext.Provider>
  );
};

export default VoiceAuthContextProvider
