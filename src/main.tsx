import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import TimetableScreen from './components/TimetableScreen'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div className="text-neutral-100">
      <TimetableScreen />
    </div>
  </React.StrictMode>,
)
