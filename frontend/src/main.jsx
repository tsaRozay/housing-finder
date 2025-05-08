import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Provider } from 'react-redux';
import { csrfFetch, restoreCSRF } from './store/csrf';
import configureStore from './store';
import App from './App.jsx';
import * as sessionActions from './store/session';


  const store = configureStore();


  if (import.meta.env.MODE !== 'production') {
    restoreCSRF();
  
    window.csrfFetch = csrfFetch;
    window.store = store;
    window.sessionActions = sessionActions;
    console.log('Store assigned to window:', window.store)
  }
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <ModalProvider>
        <Provider store={store}>
          <App />
          <Modal />
        </Provider>
      </ModalProvider>
    </React.StrictMode>
  );
