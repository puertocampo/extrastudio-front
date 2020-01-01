import React, { Component } from "react";
import styled from 'styled-components/native'
import { css } from 'styled-components'
import { StyleSheet, Text, View, Button, AsyncStorage, Dimensions, Animated, Image, PanResponder } from "react-native";
import Firebase from "../firebase";
import Icon from 'react-native-vector-icons/FontAwesome';

const events = [
  { eventId: "event01", uri: require('../assets/image/baseball.jpeg') },
  { eventId: "event02", uri: require('../assets/image/halloween.jpeg') },
  { eventId: "event03", uri: require('../assets/image/soccer.jpeg') },
  { eventId: "event04", uri: require('../assets/image/theater.jpeg') },
  { eventId: "event05", uri: require('../assets/image/togei.jpeg') },
];

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

const Wrapper = styled.View`
  flex: 1;
  width: 100%;
  height: 100%;
  /* background-color: rgb(135, 135, 135); */
  background-color: rgba(0, 0, 0, 0.4);
  position: absolute;
  left: 0;
  top: 0;
`;

const ButtonContainer = styled.View`
  display: flex;
  position: relative;
`;

const ReactionContainer = (handleLike, handleDislike) => {
  return (
    <View style={{ height: 130, width: 300, position: "relative", justifyContent: "space-between", paddingLeft: "30%", paddingRight: "30%" }}>
      <View style={{ position: "relative" }} onPress={handleLike}>
        <Icon
          name='circle'
          color="#FF5D5A"
          style={{ position: "absolute" }}
          size={70} />
        <Icon
          name='heart'
          color="#FFFFFF"
          style={{ position: "absolute", top: 20, left: 15 }}
          size={30} />
      </View>
      <View style={{ position: "relative"}} onPress={handleDislike}>
        <Icon
          name='circle'
          color="#FFFFFF"
          style={{ position: "absolute", top: 1, left: 1 }}
          size={68} />
        <Icon
          name='times-circle'
          color="#4D7DF9"
          style={{ position: "absolute" }}
          size={70} />
      </View>
    </View>
    );
}

export default class SelectionScreen extends Component {
  constructor() {
    super();
    this.position = new Animated.ValueXY();
    this.state = {
      currentIndex: 0
    };
    this.rotate = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: ['-10deg', '0deg', '10deg'],
      extrapolate: 'clamp'
    });
    this.likeOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [0, 0, 1],
      extrapolate: 'clamp'
    });
    this.nopeOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0, 0],
      extrapolate: 'clamp'
    });
    this.nextCardOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0, 1],
      extrapolate: 'clamp'
    });
    this.nextCardScale = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0.8, 1],
      extrapolate: 'clamp'
    });
  }

  componentWillMount() {
    this.PanResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderMove: (evt, gestureState) => {
        this.position.setValue({ x: gestureState.dx, y: gestureState.dy });
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 120) {
          Animated.spring(this.position, {
            toValue: { x: SCREEN_WIDTH + 100, y: gestureState.dy }
          }).start(() => {
            this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
              this.position.setValue({ x: 0, y: 0 })
            })
          })
        } else if (gestureState.dx < -120) {
          Animated.spring(this.position, {
            toValue: { x: -SCREEN_WIDTH - 100, y: gestureState.dy }
          }).start(() => {
            this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
              this.position.setValue({ x: 0, y: 0 })
            })
          })
        } else {
          Animated.spring(this.position, {
            toValue: { x: 0, y: 0 },
            friction: 4
            }).start()
          }
      }
    });
    this.rotateAndTranslate = {
      transform: [
        {
          rotate: this.rotate
        },
        ...this.position.getTranslateTransform()
        ]
    };
}

  handleLike = () => {
    console.log('いいね！');
  }

  handleDislike = () => {
    console.log('よくないね！');
  }

  renderEventCards = () => {
    return events.map((item, index) => {
      console.log(item);
      if (index < this.state.currentIndex) {
        return null;
      } else if (index === this.state.currentIndex) {
        return (
          <Animated.View
            {...this.PanResponder.panHandlers}
            key={item.eventId}
            style={[this.rotateAndTranslate,
              {
                height: SCREEN_HEIGHT - 190,
                width: SCREEN_WIDTH,
                padding: 10,
                position: "absolute",
                left: 0
              }
            ]}
          >
            <Animated.View
              style={{
                opacity: this.likeOpacity,
                transform: [{ rotate: "-30deg" }],
                position: "absolute",
                top: 50,
                left: 40,
                zIndex: 1000
              }}
            >
              <Text
                style={{
                  borderWidth: 1,
                  borderColor: "green",
                  color: "green",
                  fontSize: 32,
                  fontWeight: "800",
                  padding: 10
                }}
              >
                LIKE
              </Text>
            </Animated.View>
            <Animated.View
              style={{
                opacity: this.nopeOpacity,
                transform: [{ rotate: "30deg" }],
                position: "absolute",
                top: 50,
                right: 40,
                zIndex: 1000
              }}
            >
              <Text
                style={{
                  borderWidth: 1,
                  borderColor: "red",
                  color: "red",
                  fontSize: 32,
                  fontWeight: "800",
                  padding: 10
                }}
              >
                NOPE
              </Text>
            </Animated.View>
            <Image
              style={{
                flex: 1,
                height: null,
                width: null,
                resizeMode: "cover",
                borderRadius: 20
              }}
              source={item.uri}
            />
          </Animated.View>
        );
      } else {
        return (
          <Animated.View
            key={item.eventId}
            style={{
              opacity: this.nextCardOpacity,
              transform: [{ scale: this.nextCardScale }],
              height: SCREEN_HEIGHT - 190,
              width: SCREEN_WIDTH,
              padding: 10,
              position: "absolute",
              left: 0
            }}
          >
            <Image
              style={{
                flex: 1,
                height: null,
                width: null,
                resizeMode: "cover",
                borderRadius: 20
              }}
              source={item.uri}
            />
          </Animated.View>
        );
      }
    }).reverse();
  };

  render() {
    return (
      <Wrapper>
        <View style={{ flex: 1, marginTop: 60 }}>
          {this.renderEventCards()}
        </View>
        <ReactionContainer
          handleLike={this.handleLike}
          handleDislike={this.handleDislike}
        />
      </Wrapper>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#000000",
    backgroundColor: "rgb(135, 135, 135)",
    width: "100%",
    paddingTop: 15,
    paddingRight: 5,
    paddingBottom: 7,
    paddingLeft: 5,
    // padding: "15% 1% 7% 1%"
    // "73px 1px 30px"
    alignItems: "center",
    flexDirection: "row"
    // justifyContent: "center"
  }
});
