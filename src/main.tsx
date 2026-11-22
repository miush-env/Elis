import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import './index.css'
import App from './App.tsx'
import Climate from './pages/Climate.tsx';
import Timer from './pages/Timer.tsx';
import Stopwatch from './pages/Stopwatch.tsx';
import { AlarmGlobalListener } from './components/AlarmGlobalListener.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      {/* Escucha alarmas en toda la aplicación, sin importar qué pantalla esté abierta */}
      <AlarmGlobalListener />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/climate" element={<Climate />} />
        <Route path="/stopwatch" element={<Stopwatch />} />
        <Route path="/timer" element={<Timer />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
