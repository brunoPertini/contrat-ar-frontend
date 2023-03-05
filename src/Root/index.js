import Header from '../Header';
import { rootPageLabels } from '../StaticData/RootPage';

export default function RootPage() {
  const menuOptions = [{ label: rootPageLabels.signup, onClick: () => {} },
    { label: rootPageLabels.signin, onClick: () => {} }];

  return <Header menuOptions={menuOptions} withMenu />;
}
