// Import Firebase from CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";

import { firebaseConfig } from "/js/config/firebase.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Make available globallly if needed
window.firebaseApp = app;
window.firebaseAnalytics = analytics;

console.log("Firebase initialized");
