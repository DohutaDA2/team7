import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const config = {
  apiKey: "AIzaSyBzl6FcLr0BaxAL7wpw8B7zNQa9wlAYk6g",
  authDomain: "moneylover-8b808.firebaseapp.com",
  databaseURL: "https://moneylover-8b808.firebaseio.com",
  projectId: "moneylover-8b808",
  storageBucket: "moneylover-8b808.appspot.com",
  messagingSenderId: "407828220548"
};

export const AUTH = {
  url:
    "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyCustomToken?key=AIzaSyBzl6FcLr0BaxAL7wpw8B7zNQa9wlAYk6g",
  signUpURL:
    "https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyBzl6FcLr0BaxAL7wpw8B7zNQa9wlAYk6g",
  signInURL:
    "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyBzl6FcLr0BaxAL7wpw8B7zNQa9wlAYk6g"
};

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const firestoreCore = firebase.firestore();
firestoreCore.settings({ timestampsInSnapshots: true });

const auth = firebase.auth();
export const doCreateUserWithEmailAndPwd = (email, pwd) =>
  auth.createUserWithEmailAndPassword(email, pwd);
export const doSignInWithEmailAndPassword = (email, pwd) =>
  auth.signInWithEmailAndPassword(email, pwd);
export const doSignOut = () => auth.signOut();

export { auth, firestoreCore, firebase };
