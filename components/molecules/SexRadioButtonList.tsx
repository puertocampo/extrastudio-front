import React from "react";
import { StyleSheet, View } from "react-native";
import { CheckBox } from "react-native-elements";

interface IProps {
  sex: string;
  handleChangeSex: (sex: string) => void;
  style?: any;
}

const sexItems = [
  {
    label: "男性",
    value: "male"
  },
  {
    label: "女性",
    value: "female"
  }
]

const SexRadioButtonList = (props: IProps) => {
  const { sex } = props;
  return (
    <View style={{ ...props.style, ...styles.wrapper }}>
      {
        sexItems.map(sexItem => {
          return (
            <CheckBox
              title={sexItem.label}
              checkedIcon='dot-circle-o'
              uncheckedIcon='circle-o'
              checked={sex === sexItem.value}
              containerStyle={styles.formRadioButton}
              checkedColor="#4D7DF9"
              onPress={() => {
                props.handleChangeSex(sexItem.value)
              }}
            />
          )
        })
      }
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