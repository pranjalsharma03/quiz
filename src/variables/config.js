import * as firebase from "firebase";
var config = {
  apiKey: "AIzaSyC0aujPE-UGCRT7lurnwiwW4QNqojfEQpY",
  authDomain: "quiz-c74b2.firebaseapp.com",
  projectId: "quiz-c74b2",
  storageBucket: "quiz-c74b2.appspot.com",
  messagingSenderId: "1032788022525",
  appId: "1:1032788022525:web:c5d49dd0502eb4ec421a94",
  databaseURL:"https://quiz-c74b2-default-rtdb.firebaseio.com",
};
// Initialize Firebase
firebase.initializeApp(config);

export default firebase;
