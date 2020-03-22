import React from "react";
import { StyleSheet, View } from "react-native";
import { CheckBox } from "react-native-elements";

interface IProps {
  sex: string;
  handleChangeSex: (sex: string) => void;
}

const SexRadioButtonList = (props: IProps) => {
  const { sex } = props;
  return (
    <View style={styles.wrapper}>
      <CheckBox
        title="男性"
        checkedIcon='dot-circle-o'
        uncheckedIcon='circle-o'
        checked={sex === "male"}
        containerStyle={styles.formRadioButton}
        checkedColor="#4D7DF9"
        onPress={() => {
          props.handleChangeSex("male")
        }}
      />
      <CheckBox
        title="女性"
        right
        checkedIcon='dot-circle-o'
        uncheckedIcon='circle-o'
        checked={sex === "female"}
        containerStyle={styles.formRadioButton}
        checkedColor="#4D7DF9"
        onPress={() => {
          props.handleChangeSex("female")
        }}
      />
    </View>
  );
}

SexRadioButtonList.defaultProps = {
  sex: ""
};

export default SexRadioButtonList

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    justifyContent: "space-between",
    paddingLeft: "20%",
    paddingRight: "20%",
    flexDirection: "row"
  },
  formRadioButton: {
    width: 100,
    backgroundColor: "#fff",
    borderColor: "#fff"
  }
});