import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyC5K-ydmgJZj3z2bIRkE0wG5it9SyayQYE",
    authDomain: "sinbike-404fb.firebaseapp.com",
    projectId: "sinbike-404fb",
    storageBucket: "sinbike-404fb.appspot.com",
    messagingSenderId: "541850232398",
    appId: "1:541850232398:web:3150ade1d2dfc42b41051f"
  })

  const auth = firebaseApp.auth();
  const db = firebaseApp.firestore();
  const storage = firebaseApp.storage().ref();

  export{auth, db, storage}