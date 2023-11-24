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

  return <Header menuOptions={menuOptions} withMenu />;
});

export default RootPage;
