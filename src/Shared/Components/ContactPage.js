import Header from '../../Header';
import ContactForm from './ContactForm';
import Footer from './Footer';
import Layout from './Layout';
import { buildFooterOptions } from '../Helpers/UtilsHelper';
import { routes } from '../Constants';
import { flexColumn } from '../Constants/Styles';

function ContactPage() {
  const footerOptions = buildFooterOptions(routes.contact);

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
        renderNavigationLinks
      />
      <ContactForm />
      <Footer options={footerOptions} />
    </Layout>
  );
}

export default ContactPage;
