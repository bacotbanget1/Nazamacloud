// firebase.js - Firebase Version 12 (Modular)
import { 
    initializeApp 
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";

import { 
    getAuth, 
    GoogleAuthProvider, 
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

// PASTE CONFIG ANDA DISINI:
const firebaseConfig = {
    apiKey: "AIzaSyCMAyuNDEX3O6t3L55Ah7bovQdlIT5YOow",
    authDomain: "namacloud-51780.firebaseapp.com",
    projectId: "namacloud-51780",
    storageBucket: "namacloud-51780.firebasestorage.app",
    messagingSenderId: "563671689924",
    appId: "1:563671689924:web:36a44881c5b2959de57791"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Initialize Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');

// Firebase Auth Functions
const FirebaseAuth = {
    // Sign in with Google
    signInWithGoogle: async function() {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            console.log("✅ Login berhasil:", result.user.email);
            return { 
                success: true, 
                user: result.user 
            };
        } catch (error) {
            console.error("❌ Login gagal:", error);
            return { 
                success: false, 
                error: error.message 
            };
        }
    },

    // Sign out
    signOut: async function() {
        try {
            await signOut(auth);
            console.log("✅ Logout berhasil");
            return { success: true };
        } catch (error) {
            console.error("❌ Logout gagal:", error);
            return { 
                success: false, 
                error: error.message 
            };
        }
    },

    // Get current user
    getCurrentUser: function() {
        return auth.currentUser;
    },

    // Check if user is logged in
    isLoggedIn: function() {
        return auth.currentUser !== null;
    },

    // Listen to auth state changes
    onAuthStateChanged: function(callback) {
        return onAuthStateChanged(auth, callback);
    }
};

// Export for global use
window.FirebaseAuth = FirebaseAuth;

// Debug info
console.log("🔥 Firebase v12 initialized successfully!");
console.log("🔑 Project ID:", firebaseConfig.projectId);
console.log("🌐 Auth Domain:", firebaseConfig.authDomain);
