import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/variables.css';
import './index.css';
import './styles/components.css';
import './styles/modal.css';
import './styles/stats.css';
import './styles/filters.css';
import './styles/board.css';
import './styles/card.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
