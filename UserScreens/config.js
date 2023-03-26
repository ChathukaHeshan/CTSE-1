import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {

    apiKey: "AIzaSyClEE9A7vvinBXKvf6vtedFXEclj5ed16A",
    authDomain: "reactnativefirebase-00000.firebaseapp.com",
    //databaseURL: "https://reactnativefirebase-00000.firebaseio.com",
    projectId: "react-native-test1-e0147",
    storageBucket: "react-native-test1-e0147.appspot.com",
    messagingSenderId: "1016665930903",
    appId: "1:1016665930903:android:cf1f1bdfa4281df1fe7dd2"

};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };
