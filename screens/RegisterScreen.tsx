import React, { Component } from "react";
import { StyleSheet, Text, View, Platform, TextInput, DatePickerIOS, Picker, ScrollView } from "react-native";
import { Button } from "react-native-elements";
import Constants from 'expo-constants';

import { connect } from 'react-redux';
import * as actions from '../actions';
import { bindActionCreators } from 'redux';

const isIos = Platform.OS === 'ios'

interface IProps { };

interface IState {
  name: string;
  birthDate: Date;
  profession: string;
}

enum ProfessionId {
  default = "",
  a = "a",
  b = "b",
  c = "c"
}

const professionItems = [
  {
    label: "選択してください",
    value: ProfessionId.default
  },
  {
    label: "すごい人",
    value: ProfessionId.a
  }, {
    label: "とてもすごい人",
    value: ProfessionId.b
  },
  {
    label: "とっってもすごい人",
    value: ProfessionId.c
  }
]

class RegisterScreen extends Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      birthDate: new Date(),
      profession: ""
    }
  }

  async componentDidMount() {
    // this.props.registerUser(this.props.user);
    // this.props.navigation.navigate('selection');
  }

  handleChangeName = (name: string) => {
    this.setState({ name });
  }

  handleChangeDate = (date: Date) => {
    this.setState({ birthDate: date });
  }

  handleChangeProfession = (profession: string) => {
    this.setState({ profession });
  }

  render() {
    const { name, birthDate, profession } = this.state;
    return (
      <ScrollView style={styles.wrapper}>
        <Text
          style={styles.formTitle}
        >
          ニックネーム
        </Text>
        <TextInput onChangeText={this.handleChangeName}
          value={name} placeholder="入力してください" />
        <Text
          style={styles.formTitle}
        >
          生年月日
        </Text>
        {
          isIos ?
            <DatePickerIOS
              date={birthDate}
              onDateChange={this.handleChangeDate}
            /> : null
        }
        <Text
          style={styles.formTitle}
        >
          性別
        </Text>
        <Text
          style={styles.formTitle}
        >
          職業
        </Text>
        <Picker
          selectedValue={profession}
          onValueChange={this.handleChangeProfession}
        >
          {
            professionItems.map(profession => {
              return <Picker.Item label={profession.label} value={profession.value} />
            })
          }
        </Picker>
        <Text
          style={styles.formTitle}
        >
          現在お住まいの都道府県
        </Text>
        <Text
          style={styles.formTitle}
        >
          興味のあるジャンル
        </Text>
        <Text
          style={styles.formTitle}
        >
          興味のあるワード
        </Text>
        <View style={styles.registerButtonContainer}>
          <Button
            title="登録"
            buttonStyle={{
              width: 160,
              height: 50,
              backgroundColor: "#4D7DF9",
              borderRadius: 25,
            }}
            titleStyle={{
              color: "#FFFFFF",
              fontWeight: "bold"
            }}
            onPress={() => {
              console.log('nice!');
            }}
          />
        </View >
      </ScrollView >
    )
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

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#fff",
    position: "absolute",
    paddingTop: Constants.statusBarHeight,
    paddingBottom: Constants.statusBarHeight,
    paddingLeft: 20,
    paddingRight: 20,
    left: 0,
    top: 0
  },
  formTitle: {
    fontSize: isIos ? 18 : 12,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#707070"
  },
  formInput: {
    fontSize: isIos ? 18 : 12,
    width: "100%",
    height: 40,
    borderColor: "#CDD6DD"
  },
  registerButtonContainer: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  }
});