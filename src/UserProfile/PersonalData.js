/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Box } from '@mui/material';
import { CLIENTE, USER_TYPE_CLIENTE } from '../Shared/Constants/System';
import { PersonalDataFormBuilder } from '../Shared/Helpers/FormBuilder';

const personalDataFormBuilder = new PersonalDataFormBuilder();

function UserPersonalData({ userInfo, styles }) {
  const [fieldsValues, setFieldsValues] = useState(personalDataFormBuilder.fields);
  const formFields = personalDataFormBuilder.build({
    usuarioType: userInfo.role === CLIENTE ? USER_TYPE_CLIENTE : null,
    fieldsValues,
    onChangeFields: (fieldId, fieldValue) => {
      setFieldsValues({ ...fieldsValues, [fieldId]: fieldValue });
    },
    gridStyles: { display: 'flex', flexDirection: 'column' },
    showInlineLabels: true,
  });
  return (
    <Box display="flex" flexDirection="column" sx={{ ...styles }}>
      {
        formFields.map((field) => field)

      }
    </Box>
  );
}

export default UserPersonalData;
