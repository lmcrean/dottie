import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './globals.css'
import { AssessmentResultProvider } from './context/AssessmentResultContext'
import { AuthProvider } from './context/AuthContext'


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <AssessmentResultProvider>
        <App />
      </AssessmentResultProvider>
    </AuthProvider>
  </React.StrictMode>,
) 