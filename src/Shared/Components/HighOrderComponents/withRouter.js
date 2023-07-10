/* eslint-disable no-unused-vars */
/* eslint-disable quotes */
import { useEffect } from 'react';
import {
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';

const SECURED_PATHS = ["/cliente"];

export default function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();

    useEffect(() => {
      console.log('COOKIES: ', document.cookie);
    }, [location]);
    return (
      <Component
        {...props}
        router={{ location, navigate, params }}
      />
    );
  }

  return ComponentWithRouterProp;
}
