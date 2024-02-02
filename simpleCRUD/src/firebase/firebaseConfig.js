
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  databaseURL: "https://crud-54d93-default-rtdb.asia-southeast1.firebasedatabase.app/",
  apiKey: "AIzaSyAE0VFUs7ajxIjb0hWR8ITIav0rN-tf5TA",
  authDomain: "crud-54d93.firebaseapp.com",
  databaseURL: "https://crud-54d93-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "crud-54d93",
  storageBucket: "crud-54d93.appspot.com",
  messagingSenderId: "583452784967",
  appId: "1:583452784967:web:1a7467e17a7100c628f462",
  measurementId: "G-J8BR9RZ15C"
};

const app = initializeApp(firebaseConfig);

export {app};