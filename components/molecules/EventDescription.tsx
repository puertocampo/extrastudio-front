import React from "react";
import { View, Animated, Text, Platform } from "react-native";

const isIos = Platform.OS === "ios"

interface IProps {
  title: string,
  detail: string,
  isShowing: boolean,
  opacity: Animated.Value,
  numberOfLines?: number,
  style?: any
}

const EventDescription = (props: IProps) => {
  return (<View style={{ ...props.style, }}><Animated.View
    style={{
      display: props.isShowing ? "block" : "none",
      opacity: props.opacity,
    }}>
    <Text
      style={{
        fontSize: isIos ? 18 : 10,
        fontWeight: "bold",
        padding: 10,
        lineHeight: isIos ? 24 : 18,
      }}>
      {props.title}
    </Text>
  </Animated.View>
    <Text
      style={{
        flex: isIos ? 3 : 8,
        fontSize: isIos ? 14 : 10,
        padding: 10,
        lineHeight: isIos ? 24 : 18,
      }}
      numberOfLines={props.numberOfLines}
      ellipsizeMode="tail"
    >
      {props.detail}
    </Text></View>)
}

EventDescription.defaultProps = {
  numberOfLines: null,
  style: {}
}

export default EventDescription;