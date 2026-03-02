// 🔹 Firebase Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
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
  appId: "1:32577127287:web:673dd883f027bb6bdcd772",
  measurementId: "G-YJN172VJQ2"
};

// 🔹 Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 🔹 Global Variables
let currentUser = null;
window.isSubscriber = false;

// 🔹 Auth State Listener
onAuthStateChanged(auth, async (user) => {
  currentUser = user;
  if (user) {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    window.isSubscriber = userDoc.exists() && userDoc.data().subscription === true;
    console.log("Logged in as", user.email);
  } else {
    window.isSubscriber = false;
    console.log("No user logged in");
  }
});

// 🔹 REGISTER FUNCTION
export async function registerUser(email, password) {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, "users", cred.user.uid), {
      email: email,
      isAppUser: false,
      subscription: "free",
      subjects: {
        mathematics: { weeklyDownloadsUsed: 0, weekStart: new Date().toISOString() },
        english: { weeklyDownloadsUsed: 0, weekStart: new Date().toISOString() },
        shona: { weeklyDownloadsUsed: 0, weekStart: new Date().toISOString() },
        ndebele: { weeklyDownloadsUsed: 0, weekStart: new Date().toISOString() },
        science: { weeklyDownloadsUsed: 0, weekStart: new Date().toISOString() },
        biology: { weeklyDownloadsUsed: 0, weekStart: new Date().toISOString() },
        chemistry: { weeklyDownloadsUsed: 0, weekStart: new Date().toISOString() },
        physics: { weeklyDownloadsUsed: 0, weekStart: new Date().toISOString() },
        geography: { weeklyDownloadsUsed: 0, weekStart: new Date().toISOString() },
        history: { weeklyDownloadsUsed: 0, weekStart: new Date().toISOString() },
        rme: { weeklyDownloadsUsed: 0, weekStart: new Date().toISOString() },
        commerce: { weeklyDownloadsUsed: 0, weekStart: new Date().toISOString() },
        accounts: { weeklyDownloadsUsed: 0, weekStart: new Date().toISOString() },
        agriculture: { weeklyDownloadsUsed: 0, weekStart: new Date().toISOString() },
        ict: { weeklyDownloadsUsed: 0, weekStart: new Date().toISOString() },
        economics: { weeklyDownloadsUsed: 0, weekStart: new Date().toISOString() },
        business: { weeklyDownloadsUsed: 0, weekStart: new Date().toISOString() },
        computerscience: { weeklyDownloadsUsed: 0, weekStart: new Date().toISOString() }
      }
    });
    alert("Registration successful!");
  } catch (e) {
    alert(e.message);
  }
}

// 🔹 LOGIN FUNCTION
export async function loginUser(email, password) {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Login successful!");
  } catch (e) {
    alert(e.message);
  }
}

// 🔹 LOGOUT FUNCTION
export async function logoutUser() {
  await signOut(auth);
  alert("Logged out");
}

// 🔹 Rewarded Ad Simulation
async function showRewardedAd() {
  return new Promise(resolve => {
    const watched = confirm("Watch ad to continue?");
    resolve(watched);
  });
}

// 🔹 OPEN MATERIAL (Protected)
window.openMaterial = async function(url) {
  if (window.isSubscriber) {
    window.location.href = url;
  } else {
    const watched = await showRewardedAd();
    if (watched) window.location.href = url;
  }
};

// 🔹 DOWNLOAD FILE WITH WEEKLY LIMIT
export async function downloadFile(subject, fileName) {
  if (!currentUser) { alert("Please login first to download files!"); return; }
  const userRef = doc(db, "users", currentUser.uid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) { alert("User data not found!"); return; }

  const data = userSnap.data();
  let subjectData = data.subjects?.[subject];
  if (!subjectData) { alert("Subject not found!"); return; }

  // Weekly reset
  const today = new Date();
  const weekStart = new Date(subjectData.weekStart || today.toISOString());
  const diffDays = Math.floor((today - weekStart) / (1000*60*60*24));
  if (diffDays >= 7) {
    subjectData.weeklyDownloadsUsed = 0;
    subjectData.weekStart = today.toISOString();
    await updateDoc(userRef, { [`subjects.${subject}`]: subjectData });
  }

  // Weekly limit check
  if (!data.isAppUser && subjectData.weeklyDownloadsUsed >= 2) {
    alert(`Weekly download limit reached for ${subject}`);
    return;
  }

  // Open file
  window.open(`subjects/${subject}/${fileName}`, "_blank");

  // Update count
  if (!data.isAppUser) {
    subjectData.weeklyDownloadsUsed += 1;
    await updateDoc(userRef, { [`subjects.${subject}`]: subjectData });
  }
}; 
