import React from "react";
import { Platform } from "react-native";
import { Button } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";

const isIos = Platform.OS === "ios"

const LikeButton = props => {
  const buttonSize = isIos ? 70 : 60;
  return (<Button
    style={{ position: "relative" }}
    buttonStyle={{
      backgroundColor: "transparent",
      width: buttonSize,
      height: buttonSize
    }}
    onPress={() => { props.handleLikeSwipe(props.currentEvent); }}
    icon={<>
      <Icon
        name="circle"
        color="#FF5D5A"
        style={{ position: "absolute" }}
        size={buttonSize}
      />
      <Icon
        name="heart"
        color="#FFFFFF"
        // style={{ position: "absolute", top: isIos ? 20 : 17, left: isIos ? 15 : 12 }}
        style={{ position: "absolute" }}
        size={isIos ? 30 : 27}
      />
    </>
    } />)
}

export default LikeButton;