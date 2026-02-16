import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";
import { app } from "./firebase-config.js"; // Only Firebase initialization

const auth = getAuth(app);
const db = getFirestore(app);

let currentUser = null;
window.isSubscriber = false;

onAuthStateChanged(auth, async (user) => {
  currentUser = user;
  if(user){
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if(userDoc.exists() && userDoc.data().subscription === true){
      window.isSubscriber = true;
    } else {
      window.isSubscriber = false;
    }
  } else {
    window.isSubscriber = false;
  }
});

export async function downloadFile(subject, fileName){
  if(!currentUser){
    alert("Please login first to download files!");
    return;
  }

  const userRef = doc(db, "users", currentUser.uid);
  const userSnap = await getDoc(userRef);
  if(!userSnap.exists()){ alert("User data not found!"); return; }

  const data = userSnap.data();
  let subjectData = data.subjects[subject];

  // Weekly limit reset logic
  const today = new Date();
  const weekStart = new Date(subjectData.weekStart);
  const diffDays = Math.floor((today - weekStart)/(1000*60*60*24));
  if(diffDays >= 7){
    subjectData.weeklyDownloadsUsed = 0;
    subjectData.weekStart = today.toISOString();
    await updateDoc(userRef, { [`subjects.${subject}`]: subjectData });
  }

  if(!data.isAppUser && subjectData.weeklyDownloadsUsed >= 2){
    alert(`Weekly download limit reached for ${subject}`);
    return;
  }

  // Open download from subjects folder
  window.open(`subjects/${subject}/${fileName}`, "_blank");

  // Update download count
  if(!data.isAppUser){
    subjectData.weeklyDownloadsUsed += 1;
    await updateDoc(userRef, { [`subjects.${subject}`]: subjectData });
  }
}

// Rewarded ad simulation
export function showRewardedAd(){
  return new Promise(resolve => {
    const watched = confirm("Simulated ad: Click OK to simulate watching ad.");
    resolve(watched);
  });
}

window.openMaterial = async function(url){
  if(window.isSubscriber){
    window.location.href = url;
  } else {
    const watched = await showRewardedAd();
    if(watched) window.location.href = url;
  }
}
