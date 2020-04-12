import React from "react";
import { StyleSheet, View, Text, Platform } from "react-native";
import { Button } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";

const isIos = Platform.OS === "ios"

interface IProps {
  keywords: { label: string, value: string }[];
  handleDeleteKeyword: (keywordId: string) => void;
  style?: any;
}

const KeywordsList = (props: IProps) => {
  const { keywords, handleDeleteKeyword } = props;
  if (!keywords.length) {
    return null;
  }
  return (
    <View style={{ ...props.style, ...styles.wrapper }}>
      {
        keywords.map(keyword => {
          return (
            <View style={styles.buttonWrapper}>
              <Button
                type="clear"
                buttonStyle={{
                  width: 20
                }}
                onPress={() => {
                  handleDeleteKeyword(keyword.value)
                }}
                icon={
                  <Icon
                    name="times"
                    color="#707070"
                    style={{ position: "absolute", top: 2 }}
                    size={20}
                  />
                }
              />
              <Text
                style={styles.keywordText}
                key={keyword.value}
              >
                #{keyword.label}
              </Text>
            </View>
          )
        })
      }
    </View >
  );
}

KeywordsList.defaultProps = {
  keywords: []
};

export default KeywordsList

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    width: "100%"
  },
  buttonWrapper: {
    flexDirection: "row",
    justifyContent: "flex-start"
  },
  keywordText: {
    color: "#707070",
    fontSize: 25,
    marginLeft: 10
  }
});