import firebase from "firebase";
import { firebaseConfig } from "./config";
import { Platform } from 'react-native';
import * as Google from "expo-google-app-auth";
import * as Calendar from "expo-calendar";
import moment from "moment";
import { IEvent } from "../type/event";
// import { GoogleSignIn } from "expo-google-sign-in";
// import * as GoogleSignIn from "expo-google-sign-in";
// import * as GoogleSignIn from "expo-google-sign-in";
// import { Google } from "expo";

export default class Firebase {
  static firebaseInitialize() {
    try {
      firebase.initializeApp(firebaseConfig);
      console.log("ok");
    } catch {
      console.log("ng");
    }
  }

  static async handleLogIn() {
    try {
      const googleResult = await Google.logInAsync({
        behavior: "web",
        clientId:
          "324221214715-jqkk2f6qbnk0snqsqo9je6sb0nh15l0m.apps.googleusercontent.com",
        scopes: ["profile", "email"]
      })
      console.log('result ok');
      if (googleResult.type !== "success") return { err: googleResult };
      const { idToken, accessToken } = googleResult;
      const credential = firebase.auth.GoogleAuthProvider.credential(
        idToken,
        accessToken
      );
      console.log('credential ok');
      const firebaseResult = await firebase
        .auth()
        .signInWithCredential(credential)
      console.log('try ok');
      return {
        firebaseUser: {
          userId: firebaseResult.user.uid,
          email: firebaseResult.user.email,
          name: firebaseResult.user.displayName,
          iconUrl: firebaseResult.user.photoURL,
          idToken
        }
      };
    } catch (err) {
      console.log('try ng');
      return { err };
    }
  }

  /**
   * firebaseの ログアウト処理
   */
  static async handleLogOut() {
    await firebase.auth().signOut();
  }

  /**
   * 現在ログインしているユーザの情報を取得
   */
  static async fetchCurrentUser() {
    const firebaseUser = await firebase.auth().currentUser;
    return firebaseUser;
  }

  static async getDefaultCalendarSource() {
    const calendars = await Calendar.getCalendarsAsync();
    // const defaultCalendars = calendars.filter(
    //   each => each.source.name === 'Default'
    // );
    // return defaultCalendars[0].source;
    console.log('calendars', calendars);
    return calendars[0].source;
  }

  static async fetchCalendarEvents() {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    console.log('status', status);
    if (status === 'granted') {
      const calendars = await Calendar.getCalendarsAsync();
      // console.log('Here are all your calendars:');
      // console.log({ calendars });
      console.log(calendars[0])
    }
    const defaultCalendarSource =
      Platform.OS === 'ios'
        ? await this.getDefaultCalendarSource()
        : { isLocalAccount: true, name: 'Expo Calendar' };
    console.log("defaultCalendarSource", defaultCalendarSource);
    const newCalendarID = await Calendar.createCalendarAsync({
      title: 'Expo Calendar',
      color: 'blue',
      entityType: Calendar.EntityTypes.EVENT,
      sourceId: defaultCalendarSource.id,
      source: defaultCalendarSource,
      name: 'internalCalendarName',
      ownerAccount: 'personal',
      accessLevel: Calendar.CalendarAccessLevel.OWNER,
    });
    console.log(`Your new calendar ID is: ${newCalendarID}`);
  }

  static async createCalendarEvent(req: { event: IEvent, email: string }) {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status === 'denied') {
      return;
    }
    const calendars = await Calendar.getCalendarsAsync();
    const defaultCalendar = (calendars || []).filter(calendar => calendar.title === req.email);
    if (!defaultCalendar.length) {
      console.error(`No calendar: ${req.email}`)
    } else {
      // console.error('defaultCalendar', defaultCalendar);
    }

    await Calendar.createEventAsync(
      defaultCalendar[0].id,
      {
        title: req.event.title,
        startDate: new Date(parseInt(req.event.startedAt, 10)),
        endDate: new Date(parseInt(req.event.endedAt, 10)),
        location: req.event.address,
        url: req.event.eventUrl,
        notes: req.event.summary
      }
    ).then(eventId => {
      console.log(eventId);
    }).catch(err => {
      console.log('create event err', err);
    })
  }
}
