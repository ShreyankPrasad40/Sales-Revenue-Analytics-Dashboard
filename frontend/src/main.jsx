import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ColorModeProvider } from './ColorModeContext.jsx'
import { Provider } from 'react-redux'
import { store } from './store/store'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ColorModeProvider>
        <App />
      </ColorModeProvider>
    </Provider>
  </React.StrictMode>,
)
