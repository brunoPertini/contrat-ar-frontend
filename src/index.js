import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Header from './Header';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

const menuOptions = [{ label: 'Registrarse', onClick: () => {} },
  { label: 'Iniciar Sesión', onClick: () => {} }];

const title = 'Contract.ar';

root.render(
  <React.StrictMode>
    <Header title={title} menuOptions={menuOptions} withMenu />
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
