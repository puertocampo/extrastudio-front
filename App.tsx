import React, { Component } from "react";
import { StyleSheet, Text, View, Button, AsyncStorage, StatusBar } from "react-native";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import Firebase from "./firebase";
import { Provider } from "react-redux";
import store from "./store";

import WelcomeScreen from "./screens/WelcomeScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import SelectionScreen from "./screens/SelectionScreen";

import { IUser } from "./type/user";

interface IState {
  isLoggedIn: boolean;
  user: IUser;
}

export default class App extends Component<any, IState> {
  render() {
    const NavigatorTab = createAppContainer(
      createSwitchNavigator({
        // welcome: { screen: WelcomeScreen },
        // login: { screen: LoginScreen },
        // register: { screen: RegisterScreen },
        selection: { screen: SelectionScreen }
      })
    );
    Firebase.firebaseInitialize();

    return (
      <Provider store={store}>
        <View style={styles.container}>
          <StatusBar barStyle="light-content" />
          <NavigatorTab />
        </View>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
