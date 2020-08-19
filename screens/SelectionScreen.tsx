import React, { Component } from "react";
import styled from "styled-components/native";
import { Text, View, Dimensions, Animated, Image, PanResponder } from "react-native";
import { Button } from "react-native-elements";
import { Platform } from 'react-native';
import * as _ from "lodash";

import { connect } from 'react-redux';
import * as actions from '../actions';
import Icon from 'react-native-vector-icons/FontAwesome';
import { bindActionCreators } from 'redux';
import { IUser } from "../type/user";
import { IEvent } from "../type/event";

import { ReactionBar, SettingSideMenu } from "../components/molecules";
import { EventCard } from "../components/organisms";
import SideMenu from "react-native-side-menu";

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;
const isIos = Platform.OS === 'ios'

const Wrapper = styled.View`
  flex: 1;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  position: absolute;
  left: 0;
  top: 0;
`;

interface IProps {
  user: IUser;
  events: IEvent[];
  fetchEvents(userId: string): IEvent[];
  navigation: any;
  evaluateEvent(req: { userId: string, event: IEvent, email: string, evaluate: string }): void;
  logout(): void;
}

interface IState {
  currentIndex: number;
  currentEvent: IEvent;
  canDrag: boolean;
  canScroll: boolean;
  isExpanding: boolean;
  isFolding: boolean;
  expandAnim: {
    cardWidth: Animated.Value;
    cardHeight: Animated.Value;
    cardMargin: Animated.Value;
    cardPadding: Animated.Value;
    elementOpacity: Animated.Value;
  }
}

class SelectionScreen extends Component<IProps, IState> {
  private position: any;
  private rotate: string;
  private likeOpacity: number;
  private dislikeOpacity: number;
  private nextCardOpacity: number;
  private nextCardScale: number;
  private rotateAndTranslate: any;
  private PanResponder: any;

  constructor(props: IProps) {
    super(props);
    this.position = new Animated.ValueXY();
    this.state = {
      currentIndex: 0,
      currentEvent: {
        eventId: "",
        title: "",
        summary: "",
        startedAt: new Date(),
        endedAt: new Date(),
        address: "",
        imagePath: ""
      },
      canDrag: true,
      canScroll: false,
      isExpanding: false,
      isFolding: false,
      expandAnim: {
        cardWidth: new Animated.Value(expandAnimConstants.cardWidth.folded),
        cardHeight: new Animated.Value(expandAnimConstants.cardHeight.folded),
        cardMargin: new Animated.Value(expandAnimConstants.cardMargin.folded),
        cardPadding: new Animated.Value(expandAnimConstants.cardPadding.folded),
        elementOpacity: new Animated.Value(expandAnimConstants.elementOpacity.folded)
      },
      isMenuOpening: false,
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

  componentDidUpdate(prevProps: IProps, prevState: IState) {
    // 初期読み込み時
    if (!(prevProps.events || []).length && (this.props.events || []).length > 0) {
      this.setState({ currentEvent: this.props.events[0] });
    }

    // コースカードが全てスワイプされた時
    if (prevState.currentIndex !== (this.props.events || []).length && this.state.currentIndex === (this.props.events || []).length) {
      this.props.fetchEvents(this.props.user.userId);
    }

    // 新しくイベントが読み込まれた時
    if (!_.isEqual(prevProps.events, this.props.events)) {
      this.setState({ currentIndex: 0, currentEvent: this.props.events[0] });
    }

    // ログアウト時
    if (prevProps.user.userId && !this.props.user.userId) {
      this.props.navigation.navigate('login');
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

  // カードをLIKEするときの処理
  handleLikeSwipe = (event: IEvent, positionY?: number) => {
    this.handleFoldCard();
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

  // カードをDISLIKEするときの処理
  handleDislikeSwipe = (event: IEvent, positionY: number) => {
    this.handleFoldCard();
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

  // カードを展開するときの処理
  handleExpandCard = () => {
    const { expandAnim } = this.state;
    this.setState({ canDrag: false, canScroll: true, isExpanding: true });
    Animated.parallel([
      Animated.spring(expandAnim.cardWidth, {
        toValue: expandAnimConstants.cardWidth.expanded
      }),
      Animated.spring(expandAnim.cardHeight, {
        toValue: expandAnimConstants.cardHeight.expanded,
        bounciness: 10
      }),
      Animated.spring(expandAnim.cardMargin, {
        toValue: expandAnimConstants.cardMargin.expanded,
        bounciness: 10
      }),
      Animated.spring(expandAnim.cardPadding, {
        toValue: expandAnimConstants.cardPadding.expanded,
        bounciness: 10
      }),
      Animated.spring(expandAnim.elementOpacity, {
        toValue: expandAnimConstants.elementOpacity.expanded,
        bounciness: 0
      })
    ]).start(() => {
      this.setState({ isExpanding: false });
    });
  }

  // カードを縮小するときの処理
  handleFoldCard = () => {
    const { expandAnim } = this.state;
    this.setState({ canDrag: true, canScroll: false, isFolding: true });
    Animated.parallel([
      Animated.spring(expandAnim.cardWidth, {
        toValue: expandAnimConstants.cardWidth.folded
      }),
      Animated.spring(expandAnim.cardHeight, {
        toValue: expandAnimConstants.cardHeight.folded,
        bounciness: 10
      }),
      Animated.spring(expandAnim.cardMargin, {
        toValue: expandAnimConstants.cardMargin.folded,
        bounciness: 10
      }),
      Animated.spring(expandAnim.cardPadding, {
        toValue: expandAnimConstants.cardPadding.folded,
        bounciness: 10
      }),
      Animated.spring(expandAnim.elementOpacity, {
        toValue: expandAnimConstants.elementOpacity.folded,
        bounciness: 0
      })
    ]).start(() => {
      this.setState({ isFolding: false });
    });
  }

  renderEventCards = (events: IEvent[]) => {
    if (!events) return null;
    const { expandAnim } = this.state;
    return events.map((event, index) => {
      if (index < this.state.currentIndex) {
        return null;
      } else if (index === this.state.currentIndex) {
        return (
          <EventCard
            key={index}
            isNextCard={false}
            canDrag={this.state.canDrag}
            canScroll={this.state.canScroll}
            handleExpandCard={this.handleExpandCard}
            handleFoldCard={this.handleFoldCard}
            likeOpacity={this.likeOpacity}
            dislikeOpacity={this.dislikeOpacity}
            rotateAndTranslate={this.rotateAndTranslate}
            dndFunctions={this.PanResponder.panHandlers}
            height={expandAnim.cardHeight}
            width={expandAnim.cardWidth}
            padding={this.state.expandAnim.cardPadding}
            elementOpacity={this.state.expandAnim.elementOpacity}
            isAnimationRunning={this.state.isExpanding || this.state.isFolding}
            event={event}
          />
        );
      } else if (index === this.state.currentIndex + 1) {
        return (
          <EventCard
            key={index}
            isNextCard={true}
            canDrag={false}
            canScroll={false}
            opacity={this.nextCardOpacity}
            scale={this.nextCardScale}
            height={new Animated.Value(expandAnimConstants.cardHeight.folded)}
            width={new Animated.Value(expandAnimConstants.cardWidth.folded)}
            padding={new Animated.Value(expandAnimConstants.cardPadding.folded)}
            event={event}
          />
        );
      } else {
        return null;
      }
    }).reverse();
  };

  toggleMenu = () => {
    this.setState({ isMenuOpening: !this.state.isMenuOpening });
  }

  render() {
    const stateEvents = this.props.events;
    const renderEventCards = !!stateEvents && !!Object.keys(stateEvents).length;
    const renderLastCard = !renderEventCards || this.state.currentIndex === stateEvents.length || this.state.currentIndex === stateEvents.length - 1;
    const renderReactionContainer = this.state.currentIndex !== stateEvents.length;
    return (
      // <SideMenu menu={<SettingSideMenu />}
      //   isOpen={false}
      // >
      <Wrapper>
        {/* <Button
            buttonStyle={{
              backgroundColor: "transparent"
            }}
            style={{ position: "absolute", top: 20, left: 10 }}
            onPress={this.toggleMenu}
            icon={<Icon
              name="bars"
              color="#707070"
              size={35}
            />}
          /> */}
        <Button
          buttonStyle={{
            backgroundColor: "transparent"
          }}
          style={{ position: "absolute", top: 20, right: 10 }}
          onPress={this.props.logout}
          icon={<Icon
            name="gear"
            color="#707070"
            size={35}
          />}
        />
        <Animated.View style={{ flex: 1, marginTop: this.state.expandAnim.cardMargin }}>
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
                buttonStyle={{
                  width: 160,
                  height: 50,
                  backgroundColor: "#4D7DF9",
                  borderRadius: 25,
                  justifyContent: "center",
                }}
                titleStyle={{
                  color: "#FFFFFF",
                  fontWeight: "bold"
                }}
                onPress={() => {
                  this.props.navigation.navigate('login');
                }}
              />
            </View>
          }
          {renderEventCards && this.renderEventCards(stateEvents)}
        </Animated.View>
        {/* {renderReactionContainer && */}
        <ReactionBar
          height={SCREEN_HEIGHT * 0.16}
          currentEvent={this.state.currentEvent}
          handleLikeSwipe={this.handleLikeSwipe}
          handleDislikeSwipe={this.handleDislikeSwipe}
        />
      </Wrapper>
      // </SideMenu >
    );
  }
}

const expandAnimConstants = {
  cardWidth: {
    expanded: SCREEN_WIDTH,
    folded: SCREEN_WIDTH
  },
  cardHeight: {
    expanded: SCREEN_HEIGHT,
    folded: isIos ? SCREEN_HEIGHT * 0.77 : SCREEN_HEIGHT * 0.80
  },
  cardMargin: {
    expanded: 0,
    folded: SCREEN_HEIGHT * 0.07
  },
  cardPadding: {
    expanded: 0,
    folded: 10
  },
  elementOpacity: {
    expanded: 1,
    folded: 0
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