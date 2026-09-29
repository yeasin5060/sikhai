import React from 'react';
import { createRoot } from 'react-dom/client';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import 'lenis/dist/lenis.css';
import './index.css';

gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis({
  smoothWheel: true,
  syncTouch: false,
  anchors: true,
});

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
window.lenis = lenis;

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: { borderRadius: '12px', fontFamily: 'inherit' },
        success: { style: { background: '#ecfdf5', color: '#166534' } },
        error: { style: { background: '#fff1f2', color: '#9f1239' } },
      }}
    />
  </React.StrictMode>,
);
