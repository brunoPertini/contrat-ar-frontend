/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import pickBy from 'lodash/pickBy';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import SaveIcon from '@mui/icons-material/Save';
import useMediaQuery from '@mui/material/useMediaQuery';
import { parseLocationForMap } from '../Shared/Helpers/UtilsHelper';
import LocationMap from '../Shared/Components/LocationMap';
import { PersonalDataFormBuilder } from '../Shared/Helpers/FormBuilder';
import { userProfileLabels } from '../StaticData/UserProfile';
import { sharedLabels } from '../StaticData/Shared';
import InformativeAlert from '../Shared/Components/Alert';
import ProfilePhoto from '../Shared/Components/ProfilePhoto';
import { FORMAT_DMY, FORMAT_YMD, switchDateFormat } from '../Shared/Helpers/DatesHelper';
import { systemConstants } from '../Shared/Constants';

const personalDataFormBuilder = new PersonalDataFormBuilder();

const getInputConfig = (isAdmin) => (!isAdmin ? {
  readOnly: true,
  disabled: true,
} : {
  readOnly: false,
  disabled: false,
});

function UserPersonalData({
  userInfo, styles, usuarioType,
  userToken, changeUserInfo, isAdmin,
  editCommonInfo, uploadProfilePhoto,
}) {
  const [fieldsValues, setFieldsValues] = useState(userInfo);

  const [isEditModeEnabled, setIsEditModeEnabled] = useState(false);

  const [alertConfig, setAlertConfig] = useState({
    openSnackbar: false,
    alertSeverity: null,
    alertLabel: null,
  });

  const handleConfirmEdition = ({ newFotoPerfilUrl = '' }) => {
    setIsEditModeEnabled(false);

    const params = !isAdmin ? {
      phone: userInfo.phone,
      location: userInfo.location,
      fotoPerfilUrl: newFotoPerfilUrl || userInfo.fotoPerfilUrl,
    } : {
      ...userInfo,
      fotoPerfilUrl: newFotoPerfilUrl || userInfo.fotoPerfilUrl,
      birthDate: switchDateFormat({
        date: userInfo.birthDate,
        inputFormat: FORMAT_DMY,
        outputFormat: FORMAT_YMD,
      }),
    };

    editCommonInfo(params).then(() => {
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
    });
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

  const onSuccessUploadPhoto = (response) => handleConfirmEdition({ newFotoPerfilUrl: response });

  const handleEditModeChange = (event) => {
    setIsEditModeEnabled(event.target.checked);
  };

  const resetAlertData = () => {
    setAlertConfig({
      openSnackbar: false,
      alertSeverity: '',
      alertLabel: '',
    });
  };

  const textFields = pickBy(fieldsValues, (value, key) => key !== 'location' && key !== 'fotoPerfilUrl');

  const editableFields = personalDataFormBuilder.build({
    usuarioType,
    gridStyles: { mt: '2%' },
    fieldsValues,
    inputProps: {
      readOnly: !isEditModeEnabled,
      disabled: !isEditModeEnabled,
    },
    onChangeFields: (fieldId, fieldValue) => {
      changeUserInfo(fieldId, fieldValue);
    },
    showInlineLabels: true,
    fieldsOwnConfig: {
      name: {
        ...getInputConfig(isAdmin),
      },
      surname: {
        ...getInputConfig(isAdmin),
      },
      dni: {
        ...getInputConfig(isAdmin),
      },
      birthDate: {
        ...getInputConfig(isAdmin),
      },
    },
  });

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

  const firstLayout = (
    <Box
      display="flex"
      flexDirection={{ xs: 'column', md: 'row' }}
      flex={1}
      gap={10}
    >
      <Box
        display="flex"
        flexDirection="column"
      >
        { renderReadOnlyField('name')}
        { renderReadOnlyField('surname')}
        { renderReadOnlyField('birthDate')}
        { renderReadOnlyField('phone')}
        { usuarioType !== systemConstants.USER_TYPE_CLIENTE && renderReadOnlyField('dni')}
      </Box>
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
    <Box
      display="flex"
      flexDirection="column"
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
                  />
                </Box>
              )
            }
      { saveChangesSwitch }
    </Box>
  );

  // const formFields = useMemo(() => (!isEditModeEnabled ? (
  //   Object.keys(textFields).map((dataKey) => (
  //     <Typography
  //       variant="h6"
  //       fontWeight="bold"
  //       sx={{
  //         mt: '3%',
  //         border: '2px solid rgb(36, 134, 164)',
  //         borderRadius: '10px',
  //         padding: '10px',
  //         backgroundColor: '#f5f5f5',
  //       }}
  //     >
  //       {personalDataFormBuilder.fieldsLabels[dataKey]}
  //       :
  //       <Typography
  //         variant="body1"
  //         sx={{ ml: '10px', display: 'inline', color: '#666' }}
  //       >
  //         {fieldsValues[dataKey]}
  //       </Typography>
  //     </Typography>
  //   ))
  // ) : personalDataFormBuilder.build({
  //   usuarioType,
  //   gridStyles: { mt: '2%' },
  //   fieldsValues,
  //   inputProps: {
  //     readOnly: !isEditModeEnabled,
  //     disabled: !isEditModeEnabled,
  //   },
  //   onChangeFields: (fieldId, fieldValue) => {
  //     changeUserInfo(fieldId, fieldValue);
  //   },
  //   showInlineLabels: true,
  //   fieldsOwnConfig: {
  //     name: {
  //       ...getInputConfig(isAdmin),
  //     },
  //     surname: {
  //       ...getInputConfig(isAdmin),
  //     },
  //     dni: {
  //       ...getInputConfig(isAdmin),
  //     },
  //     birthDate: {
  //       ...getInputConfig(isAdmin),
  //     },
  //   },
  // })), [isEditModeEnabled, fieldsValues]);

  const shouldResizeMap = useMediaQuery('(min-width:1800px)');

  useEffect(() => {
    setFieldsValues(userInfo);
  }, [userInfo]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      sx={{ ...styles }}
      flex={1}
      gap={5}
    >
      <InformativeAlert
        open={alertConfig.openSnackbar}
        onClose={() => resetAlertData()}
        label={alertConfig.alertLabel}
        severity={alertConfig.alertSeverity}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      />
      { secondLayout }
      { firstLayout }
    </Box>
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
  }).isRequired,
  isAdmin: PropTypes.bool.isRequired,
  styles: PropTypes.object,
  usuarioType: PropTypes.oneOf(['CLIENTE', 'PROVEEDOR']).isRequired,
  userToken: PropTypes.string.isRequired,
  changeUserInfo: PropTypes.func.isRequired,
  editCommonInfo: PropTypes.func.isRequired,
  uploadProfilePhoto: PropTypes.func.isRequired,
};

export default UserPersonalData;
