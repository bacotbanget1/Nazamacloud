// firebase.js
// Firebase configuration and authentication functions

// Firebase Configuration untuk shop.nazamacloud.my.id
const firebaseConfig = {
    apiKey: "AIzaSyDUYq6ysjyU1qF5QajM16Uky78lG3a__eg",
    authDomain: "nazamacloud-auth.firebaseapp.com",
    projectId: "nazamacloud-auth",
    storageBucket: "nazamacloud-auth.appspot.com",
    messagingSenderId: "1092358966529",
    appId: "1:1092358966529:web:3b63eb9773b0bfa12cd67d"
};

// Initialize Firebase
try {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
} catch (error) {
    console.error("Firebase initialization error:", error);
}

// Firebase Auth Instance
const auth = firebase.auth();

// Google Auth Provider
const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');

// Authentication Functions
const FirebaseAuth = {
    // Sign in with Google
    signInWithGoogle: async function() {
        try {
            const result = await auth.signInWithPopup(googleProvider);
            return {
                success: true,
                user: result.user
            };
        } catch (error) {
            console.error("Google Sign-In Error:", error);
            return {
                success: false,
                error: error.message
            };
        }
    },

    // Sign out
    signOut: async function() {
        try {
            await auth.signOut();
            return { success: true };
        } catch (error) {
            console.error("Sign-Out Error:", error);
            return { success: false, error: error.message };
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
        return auth.onAuthStateChanged(callback);
    },

    // Get user data
    getUserData: function() {
        const user = auth.currentUser;
        if (!user) return null;
        
        return {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            emailVerified: user.emailVerified
        };
    }
};

// Make it available globally
window.FirebaseAuth = FirebaseAuth;
window.firebaseAuth = auth;