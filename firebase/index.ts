import firebase from "firebase";
import { firebaseConfig } from "./config";
import { Platform } from 'react-native';
import * as Google from "expo-google-app-auth";
import * as Calendar from "expo-calendar";
import moment from "moment";
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

  static async handleLogIn(): Promise<firebase.auth.UserCredential> {
    // await GoogleSignIn.initAsync({
    //   clientId:
    //     "324221214715-jqkk2f6qbnk0snqsqo9je6sb0nh15l0m.apps.googleusercontent.com"
    // });
    // const logInInfo = await GoogleSignIn.signInSilentlyAsync()
    const logInInfo = await Google.logInAsync({
      behavior: "web",
      clientId:
        "324221214715-jqkk2f6qbnk0snqsqo9je6sb0nh15l0m.apps.googleusercontent.com",
      scopes: ["profile", "email"]
    })
      .then(async result => {
        if (result.type === "success") {
          const { idToken, accessToken } = result;
          const credential = firebase.auth.GoogleAuthProvider.credential(
            idToken,
            accessToken
          );
          const user = await firebase
            .auth()
            .signInWithCredential(credential)
            .then(result => {
              return result;
            })
            .catch(({ message }) => {
              // dispatch({
              //   type: "FAIL_AUTH_USER",
              //   message
              // });
              throw {
                status: 500,
                code: "dame"
              };
            });
          return user;
        } else {
          // dispatch({
          //   type: "FAIL_AUTH_USER",
          //   message: result.type
          // });
          throw {
            status: 500,
            code: "dame"
          };
        }
      })
      .catch(e => {
        console.log(e);
        // dispatch({
        //   type: "FAIL_AUTH_USER",
        //   message
        // });
        throw {
          status: 500,
          code: "dame"
        };
      });
    return logInInfo;
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

  static async createEvent() {
    console.log('createEvent');
    const calendars = await Calendar.getCalendarsAsync();
    console.log('calendars', calendars);
    // const defaultCalendar = calendars[0];
    const defaultCalendar = calendars.filter(calendar => calendar.title === "puertocampo@gmail.com");
    console.log(defaultCalendar);

    await Calendar.createEventAsync(
      defaultCalendar[0].id,
      {
        title: "EXPO EVENT!",
        startDate: moment()
          .add(moment.duration(0, "day"))
          .toDate(),
        endDate: moment()
          .add(moment.duration(1, "day"))
          .toDate()
      }
    ).then(eventId => {
      console.log(eventId);
    }).catch(err => {
      console.log(err);
    })

  }
}
