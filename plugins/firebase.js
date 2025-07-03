import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";
import useUser from "~/composables/useUser";

export default defineNuxtPlugin((nuxtApp) => {
  const firebaseConfig = {
    apiKey: nuxtApp.$config.public.firebaseApiKey,
    authDomain: nuxtApp.$config.public.firebaseAuthDomain,
    projectId: nuxtApp.$config.public.firebaseProjectId,
    storageBucket: nuxtApp.$config.public.firebaseStorageBucket,
    messagingSenderId: nuxtApp.$config.public.firebaseMessagingSenderId,
    appId: nuxtApp.$config.public.firebaseAppId,
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  nuxtApp.provide("auth", auth);
  nuxtApp.provide("db", db);

  const { setUser } = useUser();

  onAuthStateChanged(auth, async (currentUser) => {
    setUser(currentUser);

    if (currentUser) {
      const userRef = doc(db, "users", currentUser.uid);
      try {
        await setDoc(
          userRef,
          {
            email: currentUser.email,
            createdAt: currentUser.metadata.creationTime
              ? new Date(currentUser.metadata.creationTime)
              : serverTimestamp(),
            lastLoginAt: serverTimestamp(),
          },
          { merge: true }
        );
        console.log(
          "User document created/updated in Firestore:",
          currentUser.uid
        );
      } catch (e) {
        console.error("Error creating/updating user document:", e);
      }
    }
  });
});
