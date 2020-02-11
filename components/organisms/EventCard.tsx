import React from "react";
import { Animated, View, Text, Image, Platform } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { EventDate, EventAddress } from "../molecules";
import { LikeLabel, DislikeLabel } from "../atoms";
import { IEvent } from "../../type/event";

const isIos = Platform.OS === 'ios'

interface IProps {
  isNextCard: Boolean;
  rotateAndTranslate?: { transform: any[] };
  dndFunctions?: any;
  opacity?: number;
  scale?: number;
  width: number;
  height: number;
  likeOpacity: number;
  dislikeOpacity: number;
  event: IEvent;
}

const EventCard = (props: IProps) => {
  return (
    <Animated.View
      {...props.dndFunctions}
      key={props.event.eventId}
      style={
        [
          {
            opacity: props.isNextCard ? props.opacity : 1,
            transform: props.isNextCard ? [{ scale: props.scale }] : props.rotateAndTranslate.transform,
            height: props.height,
            width: props.width,
            padding: 10,
            position: "absolute",
            left: 0
          }
        ]}
    >
      <LikeLabel
        opacity={props.likeOpacity}
        transform={[{ rotate: "20deg" }]}
        width={190}
        style={{
          position: "absolute",
          top: "47%",
          right: "20%"
        }}
      />
      <DislikeLabel
        opacity={props.dislikeOpacity}
        transform={[{ rotate: "-20deg" }]}
        width={190}
        style={{
          position: "absolute",
          top: "47%",
          left: "20%"
        }}
      />
      {
        props.event.imagePath ? <Image
          style={{
            flex: 3,
            resizeMode: "cover",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20
          }}
          source={{ uri: props.event.imagePath }}
        /> :
          <View
            style={{
              flex: 3,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              backgroundColor: "#f5f5f5",
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Icon
              name='image'
              color="rgba(0, 0, 0, 0.4)"
              size={props.width / 2}
            />
          </View>
      }
      <View
        style={{
          flex: 2,
          backgroundColor: "#FFFFFF",
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20
        }}
      >
        <Text
          style={{
            flex: 1,
            fontSize: isIos ? 24 : 17,
            fontWeight: "bold",
            padding: 12,
            justifyContent: "center",
            alignItems: "center"
          }}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {props.event.title}
        </Text>
        <View
          style={{
            flex: 5,
            borderTopColor: "#BBC3CE",
            borderTopWidth: 0.2,
          }}>
          <EventDate startAt={props.event.startedAt} endAt={props.event.endedAt} />
          <EventAddress address={props.event.address} />
          <Text
            style={{
              flex: isIos ? 3 : 8,
              fontSize: isIos ? 14 : 10,
              padding: 10,
              lineHeight: isIos ? 24 : 18
            }}
            numberOfLines={3}
            ellipsizeMode="tail"
          >
            {props.event.summary}
          </Text>
        </View>
      </View>
    </Animated.View >
  )
}

EventCard.defaultProps = {
  isNextCard: false,
  opacity: 1,
  scale: 1,
  width: 375,
  height: 625,
  likeOpacity: 0,
  dislikeOpacity: 0,
  event: {
    eventId: "",
    title: "",
    summary: "",
    startedAt: new Date(),
    endedAt: new Date(),
    address: "",
    imagePath: ""
  }
};

export default EventCard