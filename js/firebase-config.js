/**
 * Firebase Configuration and Initialization for Student Hub
 * Connected to Firebase Project: student-hub-10909
 */

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAk09bdmPo3NKDlqDyrfX_WCpCjzcg5t0Y",
  authDomain: "student-hub-10909.firebaseapp.com",
  projectId: "student-hub-10909",
  storageBucket: "student-hub-10909.firebasestorage.app",
  messagingSenderId: "481694141354",
  appId: "1:481694141354:web:23327ebf377011f0b639d3"
};

const FirebaseManager = {
  db: null,
  isInitialized: false,
  isOnline: false,
  listeners: [],

  init() {
    if (this.isInitialized && this.db) return this.db;

    try {
      if (typeof firebase !== 'undefined') {
        if (!firebase.apps || !firebase.apps.length) {
          firebase.initializeApp(FIREBASE_CONFIG);
        }
        this.db = firebase.firestore();
        this.isInitialized = true;
        this.isOnline = navigator.onLine;

        // Enable offline persistence if possible
        try {
          this.db.enablePersistence({ synchronizeTabs: true }).catch(err => {
            // Multiple tabs open or not supported, ignore silently
          });
        } catch (e) {}

        // Listen to browser network changes
        window.addEventListener('online', () => {
          this.isOnline = true;
          this.notifyStatus(true);
        });
        window.addEventListener('offline', () => {
          this.isOnline = false;
          this.notifyStatus(false);
        });

        console.log('✓ Firebase Firestore initialized for student-hub-10909');
        this.notifyStatus(true);
        return this.db;
      } else {
        console.warn('Firebase SDK not loaded; operating in Local Storage Mode');
        return null;
      }
    } catch (err) {
      console.warn('Firebase initialization notice (running in local storage fallback):', err);
      return null;
    }
  },

  onStatusChange(callback) {
    if (typeof callback === 'function') {
      this.listeners.push(callback);
      callback(this.isOnline && this.isInitialized);
    }
  },

  notifyStatus(status) {
    this.listeners.forEach(cb => {
      try { cb(status); } catch (e) { console.error(e); }
    });
  }
};

// Initialize if Firebase SDK is loaded
if (typeof firebase !== 'undefined') {
  FirebaseManager.init();
}
