import React, { useContext, useState } from 'react';
import { Alert, Dimensions, StyleSheet, View } from 'react-native';
import { Button, Text, Title, TextInput } from 'react-native-paper';

import { AccountAuthContext } from '../contexts/AccountAuthContext'

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { login } = useContext(AccountAuthContext)

  const handleLogin = () => {
    login(email, password)
      .catch(({ code, message }) => {
        switch (code) {
          case "auth/invalid-email":
            Alert.alert("", "Please enter a valid email address.")
            break
          case "auth/user-not-found":
            Alert.alert("", "This email is not registered yet! Please check your input, or sign up first.", [
              { text: "Sign up" , onPress: () => navigation.navigate("Signup")},
              { text: "Cancel" }
            ])
            break
          case "auth/wrong-password":
            Alert.alert("", "Incorrect password!", [
              // { text: "Forget password" , onPress: () => navigation.navigate("Signup")},
              { text: "Ok" }
            ])
            break
          case "auth/too-many-requests":
            Alert.alert("", "You have tried too many times. Please try again later or reset your password.", [
              // { text: "Forget password" , onPress: () => navigation.navigate("Signup")},
              { text: "Ok" }
            ])
            break
          default:
            Alert.alert("Login failed", message + " (Error Code: " + code + ")")
        }
      })
  }

  toggleRememberMe = value => {
    this.setState({ rememberMe: value })
      if (value === true) {
    //user wants to be remembered.
      this.rememberUser();
    } else {
      this.forgetUser();
    }
  }

  rememberUser = async () => {
  try {
    await AsyncStorage.setItem('YOUR-KEY', this.state.username);
  } catch (error) {
    // Error saving data
  }
  };
  getRememberedUser = async () => {
  try {
    const username = await AsyncStorage.getItem('YOUR-KEY');
    if (username !== null) {
      // We have username!!
      return username;
    }
  } catch (error) {
    // Error retrieving data
  }
  };

  forgetUser = async () => {
    try {
      await AsyncStorage.removeItem('Longtail-User');
    } catch (error) {
     // Error removing
    }
  };

  async componentDidMount() {
  const username = await this.getRememberedUser();
  this.setState({
     username: username || "",
     rememberMe: username ? true : false });
  }

  return (
      <View style={styles.container}>
        <Title style={styles.titleText}>Open Sesame</Title>
        <TextInput
            label="Email"
            style={styles.input}
            value={email}
            numberOfLines={1}
            autoCapitalize="none"
            onChangeText={(email) => setEmail(email)}
        />
        <TextInput
            label="Password"
            style={styles.input}
            value={password}
            numberOfLines={1}
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)}
        />
        <Button
            mode="contained"
            style={styles.button}
            contentStyle={styles.buttonContainer}
            labelStyle={styles.loginButtonLabel}
            onPress={() => {
               if (email && password)
                 handleLogin()
               else
                 Alert.alert("Invalid credentials", "Please enter both email and password!")
            }}
        > Login </Button>
        <Button
            mode="text"
            uppercase={false}
            style={styles.button}
            contentStyle={styles.buttonContainer}
            labelStyle={styles.navButtonText}
            onPress={() => navigation.navigate('Signup')}
        > Sign up here </Button>
        <Switch
          value={this.state.rememberMe}
          onValueChange={(value) => this.toggleRememberMe(value)}
          /><Text>Remember Me</Text>
      </View>
  );
}

const { width, height } = Dimensions.get('screen');

const styles = StyleSheet.create({
  button: {
    marginTop: 10,
  },
  buttonContainer: {
    width: width / 3,
    height: height / 15,
  },
  container: {
    backgroundColor: '#f5f5f5',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    marginTop: 10,
    marginBottom: 10,
    width: width / 2,
    height: height / 15,
  },
  loginButtonLabel: {
    fontSize: 22,
  },
  titleText: {
    fontSize: 24,
    marginBottom: 10,
  },
});
