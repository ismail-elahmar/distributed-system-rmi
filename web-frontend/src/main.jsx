import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// Import SignIn.css after index.css to ensure it overrides Tailwind
import '../SignIn.css'
import App from './App.jsx'

// Add error handling
try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element not found!');
  }
  
  console.log('Mounting React app...');
  
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
    <App />
    </StrictMode>
  );
  
  console.log('React app mounted successfully');
} catch (error) {
  console.error('Failed to mount React app:', error);
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 20px; font-family: sans-serif; background: #fee; color: #c00; min-height: 100vh;">
        <h1>Error Loading App</h1>
        <p><strong>Error:</strong> ${error.message}</p>
        <pre style="background: #fff; padding: 10px; border-radius: 4px; overflow: auto;">${error.stack}</pre>
        <button onclick="window.location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #c00; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Reload Page
        </button>
      </div>
    `;
  }
}


