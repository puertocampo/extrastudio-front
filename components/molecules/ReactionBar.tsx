import React from "react";
import { View } from "react-native";

import { LikeButton, DislikeButton, SearchButton } from "../atoms";

import { IEvent } from "../../type/event";

interface IProps {
  height?: number;
  currentEvent: IEvent;
  handleLikeSwipe(event: IEvent, positionY?: number): void;
  handleDislikeSwipe(event: IEvent, positionY?: number): void;
}

const ReactionBar = (props: IProps) => {
  return (
    <View style={{ height: props.height, width: "100%", justifyContent: "space-between", paddingLeft: "20%", paddingRight: "20%", flexDirection: "row" }}>
      <LikeButton currentEvent={props.currentEvent} handleLikeSwipe={props.handleLikeSwipe} />
      {/* <SearchButton /> */}
      <DislikeButton currentEvent={props.currentEvent} handleDislikeSwipe={props.handleDislikeSwipe} />
    </View>
  );
}

ReactionBar.defaultProps = {
  height: 130
};

export default ReactionBar