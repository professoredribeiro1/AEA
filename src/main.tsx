
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

console.log("🚀 Iniciando main.tsx");

const rootElement = document.getElementById('root');

window.onerror = (message, source, lineno, colno, error) => {
  console.error("❌ Erro Global Capturado:", message, error);
  if (rootElement) {
    rootElement.innerHTML = `<div style="padding: 40px; color: #881337; font-family: sans-serif; text-align: center; background: #fff1f2; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;">
      <h2 style="font-size: 24px; margin-bottom: 16px;">Ops! Algo deu errado.</h2>
      <p style="margin-bottom: 24px; color: #be123c;">${message}</p>
      <button onclick="window.location.reload()" style="background: #f43f5e; color: white; border: none; padding: 12px 24px; border-radius: 12px; font-weight: bold; cursor: pointer;">Recarregar Página</button>
    </div>`;
  }
};

if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

console.log("✅ Elemento root encontrado, renderizando App");
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
