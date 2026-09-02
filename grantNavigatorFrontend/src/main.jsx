import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from './store';
import App from './App';

const el = document.getElementById('root');
const root = createRoot(el);

root.render(
  <React.StrictMode>
    {/* Muliggør Client-Side Routing i hele applikationen */}
    <BrowserRouter>
      {/* Forbinder Redux Store til alle React-komponenter i appen */}
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);