// firebase.js

// Your Firebase Configuration (from your Firebase project settings)
const firebaseConfig = {
    apiKey: "AIzaSyCjVxD9zV4rBoFmAPZ2f2l1YITOGLngx6w",
    authDomain: "tangentsweb.firebaseapp.com",
    projectId: "tangentsweb",
    storageBucket: "tangentsweb.firebasestorage.app",
    messagingSenderId: "384852428123",
    appId: "1:384852428123:web:361c40124d09b4f420467e"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Make Firebase services available globally or export them
// Option 1: Make them global (simpler with current <script> tag setup)
const auth = firebase.auth();
const db = firebase.firestore();

// If you were using ES Modules, you'd do:
// export const auth = firebase.auth();
// export const db = firebase.firestore();
