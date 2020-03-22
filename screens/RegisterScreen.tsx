import React, { Component } from "react";
import { StyleSheet, Text, View, Platform, TextInput, DatePickerIOS, Picker, ScrollView } from "react-native";
import { Button, CheckBox } from "react-native-elements";
import Constants from 'expo-constants';
import { SexRadioButtonList } from "../components/molecules";

import { connect } from 'react-redux';
import * as actions from '../actions';
import { bindActionCreators } from 'redux';

const isIos = Platform.OS === 'ios'

interface IProps { };

interface IState {
  name: string;
  birthDate: Date;
  sex: string;
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
      sex: "",
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

  handleChangeSex = (sex: string) => {
    this.setState({ sex });
  }

  handleChangeProfession = (profession: string) => {
    this.setState({ profession });
  }

  render() {
    const { name, birthDate, sex, profession } = this.state;
    const birthDateJa = `${birthDate.getFullYear()}年 ${birthDate.getMonth() + 1}月 ${birthDate.getDate()}日`;
    return (
      <ScrollView style={styles.wrapper}>
        <Text
          style={styles.formTitle}
        >
          ニックネーム
        </Text>
        <TextInput
          style={styles.formInput}
          onChangeText={this.handleChangeName}
          value={name}
          placeholder="入力してください"
        />
        <Text
          style={styles.formTitle}
        >
          生年月日
        </Text>
        <TextInput
          style={styles.formInput}
          value={birthDateJa}
          placeholder="日付を選択してください"
          onFocus={() => {
            console.log("focus");
          }}
        />
        {
          isIos ?
            <DatePickerIOS
              date={birthDate}
              onDateChange={this.handleChangeDate}
              mode="date"
              locale="ja"
            /> : null
        }
        <Text
          style={styles.formTitle}
        >
          性別
        </Text>
        <SexRadioButtonList
          sex={sex}
          handleChangeSex={this.handleChangeSex}
          style={{ marginBottom: 20 }}
        />
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
        <CheckBox
          title="家族"
          checked={true}
          containerStyle={styles.formCheckBox}
          checkedColor="#4D7DF9"
        />
        <Text
          style={styles.formTitle}
        >
          興味のあるワード
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
    color: "#707070",
    marginBottom: 10
  },
  formInput: {
    fontSize: isIos ? 18 : 12,
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#CDD6DD",
    paddingLeft: 20,
    paddingTop: 12,
    paddingBottom: 12,
    marginBottom: 20
  },
  formCheckBox: {
    width: 100,
    backgroundColor: "#fff",
    borderColor: "#fff"
  },
  registerButtonContainer: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  }
});