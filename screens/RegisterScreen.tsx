import React, { Component } from "react";
import { StyleSheet, Text, View, Platform, TextInput, DatePickerIOS, ScrollView, TouchableHighlight, Switch } from "react-native";
import { Button } from "react-native-elements";
import shortid from "shortid";
import Constants from 'expo-constants';
import { SexRadioButtonList, GenreCheckBoxList, KeywordsList } from "../components/molecules";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import { connect } from 'react-redux';
import * as actions from '../actions';
import { bindActionCreators } from 'redux';
import { GenreId, ProfessionId, prefectureItems } from "../type/enum";
import { IUser } from "../type/user";

const isIos = Platform.OS === 'ios'
import ModalSelector from "react-native-modal-selector"

interface IProps {
  registerUser(reqUser: IUser): void;
  navigation: any;
};

interface IState {
  name: string;
  birthDate: Date | null;
  sex: string;
  profession: string;
  prefecture: string;
  genres: string[];
  keywords: { label: string; value: string }[];
  keywordInput: string;
  isBirthDateModalOpening: boolean;
}

const professionItems = [
  { key: ProfessionId.default, section: true, label: '職業を選択してください' },
  { key: ProfessionId.a, label: "すごい人" },
  { key: ProfessionId.b, label: "とてもすごい人" },
  { key: ProfessionId.c, label: "とっっってもすごい人" }
];

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
      prefecture: "",
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
    if (!profession) return;
    this.setState({ profession });
  }

  handleChangePrefecture = (prefecture: string) => {
    if (!prefecture) return;
    this.setState({ prefecture });
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

  postUser = () => {
    const { name, birthDate, sex, profession, prefecture, genres, keywords } = this.state;
    const reqUser = {
      name, birthDate, sex, profession, prefecture, genres, keywords
    };
    this.props.registerUser(reqUser);
    this.props.navigation.navigate('selection');
  }

  render() {
    const { name, birthDate, sex, profession, prefecture, genres, keywords, keywordInput, isBirthDateModalOpening } = this.state;
    const birthDateJa = birthDate ? `${birthDate.getFullYear()}年 ${birthDate.getMonth() + 1}月 ${birthDate.getDate()}日` : "日付を選択してください";
    const initialBirthDate = () => {
      let nowDate = new Date();
      nowDate.setFullYear(nowDate.getFullYear() - 20);
      return nowDate;
    }
    const selectedProfession = professionItems.find(profession => profession.key === this.state.profession);
    const selectedPrefecture = prefectureItems.find(prefecture => prefecture.value === this.state.prefecture);
    return (
      <ScrollView style={styles.wrapper} contentContainerStyle={{ flexGrow: 1 }}>
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
        <ModalSelector
          data={professionItems}
          selectedKey={profession}
          onChange={option =>
            this.handleChangeProfession(option.key)
          }>
          <TextInput
            style={profession ? styles.formInput : styles.formInputPlaceholder}
            value={selectedProfession ? selectedProfession.label : ""}
            placeholder="職業を選択してください"
            placeholderTextColor="#CDD6DD"
          />
        </ModalSelector>
        <Text
          style={styles.formTitle}
        >
          現在お住まいの都道府県
        </Text>
        <ModalSelector
          data={prefectureItems}
          selectedKey={prefecture}
          onChange={option => this.handleChangePrefecture(option.value)}>
          <TextInput
            style={prefecture ? styles.formInput : styles.formInputPlaceholder}
            value={selectedPrefecture ? selectedPrefecture.label : ""}
            placeholder="都道府県を選択してください"
            placeholderTextColor="#CDD6DD"
          />
        </ModalSelector>
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
            onPress={this.postUser}
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
    flexGrow: 1,
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
  formSelector: {
    fontSize: isIos ? 18 : 12,
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
    alignItems: "center",
    marginBottom: 80
  }
});