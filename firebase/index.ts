import firebase from "firebase";
import { firebaseConfig } from "./config";
import * as Google from "expo-google-app-auth";
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
}
