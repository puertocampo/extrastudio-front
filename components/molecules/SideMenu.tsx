import React from "react";
import { View } from "react-native";
import SideMenu from "react-native-side-menu";
import { Button } from "react-native-elements";

interface IProps {
  // height?: number;
  // currentEvent: IEvent;
  // handleLikeSwipe(event: IEvent, positionY?: number): void;
  // handleDislikeSwipe(event: IEvent, positionY?: number): void;
}

const MenuComponent = (
  <View style={{ flex: 1, paddingTop: 200, width: 235 }}>
    <Button
      type="clear"
      title="LIKEしたイベント"
      onPress={() => {
        console.log("press");
      }}
      titleStyle={{
        color: "#707070",
        fontSize: 28,
        textAlign: "left"
      }}
    />
    <Button
      type="clear"
      title="イベントリコメンド
      条件の変更"
      onPress={() => {
        console.log("press");
      }}
      titleStyle={{
        color: "#707070",
        fontSize: 28,
        textAlign: "left"
      }}
    />
    <Button
      type="clear"
      title="アカウント情報の変更"
      onPress={() => {
        console.log("press");
      }}
      titleStyle={{
        color: "#707070",
        fontSize: 28,
        textAlign: "left"
      }}
    />
    <Button
      type="clear"
      title="Googleアカウントの再設定"
      onPress={() => {
        console.log("press");
      }}
      titleStyle={{
        color: "#707070",
        fontSize: 28,
        textAlign: "left"
      }
      }
      // style={styles.container}
    />
    {/* <List containerStyle={{ marginBottom: 20 }}>
      {
        list.map((l, i) => (
          <ListItem
            roundAvatar
            onPress={() => console.log('Pressed')}
            avatar={l.avatar_url}
            key={i}
            title={l.name}
            subtitle={l.subtitle}
          />
        ))
      }
    </List> */}
  </View>
)

const SettingSideMenu = (props: IProps) => {
  // return (
  //   <View style={{ height: props.height, width: "100%", justifyContent: "space-between", paddingLeft: "20%", paddingRight: "20%", flexDirection: "row" }}>
  //     <LikeButton currentEvent={props.currentEvent} handleLikeSwipe={props.handleLikeSwipe} />
  //     <SearchButton />
  //     <DislikeButton currentEvent={props.currentEvent} handleDislikeSwipe={props.handleDislikeSwipe} />
  //   </View>
  // );
  return (
    <SideMenu isOpen={false} menu={MenuComponent} />
    // <View>
    //   <Text>GOODしたイベント</Text>
    // </View>
  )
  // return (
  //   <SideMenu isOpen={true} menu={MenuComponent}></SideMenu>
  // )
}

SettingSideMenu.defaultProps = {
  // height: 130
};

export default SettingSideMenu

const styles = {
  linkTitle: {
    color: "#707070",
        fontSize: 28,
        textAlign: "left"
  }
};