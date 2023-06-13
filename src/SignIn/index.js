import { useMemo, useState } from 'react';
import Header from '../Header';
import { SignInFormBuilder } from '../Shared/Helpers/FormBuilder';
import { Form } from '../Shared/Components';
import { signinLabels } from '../StaticData/SignIn';

function SignIn() {
  const formBuilder = new SignInFormBuilder();
  const [formValues, setFormValues] = useState(formBuilder.fields);
  const [emptyFields, setEmptyFields] = useState([]);

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
  };

  const errorMessage = useMemo(() => {
    if (emptyFields.length) {
      return 'Por favor, revisá los campos vacíos';
    }

    if (false) {
      return 'Usuario o contraseña incorrectos';
    }

    return '';
  }, [emptyFields]);

  const formFields = formBuilder.build({
    fieldsValues: formValues,
    onChangeFields: (fieldId, fieldValue) => {
      setFormValues({ ...formValues, [fieldId]: fieldValue });
    },
    errorFields: emptyFields,
    onButtonClick,
    errorMessage,
  });

  return (
    <>
      <Header />
      <Form
        title={signinLabels.title}
        fields={formFields}
      />

    </>
  );
}

export default SignIn;
