
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Preload critical resources
const preloadResources = () => {
  const links = [
    '/lovable-uploads/4f75fa74-78b9-452a-8966-617f384ebf8a.png', // Favicon
    '/lovable-uploads/0bfd5d0a-98bb-4d65-b908-60d9337659de.png', // Background image
    '/lovable-uploads/33de2017-f52b-4a6f-a520-55488dfaa03c.png', // Presale icon
    '/lovable-uploads/b7694506-fbc1-4e8a-96b5-618c34241608.png'  // Gallery icon
  ];
  
  links.forEach(link => {
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.as = 'image';
    preloadLink.href = link;
    document.head.appendChild(preloadLink);
  });
};

if (typeof window !== 'undefined') {
  preloadResources();
}

createRoot(document.getElementById("root")!).render(<App />);
