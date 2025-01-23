import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux'; // Import the Provider component
import store from './store/store.jsx';
import './index.css';

// Import your Redux store
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}> {/* Wrap your App with the Provider */}
      <App />
    </Provider>
  </StrictMode>
);
