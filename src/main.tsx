import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter,  Routes, Route } from "react-router";
import './index.css'
import App from './App.tsx'
import TestPage from './pages/TestPage.tsx';
import Climate from './pages/Climate.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/climate" element={<Climate />} />
      <Route path="/stopwach" element={<TestPage />} />
      <Route path="/timer" element={<TestPage />} />
    </Routes>
  </BrowserRouter>,
  </StrictMode>,
)
