// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyBa6PCM0gxZ58tM4odhzD4S7i_Mq5Bwafk",
  authDomain: "motoprog-dbbd6.firebaseapp.com",
  projectId: "motoprog-dbbd6",
  storageBucket: "motoprog-dbbd6.appspot.com",
  messagingSenderId: "122581464911",
  appId: "1:122581464911:web:67336793dbc2888613373a"
};
 
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const firestore = getFirestore(app);

export const createUserDocument = async (user,additinalData) =>{
  if (!user) return;
  const userRef = firestore.doc(`users/${user.uid}`);
  const snapshot = await userRef.get();

  
  
};
export default app;