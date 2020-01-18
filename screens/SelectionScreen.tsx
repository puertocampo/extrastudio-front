import React, { Component, useEffect } from "react";
import styled from 'styled-components/native'
import { css } from 'styled-components'
import { StyleSheet, Text, View, AsyncStorage, Dimensions, Animated, Image, PanResponder } from "react-native";
import { Button } from "react-native-elements";
import Firebase from "../firebase";

import { connect } from 'react-redux';
import * as actions from '../actions';
import Icon from 'react-native-vector-icons/FontAwesome';
import Api from "../api";
import { bindActionCreators } from 'redux';

const events = [
  { eventId: "event01", title: "野球イベント", uri: require('../assets/image/baseball.jpeg') },
  { eventId: "event02", title: "サッカーイベント", uri: require('../assets/image/soccer.jpeg') },
  { eventId: "event03", title: "映画イベント", uri: require('../assets/image/theater.jpeg') },
  { eventId: "event04", title: "陶芸教室イベント", uri: require('../assets/image/togei.jpeg') },
  { eventId: "event05", title: "ハロウィンイベント", uri: require('../assets/image/halloween.jpeg') }
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

const ReactionContainer = props => {
  return (
    <View style={{ height: 130, width: "100%", justifyContent: "space-between", paddingLeft: "30%", paddingRight: "30%", flexDirection: 'row' }}>
      <View style={{ position: "relative", left: 0 }} >
        <Icon
          name='circle'
          color="#FF5D5A"
          style={{ position: "absolute" }}
          size={70}
          onPress={() => { props.handleLikeSwipe(); }}
        />
        <Icon
          name='heart'
          color="#FFFFFF"
          style={{ position: "absolute", top: 20, left: 15 }}
          size={30}
          onPress={() => { props.handleLikeSwipe(); }}
        />
      </View>
      <View style={{ position: "relative", right: 60 }}>
        <Icon
          name='circle'
          color="#FFFFFF"
          style={{ position: "absolute", top: 1, left: 1 }}
          size={68}
          onPress={() => { props.handleDislikeSwipe(); }}
        />
        <Icon
          name='times-circle'
          color="#4D7DF9"
          style={{ position: "absolute" }}
          size={70}
          onPress={() => { props.handleDislikeSwipe(); }}
        />
      </View>
    </View>
  );
}

const LikeLabel = props => {
  return (
    <Animated.View
      style={{
        opacity: props.opacity,
        transform: [{ rotate: "-20deg" }],
        position: "absolute",
        top: "47%",
        left: "20%",
        width: 190,
        zIndex: 1000
      }}
    >
      <Text
        style={{
          borderWidth: 5,
          borderColor: "#FF5D5A",
          borderRadius: 10,
          color: "#FF5D5A",
          backgroundColor: "#ffffff",
          overflow: "hidden",
          fontSize: 32,
          fontWeight: "800",
          textAlign: "center",
          padding: 10
        }}
      >
        LIKE
      </Text>
    </Animated.View>
  )
}

const DislikeLabel = props => {
  return (
    <Animated.View
      style={{
        opacity: props.opacity,
        transform: [{ rotate: "20deg" }],
        position: "absolute",
        top: "47%",
        right: "20%",
        width: 190,
        zIndex: 1000
      }}
    >
      <Text
        style={{
          borderWidth: 5,
          borderColor: "#0094D5",
          borderRadius: 10,
          color: "#0094D5",
          backgroundColor: "#ffffff",
          overflow: "hidden",
          fontSize: 32,
          fontWeight: "800",
          textAlign: "center",
          padding: 10
        }}
      >
        NOPE
      </Text>
    </Animated.View>
  )
}

class SelectionScreen extends Component {
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
    this.dislikeOpacity = this.position.x.interpolate({
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

  componentDidMount() {
    this.props.fetchEvents();
  }

  componentWillMount() {
    this.PanResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderMove: (evt, gestureState) => {
        this.position.setValue({ x: gestureState.dx, y: gestureState.dy });
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 120) {
          this.handleLikeSwipe(gestureState.dy);
        } else if (gestureState.dx < -120) {
          this.handleDislikeSwipe(gestureState.dy);
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

  handleLikeSwipe = (positionY: number) => {
    Animated.spring(this.position, {
      toValue: { x: 1.5 * SCREEN_WIDTH, y: positionY || 60 },
      tension: 1
    }).start(() => {
      this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
        this.position.setValue({ x: 0, y: 0 })
      })
    });
  }

  handleDislikeSwipe = (positionY: number) => {
    Animated.spring(this.position, {
      toValue: { x: -1.5 * SCREEN_WIDTH, y: positionY || 60 },
      tension: 1
    }).start(() => {
      this.setState({ currentIndex: this.state.currentIndex + 1 }, () => {
        this.position.setValue({ x: 0, y: 0 })
      })
    })
  }

  fetchCalendarEvents = () => {
    Firebase.fetchCalendarEvents();
  }

  fetchEvents = async () => {
    try {
      const events = await Api.fetchEvents(20, this.props.user.user.email);
      return events;
    } catch (err) {
      console.log(err);
    }
  }

  createEvent = () => {
    Firebase.createEvent();
  }

  renderEventCards = (events: IEvent[]) => {
    if (!events) return null;
    return events.map((item, index) => {
      const startDate = moment(item.startedAt).format("YYYY/MM/DD HH:mm");
      const endDate = moment(item.endedAt).format("YYYY/MM/DD HH:mm");
      if (index < this.state.currentIndex) {
        return null;
      } else if (index === this.state.currentIndex) {
        return (
          <Animated.View
            {...this.PanResponder.panHandlers}
            key={item.eventId}
            style={[
              this.rotateAndTranslate,
              {
                height: SCREEN_HEIGHT - 190,
                width: SCREEN_WIDTH,
                padding: 10,
                position: "absolute",
                left: 0
              }
            ]}
          >
            <LikeLabel
              opacity={this.likeOpacity}
            />
            <DislikeLabel
              opacity={this.dislikeOpacity}
            />
            <Image
              style={{
                flex: 3,
                height: null,
                width: null,
                resizeMode: "cover",
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20
              }}
              source={{ uri: item.imagePath || "https://s3-ap-northeast-1.amazonaws.com/s3.techplay.jp/tp-images/event/1250/4a31e8e431a59931d54c5197cb65b907366c278e.jpg" }}
            />
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
                  fontSize: 24,
                  fontWeight: "bold",
                  padding: 12,
                  justifyContent: "center",
                  alignItems: "center",
                  // lineHeight: "40%"
                }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.title}
              </Text>
              <View
                style={{
                  flex: 5,
                  borderTopColor: "#BBC3CE",
                  borderTopWidth: 0.2,
                }}>
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
                    {item.startedAt} ~ {item.endedAt}
                  </Text>
                </View>
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
                      fontSize: 14,
                      paddingRight: 20,
                      fontWeight: "bold"
                    }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.address}
                  </Text>
                </View>
                <Text
                  style={{
                    flex: 3,
                    fontSize: 14,
                    padding: 10,
                    lineHeight: 24
                  }}
                  numberOfLines={3}
                  ellipsizeMode="tail"
                >
                  {item.summary}
                </Text>
              </View>
            </View>
          </Animated.View>
        );
      } else if (index === this.state.currentIndex + 1) {
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
                flex: 3,
                height: null,
                width: null,
                resizeMode: "cover",
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20
              }}
              source={{ uri: item.imagePath || "https://s3-ap-northeast-1.amazonaws.com/s3.techplay.jp/tp-images/event/1250/4a31e8e431a59931d54c5197cb65b907366c278e.jpg" }}
            />
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
                  fontSize: 24,
                  fontWeight: "bold",
                  padding: 12,
                  justifyContent: "center",
                  alignItems: "center",
                  // lineHeight: "40%"
                }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.title}
              </Text>
              <View
                style={{
                  flex: 5,
                  borderTopColor: "#BBC3CE",
                  borderTopWidth: 0.2,
                }}>
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
                    {item.startedAt} ~ {item.endedAt}
                  </Text>
                </View>
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
                      fontSize: 14,
                      paddingRight: 20,
                      fontWeight: "bold"
                    }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.address}
                  </Text>
                </View>
                <Text
                  style={{
                    flex: 3,
                    fontSize: 14,
                    padding: 10,
                    lineHeight: 24
                  }}
                  numberOfLines={3}
                  ellipsizeMode="tail"
                >
                  {item.summary}
                </Text>
              </View>
            </View>
          </Animated.View>
        );
      } else {
        return null;
      }
    }).reverse();
  };

  render() {
    const stateEvents = this.props.events;
    const renderEventCards = !!stateEvents && !!Object.keys(stateEvents).length;
    const renderLastCard = !renderEventCards || this.state.currentIndex === events.length || this.state.currentIndex === events.length - 1;
    const renderReactionContainer = this.state.currentIndex !== events.length;
    return (
      <Wrapper>
        <View style={{ flex: 1, marginTop: 60 }}>
          {renderLastCard &&
            <View
              style={{
                height: SCREEN_HEIGHT - 210,
                width: SCREEN_WIDTH - 20,
                padding: 32,
                paddingTop: "50%",
                margin: 10,
                backgroundColor: "#ffffff",
                position: "absolute",
                left: 0,
                borderRadius: 20,
                alignItems: "center"
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  textAlign: "center",
                  marginBottom: 20
                }}
              >
                オススメできるコンテンツがありません！
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  textAlign: "center",
                  marginBottom: 40,
                  lineHeight: 25
                }}
              >
                検索画面からコンテンツを検索していただくか、{"\n"}登録しているタグを変更するとオススメの{"\n"}コンテンツが見つかるかもしれません。
              </Text>
              <Button
                title="OK"
                color="#FFFFFF"
                buttonStyle={{
                  width: 160,
                  height: 50,
                  backgroundColor: "#4D7DF9",
                  borderRadius: 25,
                  justifyContent: "center",
                }}
                titleStyle={{
                  fontWeight: "bold"
                }}
                onPress={() => {
                  this.props.navigation.navigate('login');
                }}
              />
            </View>
          }
          {renderEventCards && this.renderEventCards(stateEvents)}
        </View>
        {renderReactionContainer &&
          <ReactionContainer
            handleLikeSwipe={this.handleLikeSwipe}
            handleDislikeSwipe={this.handleDislikeSwipe}
            // fetchCalendarEvents={this.fetchCalendarEvents}
            createEvent={this.createEvent}
          // fetchEvents={this.props.fetchEvents}
          />
        }
      </Wrapper>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    user: state.user,
    events: state.events
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectionScreen);