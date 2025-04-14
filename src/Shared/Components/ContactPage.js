import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import Header from '../../Header';
import ContactForm from './ContactForm';
import Footer from './Footer';
import Layout from './Layout';
import { buildFooterOptions, getUserMenuOptions } from '../Helpers/UtilsHelper';
import { routes } from '../Constants';
import { flexColumn } from '../Constants/Styles';
import withRouter from './HighOrderComponents/withRouter';

const stateSelector = (state) => state;

const userInfoSelector = createSelector(
  stateSelector,
  (state) => state.usuario,
);

function ContactPage({ handleLogout }) {
  const footerOptions = buildFooterOptions(routes.contact);

  const userInfo = useSelector(userInfoSelector);

  const isUserSignedIn = userInfo?.id;

  const menuOptionsConfig = {
    myProfile: {
      props: isUserSignedIn ? userInfo : null,
    },
    logout: {
      onClick: () => handleLogout(),
    },
  };

  const menuOptions = !isUserSignedIn ? undefined : getUserMenuOptions(menuOptionsConfig);

  return (
    <Layout gridProps={{
      sx: {
        ...flexColumn,
        height: '100vh',
        minHeight: '100vh',
      },
    }}
    >
      <Header
        userInfo={isUserSignedIn ? userInfo : {}}
        menuOptions={menuOptions}
        withMenuComponent={userInfo?.id}
        renderNavigationLinks
      />
      <ContactForm containerStyles={{ ...flexColumn }} />
      <Footer options={footerOptions} />
    </Layout>
  );
}

ContactPage.propTypes = {
  handleLogout: PropTypes.func.isRequired,
};

export default withRouter(ContactPage);
