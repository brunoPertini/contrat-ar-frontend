import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import Header from '../Header';
import { SignInFormBuilder } from '../Shared/Helpers/FormBuilder';
import Form from '../Shared/Components/Form';
import { signinLabels } from '../StaticData/SignIn';
import AccountMailConfirmation from '../SignUp/AccountMailConfirmation';

function SignIn({
  dispatchSignIn,
  sendAccountConfirmEmail, errorMessage, shouldVerifyEmail = false,
}) {
  const formBuilder = new SignInFormBuilder();

  const [formValues, setFormValues] = useState(formBuilder.fields);
  const [emptyFields, setEmptyFields] = useState([]);
  const [showAccountVerificationComponent, setShowAccountVerificationComponent] = useState(false);

  const onButtonClick = () => {
    let newErrorFields = [...emptyFields];
    Object.keys(formValues).forEach((key) => {
      if (!formValues[key]) {
        newErrorFields.push(key);
      } else {
        newErrorFields = newErrorFields.filter((element) => element !== key);
      }
    });

    setEmptyFields(newErrorFields);

    if (!newErrorFields.length) {
      dispatchSignIn(formValues);
    }
  };

  const finalErrorMessage = useMemo(() => {
    if (emptyFields.length) {
      return 'Por favor, revisá los campos vacíos';
    }

    if (errorMessage) {
      return errorMessage;
    }

    return '';
  }, [emptyFields, errorMessage]);

  const formFields = formBuilder.build({
    shouldVerifyEmail,
    fieldsValues: formValues,
    onChangeFields: (fieldId, fieldValue) => {
      setFormValues({ ...formValues, [fieldId]: fieldValue });
    },
    errorFields: emptyFields,
    onButtonClick: shouldVerifyEmail ? () => setShowAccountVerificationComponent(true) : onButtonClick,
    errorMessage: finalErrorMessage,
  });

  return (
    <>
      <Header />
      {!showAccountVerificationComponent ? (
        <Form
          title={signinLabels.title}
          fields={formFields}
        />
      ) : (
        <AccountMailConfirmation
          email={formValues.email}
          sendAccountConfirmEmail={sendAccountConfirmEmail}
        />
      )}
    </>
  );
}

SignIn.defaultProps = {
  errorMessage: '',
};

SignIn.propTypes = {
  sendAccountConfirmEmail: PropTypes.func.isRequired,
  shouldVerifyEmail: PropTypes.bool.isRequired,
  dispatchSignIn: PropTypes.func.isRequired,
  errorMessage: PropTypes.string,
};

export default SignIn;
