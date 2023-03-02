import Header from '../Header';

export default function RootPage() {
  const menuOptions = [{ label: 'Registrarse', onClick: () => {} },
    { label: 'Iniciar Sesión', onClick: () => {} }];

  return <Header menuOptions={menuOptions} withMenu />;
}
