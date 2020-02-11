import React from "react";
import { Text, Animated, Platform } from "react-native";

const isIos = Platform.OS === 'ios'

interface IProps {
  opacity?: number;
}

const LikeLabel = (props: IProps) => {
  return (
    <Animated.View
      style={{
        opacity: props.opacity,
        transform: [{ rotate: "20deg" }],
        position: "absolute",
        top: "47%",
        right: "20%",
        width: 190,
        zIndex: 1000
      }}
    >
      <Text
        style={{
          borderWidth: 5,
          borderColor: "#FF5D5A",
          borderRadius: 10,
          color: "#FF5D5A",
          backgroundColor: "#ffffff",
          overflow: "hidden",
          fontSize: isIos ? 32 : 24,
          fontWeight: "800",
          textAlign: "center",
          padding: 10
        }}
      >
        LIKE
      </Text>
    </Animated.View>
  )
}

LikeLabel.defaultProps = {
  opacity: 0
};

export default LikeLabel