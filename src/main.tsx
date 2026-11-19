import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter,  Routes, Route } from "react-router";
import './index.css'
import App from './App.tsx'
import TestPage from './pages/TestPage.tsx';
import WorldClock from './pages/WorldClock.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/world-clock" element={<WorldClock />} />
      <Route path="/stopwach" element={<TestPage />} />
      <Route path="/timer" element={<TestPage />} />
    </Routes>
  </BrowserRouter>,
  </StrictMode>,
)
