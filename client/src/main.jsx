// src/main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router'
import { ClerkProvider } from '@clerk/clerk-react'
import './index.css'

import Layout from './components/Layout'
import App from './App.jsx'
import Pricing from './routes/Pricing.jsx'
import Study from './routes/Study.jsx'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if(!PUBLISHABLE_KEY){
  throw new Error('Add your Clerk Publishable Key to the .env file')
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <Routes>
          <Route element={<Layout />}>
            <Route path='/' element={<App/>} />
            <Route path='/pricing' element={<Pricing/>} />
            <Route path='/study' element={<Study/>} />
          </Route>
        </Routes>
      </ClerkProvider>
    </BrowserRouter>
  </StrictMode>
)