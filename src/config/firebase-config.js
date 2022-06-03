import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAWiPDoVrTUI7BOT0ELgPHH-wCcihr0bcA",
  authDomain: "project-web-5ace5.firebaseapp.com",
  projectId: "project-web-5ace5",
  storageBucket: "project-web-5ace5.appspot.com",
  messagingSenderId: "1086083475752",
  appId: "1:1086083475752:web:554b1ed1306858ee98481d"
};

const app = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(app);

export { firebaseAuth }