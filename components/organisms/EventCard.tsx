import React from "react";
import { Animated, View, Text, Dimensions, Image, Platform, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import MapView, { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome';
import { EventDate, EventAddress, EventDescription } from "../molecules";
import { LikeLabel, DislikeLabel } from "../atoms";
import { IEvent } from "../../type/event";

const SCREEN_HEIGHT = Dimensions.get('window').height;
const MAP_ZOOM_RATE = 0.020;
const isIos = Platform.OS === 'ios'

interface IProps {
  isNextCard: boolean;
  canDrag: boolean;
  canScroll: boolean;
  handleExpandCard?: () => void;
  handleFoldCard?: () => void;
  rotateAndTranslate?: { transform: any[] };
  dndFunctions?: any;
  opacity?: number;
  scale?: number;
  width: Animated.Value;
  height: Animated.Value;
  padding: Animated.Value;
  elementOpacity?: Animated.Value;
  likeOpacity: number;
  dislikeOpacity: number;
  isAnimationRunning?: boolean;
  event: IEvent;
}

const EventCard = (props: IProps) => {
  const ScrollRef = React.createRef<ScrollView>();
  const scrollToTop = () => {
    ScrollRef.current &&
      ScrollRef.current.scrollTo({ x: 0, y: 0, animated: false });
  }

  const handleScaleAnim = () => {
    if (props.canDrag && !props.canScroll) {
      props.handleExpandCard();
    } else if (!props.canDrag && props.canScroll) {
      scrollToTop();
      props.handleFoldCard();
    }
  }

  const onSwipeDown = (e) => {
    if (e.nativeEvent.contentOffset.y <= 0 && e.nativeEvent.velocity.y <= 0) {
      handleScaleAnim();
    }
  }

  const dndFunctions = props.canDrag ? props.dndFunctions : {};

  return (
    <Animated.View
      {...dndFunctions}
      key={props.event.eventId}
      style={
        {
          opacity: props.isNextCard ? props.opacity : 1,
          transform: props.isNextCard ? [{ scale: props.scale }] : props.rotateAndTranslate.transform,
          height: props.height,
          width: props.width,
          padding: props.padding,
          position: "absolute",
          left: 0
        }
      }
    >
      <ScrollView
        ref={ScrollRef}
        scrollEnabled={props.canScroll}
        showsHorizontalScrollIndicator={false}
        onScrollEndDrag={onSwipeDown}
        style={
          {
            borderRadius: 20
          }
        }
      >
        <LikeLabel
          opacity={props.likeOpacity}
          transform={[{ rotate: "20deg" }]}
          width={190}
          style={{
            position: "absolute",
            top: "47%",
            right: "20%",
            zIndex: 30
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
        <TouchableOpacity
          activeOpacity={1}
          style={{
            height: 360,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            backgroundColor: "#f5f5f5",
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={handleScaleAnim}
        >
          {props.event.imagePath ? <Image
            style={{
              height: 360,
              resizeMode: "cover",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20
            }}
            source={{ uri: props.event.imagePath }}
          /> :
            <Icon
              name='image'
              color="rgba(0, 0, 0, 0.4)"
              size={200}
              onPress={handleScaleAnim}
            />}
        </TouchableOpacity>
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
            numberOfLines={props.canScroll ? null : 1}
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
            <Animated.View
              style={{
                opacity: props.elementOpacity,
                display: props.canScroll ? "block" : "none"
              }}
            >
              {props.isAnimationRunning
                ? <View
                  style={{ marginTop: 20, marginBottom: 20, height: 250, backgroundColor: "rgba(245, 237, 213, 0.5)", alignItems: "center", justifyContent: "center" }}
                >
                  <ActivityIndicator />
                </View>
                : <MapView
                  style={{ marginTop: 20, marginBottom: 20, height: 250 }}
                  initialRegion={{
                    latitude: props.event.lat,
                    longitude: props.event.lon,
                    latitudeDelta: MAP_ZOOM_RATE,
                    longitudeDelta: MAP_ZOOM_RATE * 2.25
                  }}
                  rotateEnabled={false}
                  showsUserLocation
                >
                  <Marker
                    coordinate={{ latitude: props.event.lat, longitude: props.event.lon }}
                    title={props.event.place}
                  />
                </MapView>
              }
            </Animated.View>
            <EventDescription title="イベント概要" detail={props.event.summary} numberOfLines={props.canScroll ? null : 4} isShowing={props.canScroll} opacity={props.elementOpacity} />
            <EventDescription title="URL" detail={props.event.eventUrl} isShowing={props.canScroll} opacity={props.elementOpacity} style={{ marginBottom: SCREEN_HEIGHT * 0.20 }} />
          </View>
        </View>
      </ScrollView >
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
  },
  isAnimationRunning: false
};

export default EventCard