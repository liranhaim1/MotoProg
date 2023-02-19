import React from 'react';
import ReactDOM from 'react-dom/client';
// import 'materialize-css/dist/css/materialize.min.css'
// import 'materialize-css/dist/js/materialize.min.js'
import '@mdi/font/css/materialdesignicons.min.css'
import 'react-toastify/dist/ReactToastify.css';
import './styles/styles.scss';
import App from './App';
import { Provider } from 'react-redux';
import { Store } from './store';


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={Store}>
    <App />
  </Provider>,
);