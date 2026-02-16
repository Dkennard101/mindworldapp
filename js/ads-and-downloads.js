// ads-and-downloads.js
// Modular Firebase (CDN ONLY)

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

// 🔹 Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAlYXlGCDZOy_DXMNSX3GGCKmucOlJgvbM",
  authDomain: "mind-world-13a05.firebaseapp.com",
  projectId: "mind-world-13a05",
  storageBucket: "mind-world-13a05.firebasestorage.app",
  messagingSenderId: "32577127287",
  appId: "1:32577127287:web:673dd883f027bb6bdcd772"
};

// 🔹 Initialize ONCE
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let currentUser = null;
window.isSubscriber = false;

// 🔹 Auth Listener
onAuthStateChanged(auth, async (user) => {
  currentUser = user;

  if (user) {
    const snap = await getDoc(doc(db, "users", user.uid));
    window.isSubscriber = snap.exists() && snap.data().subscription === true;
  } else {
    window.isSubscriber = false;
  }
});

// 🔹 Register
window.registerUser = async (email, password) => {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);

    await setDoc(doc(db, "users", cred.user.uid), {
      email: email,
      subscription: false,
      isAppUser: false,
      subjects: {}
    });

    alert("Registered successfully");
  } catch (e) {
    alert(e.message);
  }
};

// 🔹 Login
window.loginUser = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Login successful");
  } catch (e) {
    alert(e.message);
  }
};

// 🔹 Logout
window.logoutUser = async () => {
  await signOut(auth);
  alert("Logged out");
};

// 🔹 Protected Navigation
window.openMaterial = function (url) {
  if (window.isSubscriber) {
    window.location.href = url;
  } else {
    showRewardedAd().then((success) => {
      if (success) {
        window.location.href = url;
      } else {
        alert("You must watch the ad.");
      }
    });
  }
};

// 🔹 Simulated Rewarded Ad
function showRewardedAd() {
  return new Promise((resolve) => {
    let watched = confirm("Simulated rewarded ad. Click OK to continue.");
    resolve(watched);
  });
                   }
