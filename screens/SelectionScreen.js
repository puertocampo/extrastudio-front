import React, { Component } from "react";
import styled from 'styled-components/native'
import { css } from 'styled-components'
import { StyleSheet, Text, View, AsyncStorage, Dimensions, Animated, Image, PanResponder } from "react-native";
import { Button } from "react-native-elements";
import Firebase from "../firebase";
import Icon from 'react-native-vector-icons/FontAwesome';

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
          onPress={() => {props.handleLike();}}
        />
        <Icon
          name='heart'
          color="#FFFFFF"
          style={{ position: "absolute", top: 20, left: 15 }}
          size={30}
          onPress={() => {props.handleLike();}}
        />
      </View>
      <View style={{ position: "relative", right: 60}}>
        <Icon
          name='circle'
          color="#FFFFFF"
          style={{ position: "absolute", top: 1, left: 1 }}
          size={68}
          onPress={() => {props.handleDislike();}}
        />
        <Icon
          name='times-circle'
          color="#4D7DF9"
          style={{ position: "absolute" }}
          size={70}
          onPress={() => {props.handleDislike();}}
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
    this.setState({currentIndex: this.state.currentIndex - 1});
  }

  handleDislike = () => {
    this.setState({currentIndex: this.state.currentIndex + 1});
  }

  renderEventCards = () => {
    return events.map((item, index) => {
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
              source={item.uri}
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
                  lineHeight: "40%"
                }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.title}これは蛇足ですこれは蛇足ですこれは蛇足ですこれは蛇足です
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
                    2020/01/01 00:00 ~ 2020/01/01 23:59
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
                    広島県広島市中区基町6-78 NTTクレド基町ビル11階広島県広島市中区基町6-78 NTTクレド基町ビル11階
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
                  親譲りの無鉄砲で小供の時から損ばかりしている。小学校に居る時分学校の二階から飛び降りて一週間ほど腰を抜かした事がある。なぜそんな無闇をしたと聞く人があるかも知れぬ。別段深い理由でもない。新築の二階から首を出していたら、同級生の一人が冗談じょうだんに、いくら威張いばっても、そこから飛び降りる事は出来まい。弱虫やーい。と囃はやしたからである。小使こづかいに負ぶさって帰って来た時、おやじが大きな眼めをして二階ぐらいから飛び降りて腰を抜かす奴やつがあるかと云いったから、この次は抜かさずに飛んで見せますと答えた。
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
              source={item.uri}
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
                  lineHeight: "40%"
                }}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.title}これは蛇足ですこれは蛇足ですこれは蛇足ですこれは蛇足です
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
                    2020/01/01 00:00 ~ 2020/01/01 23:59
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
                    広島県広島市中区基町6-78 NTTクレド基町ビル11階広島県広島市中区基町6-78 NTTクレド基町ビル11階
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
                  親譲りの無鉄砲で小供の時から損ばかりしている。小学校に居る時分学校の二階から飛び降りて一週間ほど腰を抜かした事がある。なぜそんな無闇をしたと聞く人があるかも知れぬ。別段深い理由でもない。新築の二階から首を出していたら、同級生の一人が冗談じょうだんに、いくら威張いばっても、そこから飛び降りる事は出来まい。弱虫やーい。と囃はやしたからである。小使こづかいに負ぶさって帰って来た時、おやじが大きな眼めをして二階ぐらいから飛び降りて腰を抜かす奴やつがあるかと云いったから、この次は抜かさずに飛んで見せますと答えた。
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
    const renderLastCard = this.state.currentIndex === events.length || this.state.currentIndex === events.length - 1;
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
              />
            </View>
          }
          {this.renderEventCards()}
        </View>
        {renderReactionContainer &&
          <ReactionContainer
            handleLike={this.handleLike}
            handleDislike={this.handleDislike}
          />
        }
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

