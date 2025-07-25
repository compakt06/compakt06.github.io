import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './auth/authContext'
import { auth } from './firebase/firebase' // Import auth directly from firebase config

// Initialize Firebase before React app starts
function initFirebase() {
  console.log("Firebase initialized", auth) // Verify initialization
}

initFirebase()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
)