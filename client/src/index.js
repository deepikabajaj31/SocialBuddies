import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { store, persistor } from './store/store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </PersistGate>

  </Provider>
);