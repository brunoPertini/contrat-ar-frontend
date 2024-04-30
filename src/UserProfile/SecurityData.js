/* eslint-disable react/prop-types */
import Box from '@mui/material/Box';
import { useState } from 'react';
import { PersonalDataFormBuilder } from '../Shared/Helpers/FormBuilder';
import { StaticAlert } from '../Shared/Components';
import { userProfileLabels } from '../StaticData/UserProfile';

const personalDataFormBuilder = new PersonalDataFormBuilder();

function SecurityData({
  styles, data, usuarioType,
}) {
  const [fieldsValues, setFieldsValues] = useState(data);

  const formFields = personalDataFormBuilder.build({
    usuarioType,
    fieldsValues,
    onChangeFields: (fieldId, fieldValue) => {
      setFieldsValues({ ...fieldsValues, [fieldId]: fieldValue });
    },
    gridStyles: { display: 'flex', flexDirection: 'column', width: '60%' },
    showInlineLabels: true,
    inputProps: {
      readOnly: true,
    },
  });

  return (
    <Box display="flex" flexDirection="column" sx={{ ...styles }}>
      {
      formFields.map((field) => field)
      }
      <StaticAlert
        severity="warning"
        variant="outlined"
        label={userProfileLabels['security.warning']}
        styles={{ mt: '5%' }}
      />
    </Box>
  );
}

export default SecurityData;
