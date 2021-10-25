import * as firebase from "firebase";
var config = {
  apiKey: "AIzaSyC8Gpl1Yb2R0zGRwmEYfuPWaW26XeEPksU",
  authDomain: "quizyaar.firebaseapp.com",
  databaseURL: "https://quizyaar-default-rtdb.firebaseio.com",
  projectId: "quizyaar",
  storageBucket: "quizyaar.appspot.com",
  messagingSenderId: "57544158837",
  appId: "1:57544158837:web:7053a6fb0a1b5424c4923c"
};
// Initialize Firebase
firebase.initializeApp(config);

export default firebase;
