import { useLocation } from 'react-router-dom';
import VendiblePage from '../Components';

function VendibleContainer() {
  const location = useLocation();
  const { proveedoresInfo } = location.state;

  return <VendiblePage proveedoresInfo={proveedoresInfo} />;
}

export default VendibleContainer;
