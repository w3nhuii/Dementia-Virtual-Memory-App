import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import { createContext } from 'react';

const firebaseConfig = {
    apiKey: "AIzaSyALWlOcy4aMuOi0fNQ5PKqWldk0oNv5Grw",
    authDomain: "dementia-virtual-memory-d26b1.firebaseapp.com",
    projectId: "dementia-virtual-memory-d26b1",
    storageBucket: "dementia-virtual-memory-d26b1.appspot.com",
    messagingSenderId: "631993696535",
    appId: "1:631993696535:web:4a8f66112950056220f752"
};

if(!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export {firebase}

