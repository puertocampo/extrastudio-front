import React from "react";
import { Text, Animated, Platform } from "react-native";

const isIos = Platform.OS === 'ios'

interface IProps {
  opacity?: number;
  transform?: { rotate: string }[];
  width?: number;
  style?: any;
}

const DislikeLabel = (props: IProps) => {
  return (
    <Animated.View
      style={{
        opacity: props.opacity,
        transform: props.transform,
        width: props.width,
        ...props.style,
        zIndex: 1000
      }}
    >
      <Text
        style={{
          borderWidth: 5,
          borderColor: "#0094D5",
          borderRadius: 10,
          color: "#0094D5",
          backgroundColor: "#ffffff",
          overflow: "hidden",
          fontSize: isIos ? 32 : 24,
          fontWeight: "800",
          textAlign: "center",
          padding: 10
        }}
      >
        NOPE
      </Text>
    </Animated.View>
  )
}

DislikeLabel.defaultProps = {
  opacity: 0,
  transform: [{ rotate: "-20deg" }],
  width: 190
};

export default DislikeLabel