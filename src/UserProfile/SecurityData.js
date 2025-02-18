/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import SaveIcon from '@mui/icons-material/Save';
import { useState } from 'react';
import { Button, FormControlLabel, Switch } from '@mui/material';
import { PersonalDataFormBuilder } from '../Shared/Helpers/FormBuilder';
import { userProfileLabels } from '../StaticData/UserProfile';
import { CLIENTE, PROVEEDOR } from '../Shared/Constants/System';
import { flexColumn } from '../Shared/Constants/Styles';
import { sharedLabels } from '../StaticData/Shared';
import { Layout } from '../Shared/Components';
import InformativeAlert from '../Shared/Components/Alert';

const personalDataFormBuilder = new PersonalDataFormBuilder();

function SecurityData({
  styles, data, setData, usuarioType, isEditModeEnabled, setIsEditModeEnabled,
  is2FaValid, isAdmin, show2FaComponent, handleConfirmEdition,
}) {
  const [isLoading, setIsLoading] = useState(false);

  const [alertConfig, setAlertConfig] = useState({
    openSnackbar: false,
    alertSeverity: null,
    alertLabel: null,
  });

  const formFields = personalDataFormBuilder.build({
    usuarioType,
    fieldsValues: data,
    onChangeFields: (fieldId, fieldValue) => {
      setData(fieldId, fieldValue);
    },
    showInlineLabels: true,
    inputProps: {
      readOnly: !isEditModeEnabled,
    },
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
      <Button
        variant="contained"
        startIcon={<SaveIcon />}
        sx={{
          backgroundColor: isEditModeEnabled ? 'rgb(36, 134, 164)' : '#ccc',
          '&:hover': { backgroundColor: isEditModeEnabled ? 'rgb(28, 110, 135)' : '#ccc' },
        }}
        disabled={!isEditModeEnabled}
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

  return (
    <Layout isLoading={isLoading} gridProps={{ sx: { ...styles, ...flexColumn } }}>
      <InformativeAlert
        open={alertConfig.openSnackbar}
        onClose={() => resetAlertData()}
        label={alertConfig.alertLabel}
        severity={alertConfig.alertSeverity}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      />
      { saveChangesSwitch }
      {
      formFields.map((field) => field)
      }
    </Layout>
  );
}

SecurityData.defaultProps = {
  styles: {},
};

SecurityData.propTypes = {
  styles: PropTypes.object,
  data: PropTypes.shape({ email: PropTypes.string, password: PropTypes.string }).isRequired,
  usuarioType: PropTypes.oneOf([PROVEEDOR, CLIENTE]).isRequired,
};

export default SecurityData;
