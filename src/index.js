import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
  useRouteError,
} from 'react-router-dom';
import './index.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import reportWebVitals from './reportWebVitals';
import RootPage from './Root';
import { UserSignUp } from './SignUp';
import { SignIn } from './SignIn';
import { Cliente } from './Cliente';
import Proveedor from './Proveedor/Containers';
import { VendiblePage } from './Vendible';
import UserProfile from './UserProfile/Containers';
import AdminPage from './Admin/AdminContainer';
import AccountConfirmationPage from './SignUp/Containers/AccountConfirmationPage';
import RestorePasswordPage from './SignIn/Components/RestorePasswordPage';
import ContactPage from './Shared/Components/ContactPage';
import StaticDataRendererContainer from './Shared/Components/StaticDataRenderer/StatiicDataRendererContainer';
import ErrorPage from './Root/error';

function ErrorComponent() {
  const error = useRouteError();
  return <ErrorPage status={error.status || 500} />;
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
  },
  {
    path: '/admin',
    element: <AdminPage />,
    errorElement: <ErrorComponent />,
    hasErrorBoundary: true,
  },
  {
    path: '/signup/email-confirm',
    element: <AccountConfirmationPage />,
    errorElement: <ErrorComponent />,
    hasErrorBoundary: true,
  },
  {
    path: '/forgot-password',
    element: <RestorePasswordPage />,
    errorElement: <ErrorComponent />,
    hasErrorBoundary: true,
  },
  {
    path: '/contact',
    element: <ContactPage />,
    errorElement: <ErrorComponent />,
    hasErrorBoundary: true,
  },
  {
    path: '/terms-and-conditions',
    element: <StaticDataRendererContainer />,
    errorElement: <ErrorComponent />,
    hasErrorBoundary: true,
  },
  {
    path: '/data-usage',
    element: <StaticDataRendererContainer />,
    errorElement: <ErrorComponent />,
    hasErrorBoundary: true,
  },
  {
    path: '/error/:code',
    element: <ErrorPage />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));

const theme = createTheme({
  palette: {
    primary: {
      main: 'rgb(36, 134, 164)',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          color: '#f5c242',
        },
      },
    },
  },
});

root.render(
  <ThemeProvider theme={theme}>
    <RouterProvider router={router} />
  </ThemeProvider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
