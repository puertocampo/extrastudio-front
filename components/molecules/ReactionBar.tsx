import React from "react";
import { View } from "react-native";

import { LikeButton } from "../atoms";
import { DislikeButton } from "../atoms";

import { IEvent } from "../../type/event";

interface IProps {
  height?: number;
  currentEvent: IEvent;
  handleLikeSwipe(event: IEvent, positionY?: number): void;
  handleDislikeSwipe(event: IEvent, positionY?: number): void;
}

const ReactionBar = (props: IProps) => {
  return (
    <View style={{ height: props.height, width: "100%", justifyContent: "space-between", paddingLeft: "30%", paddingRight: "30%", flexDirection: 'row' }}>
      <LikeButton currentEvent={props.currentEvent} handleLikeSwipe={props.handleLikeSwipe} />
      <DislikeButton currentEvent={props.currentEvent} handleDislikeSwipe={props.handleDislikeSwipe} />
    </View>
  );
}

ReactionBar.defaultProps = {
  height: 130
};

export default ReactionBar