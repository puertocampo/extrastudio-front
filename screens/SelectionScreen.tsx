import React, { Component, useState, useEffect } from "react";
import styled from 'styled-components/native'
import { css } from 'styled-components'
import { StyleSheet, Text, View, AsyncStorage, Dimensions, Animated, Image, PanResponder } from "react-native";
import { Button } from "react-native-elements";
import Firebase from "../firebase";
import moment from "moment";
import { Platform } from 'react-native';

import { connect } from 'react-redux';
import * as actions from '../actions';
import Icon from 'react-native-vector-icons/FontAwesome';
import { bindActionCreators } from 'redux';
import { IEvent } from "../type/event";

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;
const isIos = Platform.OS === 'ios'

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
    <View style={{ height: SCREEN_HEIGHT * 0.16, width: "100%", justifyContent: "space-between", paddingLeft: "30%", paddingRight: "30%", flexDirection: 'row' }}>
      <View style={{ position: "relative", left: 0, top: isIos ? 0 : 20 }} >
        <Icon
          name='circle'
          color="#FF5D5A"
          style={{ position: "absolute" }}
          size={isIos ? 70 : 60}
          onPress={() => { props.handleLikeSwipe(props.currentEvent); }}
        />
        <Icon
          name='heart'
          color="#FFFFFF"
          style={{ position: "absolute", top: isIos ? 20 : 17, left: isIos ? 15 : 12 }}
          size={isIos ? 30 : 27}
          onPress={() => { props.handleLikeSwipe(props.currentEvent); }}
        />
      </View>
      <View style={{ position: "relative", right: 60, top: isIos ? 0 : 20 }}>
        <Icon
          name='circle'
          color="#FFFFFF"
          style={{ position: "absolute", top: isIos ? 1 : 0.5, left: isIos ? 1 : 0.5 }}
          size={isIos ? 68 : 59}
          onPress={() => { props.handleDislikeSwipe(props.currentEvent); }}
        />
        <Icon
          name='times-circle'
          color="#4D7DF9"
          style={{ position: "absolute" }}
          size={isIos ? 70 : 60}
          onPress={() => { props.handleDislikeSwipe(props.currentEvent); }}
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
          borderColor: "#FF5D5A",
          borderRadius: 10,
          color: "#FF5D5A",
          backgroundColor: "#ffffff",
          overflow: "hidden",
          fontSize: isIos ? 32 : 24,
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
          borderColor: "#0094D5",
          borderRadius: 10,
          color: "#0094D5",
          backgroundColor: "#ffffff",
          overflow: "hidden",
          fontSize: isIos ? 32 : 24,
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
      currentIndex: 0,
      currentEvent: {}
    };
    this.rotate = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: ['-10deg', '0deg', '10deg'],
      extrapolate: 'clamp'
    });
    this.likeOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [1, 0, 0],
      extrapolate: 'clamp'
    });
    this.dislikeOpacity = this.position.x.interpolate({
      inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
      outputRange: [0, 0, 1],
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
    this.props.fetchEvents(this.props.user.userId);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.currentIndex === (prevProps.events || []).length && (this.props.events || []).length > 1) {
      this.setState({ currentEvent: this.props.events[0] });
    }
    if (prevState.currentIndex !== (this.props.events || []).length && this.state.currentIndex === (this.props.events || []).length) {
      this.props.fetchEvents(this.props.user.userId);
      this.setState({ currentIndex: 0 });
    }
  }

  componentWillMount() {
    this.PanResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderMove: (evt, gestureState) => {
        this.position.setValue({ x: gestureState.dx, y: gestureState.dy });
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 120) {
          this.handleDislikeSwipe(this.state.currentEvent, gestureState.dy);
        } else if (gestureState.dx < -120) {
          this.handleLikeSwipe(this.state.currentEvent, gestureState.dy);
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

  handleLikeSwipe = (event: IEvent, positionY: number) => {
    Animated.spring(this.position, {
      toValue: { x: -1.5 * SCREEN_WIDTH, y: positionY || 60 },
      tension: 1
    }).start(() => {
      const nextIndex = this.state.currentIndex + 1;
      this.setState({ currentIndex: nextIndex, currentEvent: this.props.events[nextIndex] }, () => {
        this.position.setValue({ x: 0, y: 0 });
        this.props.evaluateEvent({ event, userId: this.props.user.userId, email: this.props.user.email, evaluate: "LIKE" });
      })
    });
  }

  handleDislikeSwipe = (event: IEvent, positionY: number) => {
    Animated.spring(this.position, {
      toValue: { x: 1.5 * SCREEN_WIDTH, y: positionY || 60 },
      tension: 1
    }).start(() => {
      const nextIndex = this.state.currentIndex + 1;
      this.setState({ currentIndex: nextIndex, currentEvent: this.props.events[nextIndex] }, () => {
        this.setState({});
        this.position.setValue({ x: 0, y: 0 })
        this.props.evaluateEvent({ event, userId: this.props.user.userId, email: this.props.user.email, evaluate: "NOPE" });
      })
    })
  }

  fetchCalendarEvents = () => {
    Firebase.fetchCalendarEvents();
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
                height: isIos ? SCREEN_HEIGHT * 0.77 : SCREEN_HEIGHT * 0.80,
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
            {item.imagePath ? <Image
              style={{
                flex: 3,
                height: null,
                width: null,
                resizeMode: "cover",
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20
              }}
              source={{ uri: item.imagePath }}
            /> :
              <View
                style={{
                  flex: 3,
                  height: null,
                  width: null,
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
                  // style={{ position: "absolute", top: 50, left: 50 }}
                  size={SCREEN_WIDTH / 2}
                />
              </View>}
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
                    {startDate} ~ {endDate}
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
                      fontSize: isIos ? 14 : 12,
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
                    flex: isIos ? 3 : 8,
                    fontSize: isIos ? 14 : 10,
                    padding: 10,
                    lineHeight: isIos ? 24 : 18
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
              height: isIos ? SCREEN_HEIGHT * 0.77 : SCREEN_HEIGHT * 0.80,
              width: SCREEN_WIDTH,
              padding: 10,
              position: "absolute",
              left: 0
            }}
          >
            {item.imagePath ? <Image
              style={{
                flex: 3,
                height: null,
                width: null,
                resizeMode: "cover",
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20
              }}
              source={{ uri: item.imagePath }}
            /> :
              <View
                style={{
                  flex: 3,
                  height: null,
                  width: null,
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
                  // style={{ position: "absolute", top: 50, left: 50 }}
                  size={SCREEN_WIDTH / 2}
                />
              </View>}
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
                    {startDate} ~ {endDate}
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
                      fontSize: isIos ? 14 : 12,
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
                    flex: isIos ? 3 : 8,
                    fontSize: isIos ? 14 : 10,
                    padding: 10,
                    lineHeight: isIos ? 24 : 18
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
    const renderLastCard = !renderEventCards || this.state.currentIndex === stateEvents.length || this.state.currentIndex === stateEvents.length - 1;
    const renderReactionContainer = this.state.currentIndex !== stateEvents.length;
    return (
      <Wrapper>
        <View style={{ flex: 1, marginTop: SCREEN_HEIGHT * 0.07 }}>
          {renderLastCard &&
            <View
              style={{
                height: SCREEN_HEIGHT * (isIos ? 0.77 : 0.8) - 30,
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
                  fontSize: isIos ? 18 : 12,
                  fontWeight: "bold",
                  textAlign: "center",
                  marginBottom: 20
                }}
              >
                オススメできるコンテンツがありません！
              </Text>
              <Text
                style={{
                  fontSize: isIos ? 16 : 10,
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
            currentEvent={this.state.currentEvent}
            handleLikeSwipe={this.handleLikeSwipe}
            handleDislikeSwipe={this.handleDislikeSwipe}
            // fetchCalendarEvents={this.fetchCalendarEvents}
            createEvent={this.createEvent}
          // fetchEvents={this.props.fetchEvents}
          />
        }
        {/* <Button
          title="Go back to login"
          style={{ marginBottom: 20 }}
          buttonStyle={{
            width: 200,
            height: 50,
            backgroundColor: "#00FF00",
            borderRadius: 25,
            justifyContent: "center",
          }}
          titleStyle={{
            fontWeight: "bold"
          }}
          onPress={() => this.props.navigation.navigate('login')}
        /> */}
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