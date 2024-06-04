/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
  useRouteError,
} from 'react-router-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import RootPage from './Root';
import { UserSignUp } from './SignUp';
import { SignIn } from './SignIn';
import { Cliente } from './Cliente';
import Proveedor from './Proveedor/Containers';
import { VendiblePage } from './Vendible';
import UserProfile from './UserProfile/Containers';
import AdminPage from './Admin/AdminContainer';

function ErrorComponent() {
  // TODO: crear páginas de errores
  const error = useRouteError();
  const handlers = {
    401: () => (
      <div>
        NO ESTA AUTORIZADO A VER ESTE CONTENIDO
      </div>
    ),
    500: () => (
      <div>
        ERROR INESPERADO
      </div>
    ),
    404: () => (
      <div>
        PAGINA NO ENCONTRADA
      </div>
    ),
  };
  return error.status ? handlers[error.status]() : (
    <div>
      ERROR INESPERADO
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootPage />,
    errorElement: <ErrorComponent />,
    hasErrorBoundary: true,
  },
  {
    path: '/signup',
    element: <UserSignUp />,
  },
  {
    path: '/signin',
    element: <SignIn />,
  },
  {
    path: '/cliente',
    element: <Cliente />,
    errorElement: <ErrorComponent />,
    hasErrorBoundary: true,
  },
  {
    path: '/producto',
    element: <VendiblePage />,
    errorElement: <ErrorComponent />,
    hasErrorBoundary: true,
  },
  {
    path: '/servicio',
    element: <VendiblePage />,
    errorElement: <ErrorComponent />,
    hasErrorBoundary: true,
  },
  {
    path: '/proveedor',
    element: <Proveedor />,
    errorElement: <ErrorComponent />,
    hasErrorBoundary: true,
  },
  {
    path: '/profile',
    element: <UserProfile />,
    errorElement: <ErrorComponent />,
    hasErrorBoundary: true,
  },
  {
    path: '/admin',
    element: <AdminPage />,
    errorElement: <ErrorComponent />,
    hasErrorBoundary: true,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <RouterProvider router={router} />,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
