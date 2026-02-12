// Firebase Modular SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } 
from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } 
from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAlYXlGCDZOy_DXMNSX3GGCKmucOlJgvbM",
  authDomain: "mind-world-13a05.firebaseapp.com",
  projectId: "mind-world-13a05",
  storageBucket: "mind-world-13a05.firebasestorage.app",
  messagingSenderId: "32577127287",
  appId: "1:32577127287:web:673dd883f027bb6bdcd772",
  measurementId: "G-YJN172VJQ2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

window.isSubscriber = false;

// 🔹 Check subscription
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists() && userDoc.data().subscription === true) {
      window.isSubscriber = true;
    } else {
      window.isSubscriber = false;
    }
  } else {
    window.isSubscriber = false;
  }
});

// 🔹 Register
window.registerUser = async (email, password) => {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await setDoc(doc(db, "users", cred.user.uid), {
    email: email,
    subscription: false
  });
  alert("Registered successfully");
};

// 🔹 Login
window.loginUser = async (email, password) => {
  await signInWithEmailAndPassword(auth, email, password);
  alert("Login successful");
};

// 🔹 Logout
window.logoutUser = async () => {
  await signOut(auth);
  alert("Logged out");
};

// 🔹 Protected Navigation
window.openMaterial = function(url) {
  if (window.isSubscriber) {
    window.location.href = url;
  } else {
    alert("Watch ad first (rewarded ad placeholder)");
    window.location.href = url;
  }
};
