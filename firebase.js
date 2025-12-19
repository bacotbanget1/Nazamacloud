// firebase.js - ENHANCED VERSION
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

// YOUR CONFIG - JANGAN DIUBAH
const firebaseConfig = {
    apiKey: "AIzaSyCMAyuNDEX3O6t3L55Ah7bovQdlIT5YOow",
    authDomain: "namacloud-51780.firebaseapp.com",
    projectId: "namacloud-51780",
    storageBucket: "namacloud-51780.firebasestorage.app",
    messagingSenderId: "563671689924",
    appId: "1:563671689924:web:36a44881c5b2959de57791"
};

console.log("🔥 Firebase Config Loaded:", {
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain,
    apiKeyLength: firebaseConfig.apiKey?.length || 0
});

// Initialize Firebase
let app, auth;

try {
    app = initializeApp(firebaseConfig);
    console.log("✅ Firebase App initialized:", app.name);
    
    auth = getAuth(app);
    console.log("✅ Firebase Auth initialized");
    
    // Test connection
    console.log("🔗 Current domain:", window.location.hostname);
    console.log("👤 Current user:", auth.currentUser);
    
} catch (error) {
    console.error("❌ Firebase initialization failed:", error);
    alert("Firebase Error: " + error.message);
}

// Create Google Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');

// Set custom parameters
googleProvider.setCustomParameters({
    prompt: 'select_account',
    login_hint: '',
    hd: ''
});

// Firebase Auth Functions with better error handling
window.FirebaseAuth = {
    signInWithGoogle: async function() {
        console.group("🔑 Google Sign-In Attempt");
        
        if (!auth) {
            const error = "Firebase Auth not initialized. Check console.";
            console.error(error);
            console.groupEnd();
            return { success: false, error: error };
        }
        
        try {
            console.log("1. Creating popup...");
            
            // Add a small delay to ensure popup works
            await new Promise(resolve => setTimeout(resolve, 100));
            
            console.log("2. Calling signInWithPopup...");
            const result = await signInWithPopup(auth, googleProvider);
            
            console.log("✅ SUCCESS! User:", {
                email: result.user.email,
                name: result.user.displayName,
                uid: result.user.uid
            });
            
            console.groupEnd();
            return { 
                success: true, 
                user: result.user 
            };
            
        } catch (error) {
            console.error("❌ FAILED! Error details:", {
                code: error.code,
                message: error.message,
                email: error.email,
                credential: error.credential,
                fullError: error
            });
            
            // Specific error handling
            let userMessage = error.message;
            
            if (error.code === 'auth/popup-blocked') {
                userMessage = "Popup diblokir browser. Izinkan popup untuk situs ini.";
            } else if (error.code === 'auth/popup-closed-by-user') {
                userMessage = "Popup ditutup sebelum login selesai.";
            } else if (error.code === 'auth/unauthorized-domain') {
                userMessage = "Domain tidak diizinkan. Tambahkan domain ke Firebase Console.";
            } else if (error.code === 'auth/configuration-not-found') {
                userMessage = "Google Sign-In belum diaktifkan di Firebase Console.";
            }
            
            console.groupEnd();
            return { 
                success: false, 
                error: userMessage,
                code: error.code,
                originalError: error.message
            };
        }
    },
    
    signOut: async function() {
        if (!auth) return { success: false, error: "Auth not initialized" };
        try {
            await signOut(auth);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },
    
    getCurrentUser: function() {
        return auth ? auth.currentUser : null;
    },
    
    isLoggedIn: function() {
        return auth ? auth.currentUser !== null : false;
    },
    
    onAuthStateChanged: function(callback) {
        if (!auth) {
            console.warn("Auth not ready");
            return () => {};
        }
        return onAuthStateChanged(auth, callback);
    },
    
    // Test function
    testConnection: function() {
        return {
            firebaseReady: !!auth,
            config: firebaseConfig,
            domain: window.location.hostname,
            timestamp: new Date().toISOString()
        };
    }
};

// Auto-test on load
setTimeout(() => {
    console.log("🧪 FirebaseAuth Test:", {
        available: typeof FirebaseAuth !== 'undefined',
        functions: Object.keys(FirebaseAuth),
        test: FirebaseAuth.testConnection ? FirebaseAuth.testConnection() : "No test function"
    });
}, 1500);
