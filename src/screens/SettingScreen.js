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
                uppercase={false}
                style={styles.button}
                onPress={() => navigation.navigate('Change Username')}
            > Change Username </Button>
            <Button
                mode="contained"
                uppercase={false}
                style={styles.button}
                contentStyle={styles.buttonContainer}
                labelStyle={styles.navButtonText}
                onPress={() => navigation.navigate('ChangeProfilePic')}
            >Change Profile Picture </Button>
            <Button
                mode="contained"
                uppercase={false}
                style={styles.button}
                onPress={() => navigation.navigate('VoiceEnroll')}
            > Enroll Voiceprint </Button>
            <Button
                mode="contained"
                uppercase={false}
                style={styles.button}
                contentStyle={styles.buttonContainer}
                labelStyle={styles.navButtonText}
                onPress={() => navigation.navigate('ChangeProfilePic')}
            >Change Profile Picture </Button>
            <Button
                mode="contained"
                uppercase={false}
                style={styles.button}
                onPress={async () => {
                    logout();
                }}
            >Log out</Button>
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
