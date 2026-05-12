import React from 'react';
import ReactDOM from 'react-dom/client';
import ChatBot from './components/ChatBot';
import './index.css'; // غير الـ Tailwind باش يبقى الستيل ناضي

ReactDOM.createRoot(document.getElementById('chat-root')!).render(
  <React.StrictMode>
    <div style={{ width: '100vw', height: '100vh' }}>
      <ChatBot />
    </div>
  </React.StrictMode>
);