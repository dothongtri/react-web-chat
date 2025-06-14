import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="279283803344-84h9d3v7uef0apvliliedvp9cg372up2.apps.googleusercontent.com">
    <App />
    </GoogleOAuthProvider>  
  </StrictMode>,
)
