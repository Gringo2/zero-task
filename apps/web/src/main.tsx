import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/tokens.css'
import App from './App.tsx'

/**
 * Application Entry Point
 * 
 * Mounts the React application to the DOM.
 * Wraps the App component in StrictMode for development checks.
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
