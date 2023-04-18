// import Grid from '@mui/material/Grid';
import Header from '../Header';
import { SignInFormBuilder } from '../Shared/Helpers/FormBuilder';
import { Form } from '../Shared/Components';
import { signinLabels } from '../StaticData/SignIn';

function SignIn() {
  const formBuilder = new SignInFormBuilder();
  return (
    <>
      <Header />
      <Form
        title={signinLabels.title}
        fields={formBuilder.build()}
      />

    </>
  );
}

export default SignIn;
