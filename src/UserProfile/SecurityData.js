import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import { useMemo, useState } from 'react';
import { PersonalDataFormBuilder } from '../Shared/Helpers/FormBuilder';
import { StaticAlert } from '../Shared/Components';
import { userProfileLabels } from '../StaticData/UserProfile';
import { CLIENTE, PROVEEDOR } from '../Shared/Constants/System';

const personalDataFormBuilder = new PersonalDataFormBuilder();

function SecurityData({
  styles, data, usuarioType, requestChangeExists,
}) {
  const [fieldsValues, setFieldsValues] = useState(data);

  const formFields = personalDataFormBuilder.build({
    usuarioType,
    fieldsValues,
    onChangeFields: (fieldId, fieldValue) => {
      setFieldsValues({ ...fieldsValues, [fieldId]: fieldValue });
    },
    showInlineLabels: true,
    inputProps: {
      readOnly: true,
    },
  });

  const alert = useMemo(() => (!requestChangeExists ? (
    <StaticAlert
      severity="warning"
      variant="outlined"
      label={userProfileLabels['security.warning']}
      styles={{ mt: '5%' }}
    />
  ) : (
    <StaticAlert
      severity="info"
      variant="outlined"
      label={userProfileLabels['security.requestExists']}
      styles={{ mt: '5%' }}
    />
  )), [requestChangeExists]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      sx={{ ...styles }}
    >
      {
      formFields.map((field) => field)
      }
      { alert }
    </Box>
  );
}

SecurityData.defaultProps = {
  styles: {},
};

SecurityData.propTypes = {
  styles: PropTypes.object,
  requestChangeExists: PropTypes.bool.isRequired,
  data: PropTypes.shape({ email: PropTypes.string, password: PropTypes.string }).isRequired,
  usuarioType: PropTypes.oneOf([PROVEEDOR, CLIENTE]).isRequired,
};

export default SecurityData;
