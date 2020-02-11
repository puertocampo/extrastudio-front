import React from "react";
import { Platform } from "react-native";
import { Button } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";

const isIos = Platform.OS === "ios"

const DislikeButton = props => {
  const buttonSize = isIos ? 70 : 60;
  return (<Button
    style={{ position: "relative" }}
    buttonStyle={{
      backgroundColor: "transparent",
      width: buttonSize,
      height: buttonSize
    }}
    onPress={() => { props.handleDislikeSwipe(props.currentEvent); }}
    icon={<>
      <Icon
        name='circle'
        color="#FFFFFF"
        // style={{ top: isIos ? 1 : 0.5, left: isIos ? 1 : 0.5 }}
        style={{ position: "absolute" }}
        size={isIos ? 68 : 59}
      />
      <Icon
        name='times-circle'
        color="#4D7DF9"
        style={{ position: "absolute" }}
        // style={{ top: isIos ? 1 : 0.5, left: isIos ? 1 : 0.5 }}
        size={buttonSize}
      />
    </>
    } />)
}

export default DislikeButton;