// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDKx62CPU2Rrcs89SYgs4NrRRVIOgGuoTk",
    authDomain: "prepview-3ff1a.firebaseapp.com",
    projectId: "prepview-3ff1a",
    storageBucket: "prepview-3ff1a.firebasestorage.app",
    messagingSenderId: "603401792451",
    appId: "1:603401792451:web:ab0e4c4abc8451eb19ab76",
    measurementId: "G-R1WEED8R2R"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
