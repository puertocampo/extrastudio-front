import React, { Component } from "react";
import { StyleSheet, Text, View, Button, AsyncStorage } from "react-native";
import Firebase from "../firebase";
// import { IUser } from "./type/user";

// interface IState {
//   isLoggedIn: Boolean;
//   user: IUser;
// }

// export default class LoginScreen extends Component<any, IState> {
export default class SelectionScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      user: {
        email: "",
        name: ""
      }
    };
    console.log("constructor");
    try {
      // firebase 操作の初期化 と Firebase class のインスタンス化
      Firebase.firebaseInitialize();
      console.log("firebaseInitialize");
    } catch {
      console.log("release");
    }
  }

  // async componentDidMount() {
  //   const user = await Firebase.fetchCurrentUser();
  //   this.setState({
  //     isLoggedIn: !!user,
  //     user: {
  //       email: user ? user.email : "",
  //       name: user ? user.displayName : ""
  //     }
  //   });
  //   console.log("componentDidMount", user);
  // }

  async componentDidMount() {
    this.fetchCurrentLoggedInUser();
  }

  fetchCurrentLoggedInUser = () => {
    Firebase.fetchCurrentUser().then(firebaseUser => {
      this.setState({
        isLoggedIn: !!firebaseUser,
        user: {
          email: firebaseUser ? firebaseUser.email : "",
          name: firebaseUser ? firebaseUser.displayName : ""
        }
      });
    });
  };

  handleLogIn = () => {
    Firebase.handleLogIn().then(
      // (firebaseUser: firebase.auth.UserCredential) => {
      firebaseUser => {
        this.setState({
          isLoggedIn: true,
          user: {
            email: firebaseUser.user.email,
            name: firebaseUser.user.displayName
          }
        });
      })
  };

  handleLogout = () => {
    Firebase.handleLogOut().then(() => {
      this.setState({
        isLoggedIn: false,
        user: {
          email: "",
          name: ""
        }
      });
    });
  };

  render() {
    return (
      <View style= { styles.container } >
      <Button
        onPress={ this.handleLogIn }
    title = "Login With Google"
    color = "#ff0000"
      />
    {
      this.state.isLoggedIn && (
        <View>
        <Text>
        Hello, { this.state.user.name }({ this.state.user.email })
        </Text>
        < Button
          onPress={ this.handleLogout }
          title="Logout from Google"
          color="#0000ff"
      />
      </View>
      )
    }
      </View>
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
