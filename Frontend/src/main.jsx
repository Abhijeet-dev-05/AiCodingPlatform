import { createRoot } from 'react-dom/client'
import './index.css'
import './visualizer/visualizer-theme.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router'
import {Provider} from 'react-redux'
import {store} from './store/store'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { ToastProvider } from './design-system/components/index'

createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <Provider store={store}>
      <BrowserRouter>
        <ToastProvider>
          <App />
        </ToastProvider>
      </BrowserRouter>
    </Provider>
  </GoogleOAuthProvider>,
)
