import { useEffect } from 'react';
import Header from '../Header';
import { withRouter } from '../Shared/Components';
import { routes } from '../Shared/Constants';
import { rootPageLabels } from '../StaticData/RootPage';

const RootPage = withRouter(({ router }) => {
  const menuOptions = [{
    label: rootPageLabels.signup,
    onClick: () => {
      router.navigate(routes.signup);
    },
  },
  {
    label: rootPageLabels.signin,
    onClick: () => {
      router.navigate(routes.signin);
    },
  }];

  function handleBeforeUnload(event) {
    // Cancela el evento de descarga (si es posible)
    // eslint-disable-next-line no-unused-expressions
    event && event.preventDefault();

    // Muestra un modal al usuario
    const confirmation = window.confirm('¿Seguro que quieres abandonar la página?');

    // Si el usuario confirma, puedes permitir la descarga
    if (confirmation) {
      // Elimina el manejador de eventos para que no se dispare nuevamente
      window.removeEventListener('beforeunload', handleBeforeUnload);
    } else {
      // Si el usuario cancela, vuelve a habilitar el evento
      window.addEventListener('beforeunload', handleBeforeUnload);
    }
  }

  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      handleBeforeUnload();
    };
  }, []);

  return <Header menuOptions={menuOptions} withMenu />;
});

export default RootPage;
