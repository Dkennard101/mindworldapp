// Import Firebase modules (already imported above for app & analytics)
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

// Your Firebase app (already initialized)
const auth = getAuth();
const db = getFirestore(app);

// Track current user
let currentUser = null;

// Listen to login state changes
onAuthStateChanged(auth, (user) => {
  currentUser = user;
  if(user){
    console.log("Logged in as", user.email);
  } else {
    console.log("No user logged in");
  }
});

// REGISTER FUNCTION
export async function register(email, password){
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create Firestore document with initial download data
    await setDoc(doc(db, "users", user.uid), {
      email: email,
      isAppUser: false, // change true for app users
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
  } catch(e){
    alert(e.message);
  }
}

// LOGIN FUNCTION
export async function login(email, password){
  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Login successful!");
  } catch(e){
    alert(e.message);
  }
}

// DOWNLOAD FUNCTION
export async function downloadFile(subject, fileName){
  if(!currentUser){
    alert("Please login first to download files!");
    return;
  }

  const userRef = doc(db, "users", currentUser.uid);
  const userSnap = await getDoc(userRef);

  if(!userSnap.exists()){
    alert("User data not found!");
    return;
  }

  const data = userSnap.data();

  // Check if weekly limit exceeded
  const today = new Date();
  let subjectData = data.subjects[subject];

  const weekStart = new Date(subjectData.weekStart);
  const diffDays = Math.floor((today - weekStart)/(1000*60*60*24));

  if(diffDays >= 7){
    // Reset weekly count
    subjectData.weeklyDownloadsUsed = 0;
    subjectData.weekStart = today.toISOString();
    await updateDoc(userRef, { [`subjects.${subject}`]: subjectData });
  }

  if(!data.isAppUser && subjectData.weeklyDownloadsUsed >= 2){
    alert(`Weekly download limit reached for ${subject}`);
    return;
  }

  // Allow download
  window.open(`../subject/${subject}/${fileName}`, "_blank");

  // Update Firestore download count
  if(!data.isAppUser){
    subjectData.weeklyDownloadsUsed += 1;
    await updateDoc(userRef, { [`subjects.${subject}`]: subjectData });
  }
                 }
