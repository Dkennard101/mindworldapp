// Firebase config (replace with your own)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

async function downloadFile(subject, fileName) {
  const user = auth.currentUser;
  if (!user) {
    alert("Login to download files!");
    return;
  }

  const uid = user.uid;
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());

  const userDoc = db.collection("users").doc(uid);
  const doc = await userDoc.get();
  let data = doc.exists ? doc.data() : {};

  if (!data.subjects) data.subjects = {};
  if (!data.subjects[subject]) data.subjects[subject] = {
    weeklyDownloadsUsed: 0,
    weekStart: weekStart.toISOString()
  };

  const lastWeek = new Date(data.subjects[subject].weekStart);
  if (today - lastWeek >= 7*24*60*60*1000) {
    data.subjects[subject].weeklyDownloadsUsed = 0;
    data.subjects[subject].weekStart = weekStart.toISOString();
  }

  if (data.subjects[subject].weeklyDownloadsUsed >= 2) {
    alert("Weekly download limit reached for " + subject + ". Resets next week.");
    return;
  }

  window.open(`../public/${subject}/${fileName}`, '_blank');
  data.subjects[subject].weeklyDownloadsUsed += 1;
  await userDoc.set(data, { merge: true });
}
