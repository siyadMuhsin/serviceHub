import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from "react-redux";
import './index.css'
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App.tsx'
import { store } from "./store";
// const clientId=proccess.env.CLIENT_ID
const clientId:string = import.meta.env.CLIENT_ID || '477942689524-daq356996ciafm4u6dqjghannke4si1l.apps.googleusercontent.com';
console.log("cliend id",clientId)
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
    <Provider store={store}>
    <App />
    </Provider>

    </GoogleOAuthProvider>
    
  </StrictMode>,
)
