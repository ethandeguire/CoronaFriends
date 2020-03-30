// Initialize Firebase
var firebaseConfig = {
  apiKey: "AIzaSyDq1V80j2ffKoZ8k-Lx33fA4d2YnMZkRWE",
  authDomain: "corona-friends.firebaseapp.com",
  databaseURL: "https://corona-friends.firebaseio.com",
  projectId: "corona-friends",
  storageBucket: "corona-friends.appspot.com",
  messagingSenderId: "293509465092",
  appId: "1:293509465092:web:4f3442d1d5c9ae746f6151",
  measurementId: "G-G9FV2L8SGQ"
};
firebase.initializeApp(firebaseConfig);
firebase.analytics();

// make auth and firestore references
const auth = firebase.auth();
const db = firebase.firestore();
const functions = firebase.functions();

// Initialized FirebaseUI
// FirebaseUI config.
var uiConfig = {
  signInSuccessUrl: '/index.html',
  signInOptions: [
    // firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.GoogleAuthProvider.PROVIDER_ID
  ],
  tosUrl: '<your-tos-url>',
  privacyPolicyUrl: '<your-tos-url>'
};

// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());
// The start method will wait until the DOM is loaded.
ui.start('#firebaseui-auth-container', uiConfig);