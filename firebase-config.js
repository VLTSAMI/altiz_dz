// Altiz Solutions DZ - Firebase Configuration & Initialization
const firebaseConfig = {
    apiKey: "AIzaSyCNco6kLvd7CBwVutBqlXbT_1sgsqPWz9s",
    authDomain: "altiz1dz.firebaseapp.com",
    projectId: "altiz1dz",
    storageBucket: "altiz1dz.firebasestorage.app",
    messagingSenderId: "716320058728",
    appId: "1:716320058728:web:54d7fcb0dc72aba8347add"
};

// Initialize Firebase (Compat Version)
if (typeof firebase !== 'undefined' && (!firebase.apps || !firebase.apps.length)) {
    firebase.initializeApp(firebaseConfig);
}

const db = (typeof firebase !== 'undefined' && typeof firebase.firestore === 'function') 
    ? firebase.firestore() 
    : null;

const auth = (typeof firebase !== 'undefined' && typeof firebase.auth === 'function') 
    ? firebase.auth() 
    : null;

const storage = (typeof firebase !== 'undefined' && typeof firebase.storage === 'function') 
    ? firebase.storage() 
    : null;
