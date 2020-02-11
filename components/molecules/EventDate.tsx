import React from "react";
import { View, Text } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from "moment";

interface IProps {
  startAt: Date;
  endAt: Date;
}

const EventDate = (props: IProps) => {
  const startDate = moment(props.startAt).format("YYYY/MM/DD HH:mm");
  const endDate = moment(props.endAt).format("YYYY/MM/DD HH:mm");
  return (
    <View
      style={{
        flex: 1,
        padding: 10,
        flexDirection: "row",
        alignItems: "center"
      }}
    >
      <Icon
        name="clock-o"
        color="#000000"
        style={{ marginRight: 7 }}
        size={20}
      />
      <Text
        style={{
          fontSize: 14,
          fontWeight: "bold"
        }}
      >
        {startDate} ~ {endDate}
      </Text>
    </View>
  )
}

EventDate.defaultProps = {
  startAt: new Date(),
  endAt: new Date()
};

export default EventDate