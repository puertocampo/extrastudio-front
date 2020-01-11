import React, { Component } from "react";
import { StyleSheet, Text, View, AsyncStorage } from "react-native";
import { Button } from "react-native-elements";
import Firebase from "../firebase";

import { connect } from 'react-redux';
import * as actions from '../actions';
import { bindActionCreators } from 'redux';

class LoginScreen extends Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
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
    const stateUser = this.props.user.user;
    const isLoggedIn = !!stateUser.userId;
    return (
      <View style={styles.container} >
        <Button
          title="Login With Google"
          style={{ marginBottom: 20 }}
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
          onPress={this.props.login}
        />
        {
          isLoggedIn && (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Text
                style={{ marginBottom: 20 }}
              >
                Hello, {stateUser.name} ({stateUser.email})
              </Text>
              <Button
                title="Logout With Google"
                style={{ marginBottom: 20 }}
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
                style={{ marginBottom: 20 }}
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


const mapStateToProps = (state) => {
  return {
    user: state.user
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);