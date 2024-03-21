import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { CompletedTasksProvider } from './context/CompletedTasksContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CompletedTasksProvider>
      <App />
    </CompletedTasksProvider>
  </React.StrictMode>
);
