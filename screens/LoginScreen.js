import React, { Component } from "react";
import { StyleSheet, Text, View, AsyncStorage } from "react-native";
import { Button } from "react-native-elements";
import Firebase from "../firebase";
// import { IUser } from "./type/user";

// interface IState {
//   isLoggedIn: Boolean;
//   user: IUser;
// }

// export default class LoginScreen extends Component<any, IState> {
export default class LoginScreen extends Component {
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
          title="Login With Google"
          style={{marginBottom: 20}}
          buttonStyle={{
            width: 200,
            height: 50,
            backgroundColor: "#FF0000",
            borderRadius: 25,
            justifyContent: "center",
          }}
          titleStyle={{
            fontWeight: "bold"
          }}
          onPress={this.handleLogIn}
        />
        {
          this.state.isLoggedIn && (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Text
                style={{marginBottom: 20}}
              >
                Hello, { this.state.user.name } ({ this.state.user.email })
              </Text>
              <Button
                title="Logout With Google"
                style={{marginBottom: 20}}
                buttonStyle={{
                  width: 200,
                  height: 50,
                  backgroundColor: "#0000FF",
                  borderRadius: 25,
                  justifyContent: "center",
                }}
                titleStyle={{
                  fontWeight: "bold"
                }}
                onPress={this.handleLogout}
              />
              <Button
                title="Go to pick up event!"
                style={{marginBottom: 20}}
                buttonStyle={{
                  width: 200,
                  height: 50,
                  backgroundColor: "#00FF00",
                  borderRadius: 25,
                  justifyContent: "center",
                }}
                titleStyle={{
                  fontWeight: "bold"
                }}
                onPress={() => this.props.navigation.navigate('selection')}
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
