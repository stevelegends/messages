// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { initializeAuth, getReactNativePersistence } from "firebase/auth";

import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCw5SemuIGMq2SbaP_Gc6gIOV3SsgBX61Q",
    authDomain: "messages-5a5fc.firebaseapp.com",
    projectId: "messages-5a5fc",
    storageBucket: "messages-5a5fc.appspot.com",
    messagingSenderId: "567934374966",
    appId: "1:567934374966:web:84972711665536a032f497"
};

const firebaseInitializeApp = initializeApp(firebaseConfig);

__DEV__ && console.log("firebase initializeApp");

export const getFirebaseApp = () => firebaseInitializeApp;

/** initialize auth */
const auth = initializeAuth(firebaseInitializeApp, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export const getFirebaseAuth = () => auth;
