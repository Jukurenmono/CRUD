import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { CompletedTasksProvider } from './context/CompletedTasksContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CompletedTasksProvider>
      <App />
    </CompletedTasksProvider>
  </React.StrictMode>,
)
