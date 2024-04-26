/* eslint-disable react/prop-types */
import Box from '@mui/material/Box';
import { useState } from 'react';
import { PersonalDataFormBuilder } from '../Shared/Helpers/FormBuilder';

const personalDataFormBuilder = new PersonalDataFormBuilder();

function SecurityData({
  styles, data, usuarioType, isEditModeEnabled,
}) {
  const [fieldsValues, setFieldsValues] = useState(data);

  const formFields = isEditModeEnabled ? null : personalDataFormBuilder.build({
    usuarioType,
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

export default SecurityData;
