import React from "react";
import { StyleSheet, View } from "react-native";
import { CheckBox } from "react-native-elements";

interface IProps {
  interestItems: { label: string, value: string }[];
  interestsState: any;
  handleCheckInterest: (interestId: string, checked: boolean) => void;
  style?: any;
}

const InterestCheckBoxList = (props: IProps) => {
  const { interestItems, interestsState } = props;
  return (
    <View style={{ ...props.style, ...styles.wrapper }}>
      {
        interestItems.map(interestItem => {
          return (
            <CheckBox
              title={interestItem.label}
              checked={interestsState[interestItem.value]}
              containerStyle={styles.formCheckBox}
              checkedColor="#4D7DF9"
              onPress={() => {
                props.handleCheckInterest(interestItem.value, !interestsState[interestItem.value])
              }}
            />
          )
        })
      }
    </View>
  );
}

InterestCheckBoxList.defaultProps = {
  interestItems: [],
  interestsState: {}
};

export default InterestCheckBoxList

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around"
  },
  formCheckBox: {
    width: 130,
    backgroundColor: "#fff",
    borderColor: "#fff"
  }
});