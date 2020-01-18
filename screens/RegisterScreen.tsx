import React, { Component } from "react";
import { StyleSheet, Text, View, AsyncStorage } from "react-native";
import { Button } from "react-native-elements";

import { connect } from 'react-redux';
import * as actions from '../actions';
import { bindActionCreators } from 'redux';

class RegisterScreen extends Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    this.props.registerUser();
    this.props.navigation.navigate('selection');
  }

  render() {
    return null;
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterScreen);