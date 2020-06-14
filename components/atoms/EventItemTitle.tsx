import React from "react";
import { View, Text, Platform } from "react-native";

const isIos = Platform.OS === "ios"

interface IProps {
  title: string,
  isShowing: boolean,
  style?: any
}

const EventItemTitle = (props: IProps) => {
  return (
    props.isShowing &&
    <View style={{
      ...props.style
    }}>
      <Text
        style={{
          fontSize: isIos ? 18 : 10,
          fontWeight: "bold",
          lineHeight: isIos ? 24 : 18
        }}
      >
        {props.title}
      </Text>
    </View>)
}

EventItemTitle.defaultProps = {
  title: "",
  isShowing: false,
  style: {}
}

export default EventItemTitle;