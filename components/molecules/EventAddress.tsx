import React from "react";
import { View, Text, Platform } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';

const isIos = Platform.OS === 'ios'

interface IProps {
  address: string;
}

const EventAddress = (props: IProps) => {
  return (
    <View
      style={{
        flex: 1,
        width: "100%",
        padding: 10,
        flexDirection: "row",
        alignItems: "center"
      }}
    >
      <Icon
        name="map-marker"
        color="#000000"
        style={{ marginLeft: 2, marginRight: 9 }}
        size={23}
      />
      <Text
        style={{
          fontSize: isIos ? 14 : 12,
          paddingRight: 20,
          fontWeight: "bold"
        }}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {props.address}
      </Text>
    </View>
  )
}

EventAddress.defaultProps = {
  address: ""
};

export default EventAddress