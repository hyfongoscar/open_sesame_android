import React, { useContext } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';
import { AccountAuthContext } from '../contexts/AccountAuthContext'

export default function SettingScreen({ navigation }) {
    const { logout } = useContext(AccountAuthContext)
    return(
        <View style={styles.container}>
            <Button
                mode="contained"
                style={styles.button}
                onPress={() => navigation.navigate('ChangeUsername')}
            > Change username </Button>
            <Button
                mode="contained"
                style={styles.button}
                onPress={() => navigation.navigate('VoiceEnroll')}
            > Enroll Voiceprint </Button>
            <Button
                mode="contained"
                style={styles.button}
                onPress={async () => {
                  logout();
                }}
            >Log out</Button>
            <Button
                mode="contained"
                style={styles.button}
                onPress={async () => navigation.navigate('FriendRequest')}
            >Add friends</Button>
        </View>
    );
}

const { width, height } = Dimensions.get('screen');

const styles = StyleSheet.create({
  button: {
    marginTop: 10,
  },
  container: {
    flex: 1, 
    paddingLeft: 20,
    paddingRight: 20,
    alignItems: 'center', 
    justifyContent: 'center'
  },
});
