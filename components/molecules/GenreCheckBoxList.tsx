import React from "react";
import { StyleSheet, View } from "react-native";
import { CheckBox } from "react-native-elements";

interface IProps {
  genreItems: { label: string, value: string }[];
  genresState: any;
  handleCheckGenre: (genreId: string, checked: boolean) => void;
  style?: any;
}

const GenreCheckBoxList = (props: IProps) => {
  const { genreItems, genresState } = props;
  return (
    <View style={{ ...props.style, ...styles.wrapper }}>
      {
        genreItems.map(genreItem => {
          return (
            <CheckBox
              title={genreItem.label}
              checked={genresState[genreItem.value]}
              containerStyle={styles.formCheckBox}
              checkedColor="#4D7DF9"
              onPress={() => {
                props.handleCheckGenre(genreItem.value, !genresState[genreItem.value])
              }}
            />
          )
        })
      }
    </View>
  );
}

GenreCheckBoxList.defaultProps = {
  genreItems: [],
  genresState: {}
};

export default GenreCheckBoxList

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