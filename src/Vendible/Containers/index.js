import { useLocation } from 'react-router-dom';
import VendiblePage from '../Components';

function VendibleContainer() {
  const location = useLocation();
  console.log(location.state);
  return <VendiblePage />;
}

export default VendibleContainer;
