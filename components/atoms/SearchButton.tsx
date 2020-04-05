import React from "react";
import { Platform } from "react-native";
import { Button } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";

const isIos = Platform.OS === "ios"

const SearchButton = props => {
  const buttonSize = isIos ? 70 : 60;
  return (<Button
    style={{ position: "relative" }}
    buttonStyle={{
      backgroundColor: "transparent",
      width: buttonSize,
      height: buttonSize
    }}
    onPress={() => { console.log('search') }}
    icon={<>
      <Icon
        name="circle"
        color="#FFD164"
        style={{ position: "absolute" }}
        size={buttonSize}
      />
      <Icon
        name="search"
        color="#FFFFFF"
        style={{ position: "absolute" }}
        size={isIos ? 30 : 27}
      />
    </>
    } />)
}

export default SearchButton;