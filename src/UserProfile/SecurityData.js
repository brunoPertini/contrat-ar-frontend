import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import SaveIcon from '@mui/icons-material/Save';
import isEqual from 'lodash/isEqual';
import { useEffect, useMemo, useState } from 'react';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { PersonalDataFormBuilder } from '../Shared/Helpers/FormBuilder';
import { userProfileLabels } from '../StaticData/UserProfile';
import { CLIENTE, EMPTY_FUNCTION, PROVEEDOR } from '../Shared/Constants/System';
import { flexColumn } from '../Shared/Constants/Styles';
import { sharedLabels } from '../StaticData/Shared';
import { Layout } from '../Shared/Components';
import InformativeAlert from '../Shared/Components/Alert';

const personalDataFormBuilder = new PersonalDataFormBuilder();

function SecurityData({
  styles, data, setData, usuarioType, isEditModeEnabled, setIsEditModeEnabled,
  is2FaValid, isAdmin, show2FaComponent, handleConfirmEdition, isInForgotPasswordPage = false,
}) {
  const [isLoading, setIsLoading] = useState(false);

  const [alertConfig, setAlertConfig] = useState({
    openSnackbar: false,
    alertSeverity: null,
    alertLabel: null,
  });

  const [errorFields, setErrorFields] = useState();
  // eslint-disable-next-line no-unused-vars
  const [initialData, setInitialData] = useState({ ...data });

  const someFieldHasError = useMemo(() => errorFields && Object.values(errorFields)
    .some((value) => value), [errorFields]);

  const someInfoChanged = useMemo(() => !isEqual(
    { email: data.email, password: data.password },
    { email: initialData.email, password: initialData.password },
  ), [data, initialData]);

  const formFields = personalDataFormBuilder.build({
    usuarioType,
    fieldsValues: data,
    onChangeFields: (fieldId, fieldValue, fieldsHasError) => {
      if (fieldId === 'password' || fieldId === 'confirmPassword') {
        const passwordsNotMatching = fieldId === 'password'
          ? fieldValue !== data.confirmPassword
          : fieldValue !== data.password;
        setErrorFields((previous) => ({
          ...previous,
          password: passwordsNotMatching,
          confirmPassword: passwordsNotMatching,
        }));
      } else {
        setErrorFields((previous) => ({ ...previous, [fieldId]: fieldsHasError }));
      }
      setData(fieldId, fieldValue);
    },
    showInlineLabels: true,
    showConfirmPasswordInput: isEditModeEnabled,
    inputProps: {
      readOnly: !isEditModeEnabled,
    },
    errorFields,
  });

  const handleEditModeChange = (event) => {
    if (event.target.checked && (is2FaValid || isAdmin)) {
      return setIsEditModeEnabled(true);
    }

    if (event.target.checked && !is2FaValid) {
      return show2FaComponent();
    }

    return setIsEditModeEnabled(false);
  };

  const handleConfirm = () => {
    setIsLoading(true);
    setTimeout(() => {
      handleConfirmEdition()
        .then(() => {
          setAlertConfig({
            openSnackbar: true,
            alertSeverity: 'success',
            alertLabel: sharedLabels.infoModifiedSuccess,
          });
        })
        .catch(() => {
          setAlertConfig({
            openSnackbar: true,
            alertSeverity: 'error',
            alertLabel: sharedLabels.infoModifiedError,
          });
        })
        .finally(() => {
          setIsLoading(false);
          setIsEditModeEnabled(false);
        });
    }, 2000);
  };

  const saveChangesSwitch = (
    <Box
      display="flex"
      flexDirection="row"
      sx={{ mt: '2%' }}
    >
      {
        !isInForgotPasswordPage && (
          <FormControlLabel
            control={(
              <Switch
                checked={isEditModeEnabled}
                color="primary"
              />
      )}
            label={userProfileLabels.modifyData}
            onChange={handleEditModeChange}
            sx={{ color: '#333', fontSize: '16px' }}
          />
        )
      }
      <Button
        variant="contained"
        startIcon={<SaveIcon />}
        sx={{
          backgroundColor: isEditModeEnabled ? 'rgb(36, 134, 164)' : '#ccc',
          '&:hover': { backgroundColor: isEditModeEnabled ? 'rgb(28, 110, 135)' : '#ccc' },
        }}
        disabled={!isEditModeEnabled || someFieldHasError || !someInfoChanged}
        onClick={handleConfirm}
      >
        { sharedLabels.saveChanges }
      </Button>
    </Box>
  );

  const resetAlertData = () => {
    setAlertConfig({
      openSnackbar: false,
      alertSeverity: '',
      alertLabel: '',
    });
  };

  useEffect(() => {
    const initialErrorValues = Object.keys(data).reduce((acc, key) => {
      acc[key] = false;
      return acc;
    }, {});

    setErrorFields({ ...initialErrorValues });
  }, []);

  return (
    <Layout isLoading={isLoading} gridProps={{ sx: { ...styles, ...flexColumn } }}>
      <InformativeAlert
        open={alertConfig.openSnackbar}
        onClose={() => resetAlertData()}
        label={alertConfig.alertLabel}
        severity={alertConfig.alertSeverity}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      />
      {isInForgotPasswordPage ? (
        <>
          {formFields.map((field) => field)}
          {saveChangesSwitch}
        </>
      ) : (
        <>
          {saveChangesSwitch}
          {formFields.map((field) => field)}
        </>
      )}
    </Layout>
  );
}

SecurityData.defaultProps = {
  styles: {},
  setIsEditModeEnabled: EMPTY_FUNCTION,
};

SecurityData.propTypes = {
  styles: PropTypes.object,
  data: PropTypes.shape({
    email: PropTypes.string,
    password: PropTypes.string,
    confirmPassword: PropTypes.string,
  }).isRequired,
  setData: PropTypes.func.isRequired,
  usuarioType: PropTypes.oneOf([PROVEEDOR, CLIENTE]).isRequired,
  isEditModeEnabled: PropTypes.bool.isRequired,
  setIsEditModeEnabled: PropTypes.func,
  is2FaValid: PropTypes.bool.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  show2FaComponent: PropTypes.func.isRequired,
  handleConfirmEdition: PropTypes.func.isRequired,
  isInForgotPasswordPage: PropTypes.bool.isRequired,
};

export default SecurityData;
