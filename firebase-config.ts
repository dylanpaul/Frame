// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getDatabase } from "firebase/database"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
    apiKey: "AIzaSyA5Oy6dUBLWn8fub4vGP-Dg-ScV2kp2IUY",
    authDomain: "frames-6f008.firebaseapp.com",
    projectId: "frames-6f008",
    storageBucket: "frames-6f008.appspot.com",
    messagingSenderId: "1021460398777",
    appId: "1:1021460398777:web:b7fb4f95bf521e7cd29168",
    measurementId: "G-L0TLX8WYV3"
  };

export const app = initializeApp(firebaseConfig)
export const database = getDatabase(app)
export const storage = getStorage(app)

module.exports = firebaseConfig;
