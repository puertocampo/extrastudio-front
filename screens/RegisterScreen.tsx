import React, { Component } from "react";
import { StyleSheet, Text, View, Platform, TextInput, DatePickerIOS, Picker, ScrollView, TouchableHighlight } from "react-native";
import { Button } from "react-native-elements";
import shortid from "shortid";
import Constants from 'expo-constants';
import { SexRadioButtonList, GenreCheckBoxList, KeywordsList } from "../components/molecules";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import { connect } from 'react-redux';
import * as actions from '../actions';
import { bindActionCreators } from 'redux';

const isIos = Platform.OS === 'ios'

interface IProps { };

interface IState {
  name: string;
  birthDate: Date | null;
  sex: string;
  profession: string;
  genres: any;
  keywords: { label: string; value: string }[];
  keywordInput: string;
  isBirthDateModalOpening: boolean;
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

enum GenreId {
  family = "family",
  date = "date",
  child = "child",
  alone = "alone",
  free = "free",
  business = "business",
  learning = "learning",
  grownup = "grownup",
  encounter = "encounter",
  instagenic = "instagenic",
  women = "women",
  music = "music"
}

const genreItems = [
  {
    label: "家族",
    value: GenreId.family
  },
  {
    label: "デート",
    value: GenreId.date
  },
  {
    label: "こども向け",
    value: GenreId.child
  },
  {
    label: "1人OK",
    value: GenreId.alone
  },
  {
    label: "無料",
    value: GenreId.free
  },
  {
    label: "ビジネス",
    value: GenreId.business
  },
  {
    label: "知る・学ぶ",
    value: GenreId.learning
  },
  {
    label: "大人",
    value: GenreId.grownup
  },
  {
    label: "出会い",
    value: GenreId.encounter
  },
  {
    label: "インスタ映え",
    value: GenreId.instagenic
  },
  {
    label: "女性向け",
    value: GenreId.women
  },
  {
    label: "音楽",
    value: GenreId.music
  }
]

class RegisterScreen extends Component<IProps, IState> {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      birthDate: null,
      sex: "",
      profession: "",
      genres: {
        family: true,
        date: false,
        child: false,
        alone: false,
        free: false,
        business: false,
        learning: false,
        grownup: false,
        encounter: false,
        instagenic: false,
        women: false,
        music: false
      },
      keywords: [],
      keywordInput: "",
      isBirthDateModalOpening: false
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
    this.closeBirthDateModal();
  }

  handleChangeSex = (sex: string) => {
    this.setState({ sex });
  }

  handleChangeProfession = (profession: string) => {
    this.setState({ profession });
  }

  handleCheckGenre = (genreId: GenreId, checked: boolean) => {
    this.setState({
      genres: {
        ...this.state.genres,
        [genreId]: checked
      }
    });
  }

  openBirthDateModal = () => {
    this.setState({ isBirthDateModalOpening: true })
  }

  closeBirthDateModal = () => {
    this.setState({ isBirthDateModalOpening: false })
  }

  handleChangeKeywordInput = (keywordInput: string) => {
    this.setState({ keywordInput });
  }

  handleAddKeyword = () => {
    if (!this.state.keywordInput) {
      return;
    }
    const keywordId = shortid.generate();
    this.setState({
      keywords: [...this.state.keywords, { label: this.state.keywordInput, value: keywordId }],
      keywordInput: ""
    });
  }

  handleDeleteKeyword = (keywordId: string) => {
    const updatedKeywords = this.state.keywords.filter(_keyword => _keyword.value !== keywordId);
    this.setState({ keywords: updatedKeywords });
  }

  render() {
    const { name, birthDate, sex, profession, genres, keywords, keywordInput, isBirthDateModalOpening } = this.state;
    const birthDateJa = birthDate ? `${birthDate.getFullYear()}年 ${birthDate.getMonth() + 1}月 ${birthDate.getDate()}日` : "日付を選択してください";
    const initialBirthDate = () => {
      let nowDate = new Date();
      nowDate.setFullYear(nowDate.getFullYear() - 20);
      return nowDate;
    }
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
          placeholderTextColor="#CDD6DD"
        />
        <Text
          style={styles.formTitle}
        >
          生年月日
        </Text>
        <Text
          style={birthDate ? styles.formInput : styles.formInputPlaceholder}
          onPress={this.openBirthDateModal}
        > {birthDateJa}
        </Text>
        <DateTimePickerModal
          isVisible={isBirthDateModalOpening}
          mode="date"
          locale="ja"
          date={initialBirthDate()}
          onConfirm={this.handleChangeDate}
          onCancel={this.closeBirthDateModal}
        />
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
        <GenreCheckBoxList
          style={{ marginBottom: 20 }}
          genreItems={genreItems}
          genresState={genres}
          handleCheckGenre={this.handleCheckGenre}
        />
        <Text
          style={styles.formTitle}
        >
          興味のあるワード
        </Text>
        <View style={styles.formInputWithButton}>
          <TextInput
            style={styles.formInputHalf}
            onChangeText={this.handleChangeKeywordInput}
            value={keywordInput}
            placeholder="入力してください"
            placeholderTextColor="#CDD6DD"
          />
          <Button
            title="追加"
            buttonStyle={{
              width: "60%",
              height: 50,
              backgroundColor: "#4D7DF9",
              borderRadius: 25,
              marginLeft: 30
            }}
            titleStyle={{
              color: "#FFFFFF",
              fontWeight: "bold"
            }}
            onPress={this.handleAddKeyword}
          />
        </View>
        <KeywordsList
          keywords={keywords}
          handleDeleteKeyword={this.handleDeleteKeyword}
          style={{ marginBottom: 20 }}
        />
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
    paddingTop: 15,
    paddingBottom: 15,
    marginBottom: 20
  },
  formInputWithButton: {
    width: "100%",
    flexDirection: "row",
    marginBottom: 20
  },
  formInputHalf: {
    fontSize: isIos ? 18 : 12,
    width: "60%",
    height: 50,
    borderWidth: 1,
    borderColor: "#CDD6DD",
    paddingLeft: 20,
    paddingTop: 15,
    paddingBottom: 15
  },
  formInputPlaceholder: {
    flex: 1,
    fontSize: isIos ? 18 : 12,
    color: "#CDD6DD",
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#CDD6DD",
    paddingLeft: 20,
    paddingTop: 15,
    paddingBottom: 15,
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