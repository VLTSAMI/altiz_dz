const firebaseConfig = {
    apiKey: "AIzaSyCNco6kLvd7CBwVutBqlXbT_1sgsqPWz9s",
    authDomain: "altiz1dz.firebaseapp.com",
    projectId: "altiz1dz",
    storageBucket: "altiz1dz.firebasestorage.app",
    messagingSenderId: "716320058728",
    appId: "1:716320058728:web:54d7fcb0dc72aba8347add"
};

// Initialize Firebase (Compat Version)
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = firebase.storage();
