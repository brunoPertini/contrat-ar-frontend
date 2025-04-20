/* eslint-disable no-nested-ternary */
import PropTypes from 'prop-types';
import {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import SaveIcon from '@mui/icons-material/Save';
import isEqual from 'lodash/isEqual';
import isNull from 'lodash/isNull';
import isUndefined from 'lodash/isUndefined';
import { parseLocationForMap } from '../Shared/Helpers/UtilsHelper';
import LocationMap from '../Shared/Components/LocationMap';
import { PersonalDataFormBuilder } from '../Shared/Helpers/FormBuilder';
import { userProfileLabels } from '../StaticData/UserProfile';
import { sharedLabels } from '../StaticData/Shared';
import InformativeAlert from '../Shared/Components/Alert';
import ProfilePhoto from '../Shared/Components/ProfilePhoto';
import { FORMAT_DMY, FORMAT_YMD, switchDateFormat } from '../Shared/Helpers/DatesHelper';
import { systemConstants } from '../Shared/Constants';
import { flexColumn } from '../Shared/Constants/Styles';
import { adminLabels } from '../StaticData/Admin';
import StaticAlert from '../Shared/Components/StaticAlert';
import DialogModal from '../Shared/Components/DialogModal';
import Layout from '../Shared/Components/Layout';
import { TABS_NAMES } from './Constants';

const personalDataFormBuilder = new PersonalDataFormBuilder();

const accountActiveModalDefaultValues = {
  title: '',
  text: '',
  handleAccept: () => {},
  checked: undefined,
};

function UserPersonalData({
  userInfo, styles, usuarioType,
  userToken, changeUserInfo, isAdmin,
  editCommonInfo, uploadProfilePhoto,
  isEditModeEnabled, setIsEditModeEnabled,
  show2FaComponent, changeUserActive,
}) {
  const [fieldsValues, setFieldsValues] = useState(userInfo);

  const [alertConfig, setAlertConfig] = useState({
    openSnackbar: false,
    alertSeverity: null,
    alertLabel: null,
  });

  const [accountActiveModalContent, setAccountActiveModalContent] = useState(
    accountActiveModalDefaultValues,
  );

  const [isLoading, setIsLoading] = useState(false);

  const [initialData, setInitialData] = useState();

  const handleConfirmEdition = () => {
    setIsLoading(true);
    setIsEditModeEnabled(false);

    const dataSanitizer = {
      birthDate: switchDateFormat({
        date: userInfo.birthDate,
        inputFormat: FORMAT_DMY,
        outputFormat: FORMAT_YMD,
      }),
    };

    const params = {};

    Object.keys(userInfo).forEach((key) => {
      if (!isEqual(fieldsValues[key], initialData[key])) {
        params[key] = key in dataSanitizer ? dataSanitizer[key] : fieldsValues[key];
      }
    });

    setTimeout(() => {
      editCommonInfo(params, TABS_NAMES.PERSONAL_DATA).then(() => {
        setAlertConfig({
          openSnackbar: true,
          alertSeverity: 'success',
          alertLabel: sharedLabels.infoModifiedSuccess,
        });
      }).catch(() => {
        setAlertConfig({
          openSnackbar: true,
          alertSeverity: 'error',
          alertLabel: sharedLabels.infoModifiedError,
        });
      })
        .finally(() => setIsLoading(false));
    }, 2000);
  };

  /**
   *
   * @param {Object} newValue
   * @param {Object} newValue.coords
   * @param {number} newValue.coords.latitude
   * @param {number} newValue.coords.longitude
   */
  const handleLocationChange = (newValue) => {
    changeUserInfo('location', { coordinates: [newValue.coords.latitude, newValue.coords.longitude] });
  };

  const callHandleUploadPhoto = (file) => uploadProfilePhoto(file);

  const onSuccessUploadPhoto = (response) => setFieldsValues((previous) => ({ ...previous, fotoPerfilUrl: response }));

  const handleEditModeChange = (event) => {
    if (event.target.checked && (userInfo.is2FaValid || isAdmin)) {
      return setIsEditModeEnabled(true);
    }

    if (event.target.checked && !userInfo.is2FaValid) {
      return show2FaComponent();
    }

    return setIsEditModeEnabled(false);
  };

  const resetAlertData = () => {
    setAlertConfig({
      openSnackbar: false,
      alertSeverity: '',
      alertLabel: '',
    });
  };

  const isSomeFieldEmpty = useMemo(() => Object.values(fieldsValues).some(
    (field) => isUndefined(field) || isNull(field) || field === '',
  ), fieldsValues);

  const editableFields = useMemo(() => (!isEditModeEnabled ? null : personalDataFormBuilder.build({
    usuarioType,
    fieldsValues,
    onChangeFields: (fieldId, fieldValue) => {
      changeUserInfo(fieldId, fieldValue);
    },
    showInlineLabels: true,
  })), [fieldsValues, isEditModeEnabled, userInfo]);

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
        disabled={!isEditModeEnabled || isSomeFieldEmpty}
        onClick={handleConfirmEdition}
      >
        { sharedLabels.saveChanges }
      </Button>
    </Box>
  );

  const renderReadOnlyField = useCallback((dataKey) => (
    <Typography
      variant="h6"
      fontWeight="bold"
      sx={{
        mt: '3%',
        border: '2px solid rgb(36, 134, 164)',
        borderRadius: '10px',
        padding: '10px',
        backgroundColor: '#f5f5f5',
      }}
    >
      {personalDataFormBuilder.fieldsLabels[dataKey]}
      :
      <Typography
        variant="body1"
        sx={{ ml: '10px', display: 'inline', color: '#666' }}
      >
        {fieldsValues[dataKey]}
      </Typography>
    </Typography>
  ), [fieldsValues]);

  const handleAcceptChangeIsUserActive = useCallback(
    (active) => changeUserActive(
      active,
    ).then(() => {
      setAlertConfig({
        openSnackbar: true,
        alertLabel: active ? adminLabels.accountEnabled : adminLabels.accountDisabled,
        alertSeverity: 'info',
      });
    }).catch(() => setAlertConfig({
      openSnackbar: true,
      alertLabel: adminLabels.unexpectedError,
      alertSeverity: 'error',
    })).finally(() => setAccountActiveModalContent(accountActiveModalDefaultValues)),
    [changeUserActive],
  );

  const openUserActiveModal = useCallback((event) => {
    setAccountActiveModalContent({
      text: event.target.checked
        ? adminLabels.enableAccountQuestion : adminLabels.disableAccountQuestion,
      handleAccept: handleAcceptChangeIsUserActive,
      checked: event.target.checked,
    });
  }, [setAccountActiveModalContent]);

  const activeAlert = useMemo(() => (!isAdmin ? null : !userInfo.active ? (
    <StaticAlert
      severity="warning"
      variant="outlined"
      label={sharedLabels.inactiveAccount}
      styles={{ mt: '5%' }}
    />
  ) : (
    <StaticAlert
      severity="info"
      variant="outlined"
      label={sharedLabels.activeAccount}
      styles={{ mt: '5%' }}
    />
  )), [isAdmin, userInfo.active]);

  const firstLayout = (
    <Box
      display="flex"
      flexDirection={{ xs: 'column', md: 'row' }}
      flex={1}
      gap={10}
    >
      {
        isEditModeEnabled ? (
          <Box
            display="flex"
            flexDirection="column"
            flexGrow={1}
          >
            { editableFields }
          </Box>
        ) : (
          <Box
            display="flex"
            flexDirection="column"
            flexGrow={1}
          >
            { renderReadOnlyField('name')}
            { renderReadOnlyField('surname')}
            { renderReadOnlyField('birthDate')}
            { renderReadOnlyField('phone')}
            { usuarioType !== systemConstants.USER_TYPE_CLIENTE && renderReadOnlyField('dni')}
          </Box>
        )
      }

      <Box
        display="flex"
        flexDirection="column"
        flex={1}
      >
        <Typography variant="h6" fontWeight="bold">
          {personalDataFormBuilder.fieldsLabels.location}
          {' '}
          :
        </Typography>
        <LocationMap
          token={userToken}
          containerStyles={{
            height: '300px',
          }}
          enableDragEvents={isEditModeEnabled}
          location={parseLocationForMap(fieldsValues.location)}
          setLocation={handleLocationChange}
        />
      </Box>
    </Box>
  );

  const secondLayout = (
    <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }}>
      <Box
        {...flexColumn}
        flex={1}
        sx={{ mt: '15px' }}
      >
        {
              !!fieldsValues.fotoPerfilUrl && (
                <Box
                  display="flex"
                  flexDirection="column"
                >
                  {personalDataFormBuilder.fieldsLabels.fotoPerfilUrl}
                  <ProfilePhoto
                    src={fieldsValues.fotoPerfilUrl}
                    alt={userInfo.name}
                    onUpload={callHandleUploadPhoto}
                    onSuccess={onSuccessUploadPhoto}
                    isButtonEnabled={isEditModeEnabled}
                  />
                </Box>
              )
            }
        { saveChangesSwitch }
      </Box>
      {
        isAdmin && (
          <Box {...flexColumn} sx={{ mt: '3%' }}>
            { activeAlert }
            <FormControlLabel
              control={(
                <Switch
                  checked={userInfo.active}
                  onChange={openUserActiveModal}
                />
)}
              label={userInfo.active ? adminLabels.disableAccount : adminLabels.enableAccount}
            />
          </Box>
        )
      }
    </Box>

  );

  useEffect(() => {
    setInitialData({ ...userInfo });
  }, []);

  useEffect(() => {
    setFieldsValues(userInfo);
  }, [userInfo]);

  const UserActiveModal = useCallback(() => (
    <DialogModal
      title={sharedLabels.pleaseConfirmAction}
      contextText={accountActiveModalContent.text}
      cancelText={sharedLabels.cancel}
      acceptText={sharedLabels.accept}
      open={!!(accountActiveModalContent.text)}
      handleAccept={
          () => accountActiveModalContent.handleAccept(accountActiveModalContent.checked)
        }
      handleDeny={() => setAccountActiveModalContent(accountActiveModalDefaultValues)}
    />
  ), [accountActiveModalContent.text]);

  return (
    <Layout
      isLoading={isLoading}
      gridProps={{
        sx: {
          ...styles,
          ...flexColumn,
        },
        flex: 1,
        gap: 5,
      }}
    >
      <UserActiveModal />
      <InformativeAlert
        open={alertConfig.openSnackbar}
        onClose={() => resetAlertData()}
        label={alertConfig.alertLabel}
        severity={alertConfig.alertSeverity}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      />
      { secondLayout }
      { firstLayout }
    </Layout>

  );
}

UserPersonalData.defaultProps = {
  styles: {},
};

UserPersonalData.propTypes = {
  userInfo: PropTypes.shape({
    name: PropTypes.string,
    surname: PropTypes.string,
    birthDate: PropTypes.string,
    location: PropTypes.shape({
      coordinates: PropTypes.arrayOf(PropTypes.number),
    }),
    phone: PropTypes.string,
    fotoPerfilUrl: PropTypes.string,
    active: PropTypes.bool,
    is2FaValid: PropTypes.bool,
  }).isRequired,
  isAdmin: PropTypes.bool.isRequired,
  styles: PropTypes.object,
  usuarioType: PropTypes.oneOf(['CLIENTE', 'PROVEEDOR']).isRequired,
  userToken: PropTypes.string.isRequired,
  changeUserInfo: PropTypes.func.isRequired,
  editCommonInfo: PropTypes.func.isRequired,
  uploadProfilePhoto: PropTypes.func.isRequired,
  isEditModeEnabled: PropTypes.bool.isRequired,
  setIsEditModeEnabled: PropTypes.func.isRequired,
  show2FaComponent: PropTypes.func.isRequired,
  changeUserActive: PropTypes.func.isRequired,
};

export default UserPersonalData;
