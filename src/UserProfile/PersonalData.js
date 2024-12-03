import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import pickBy from 'lodash/pickBy';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { parseLocationForMap } from '../Shared/Helpers/UtilsHelper';
import LocationMap from '../Shared/Components/LocationMap';
import { PersonalDataFormBuilder } from '../Shared/Helpers/FormBuilder';
import { userProfileLabels } from '../StaticData/UserProfile';
import { sharedLabels } from '../StaticData/Shared';
import InformativeAlert from '../Shared/Components/Alert';
import ProfilePhoto from '../Shared/Components/ProfilePhoto';
import { FORMAT_DMY, FORMAT_YMD, switchDateFormat } from '../Shared/Helpers/DatesHelper';

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

  const textFields = pickBy(fieldsValues, (value, key) => key !== 'location' && key !== 'fotoPerfilUrl');

  const formFields = useMemo(() => (!isEditModeEnabled ? (
    Object.keys(textFields).map((dataKey) => (
      <Typography variant="h6" fontWeight="bold" sx={{ mt: '5%' }}>
        {personalDataFormBuilder.fieldsLabels[dataKey]}
        :
        {' '}
        { fieldsValues[dataKey] }
      </Typography>
    ))
  ) : personalDataFormBuilder.build({
    usuarioType,
    fieldsValues,
    inputProps: { readOnly: !isEditModeEnabled, disabled: !isEditModeEnabled },
    onChangeFields: (fieldId, fieldValue) => {
      changeUserInfo(fieldId, fieldValue);
    },
    gridStyles: { display: 'flex', flexDirection: 'column' },
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
  })), [isEditModeEnabled, fieldsValues]);

  useEffect(() => {
    setFieldsValues(userInfo);
  }, [userInfo]);

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

  const callHandleUploadPhoto = (file) => uploadProfilePhoto(file);

  const onSuccessUploadPhoto = (response) => handleConfirmEdition({ newFotoPerfilUrl: response });

  return (
    <Box
      display="flex"
      flexDirection="column"
      sx={{ ...styles }}
    >
      <InformativeAlert
        open={alertConfig.openSnackbar}
        onClose={() => resetAlertData()}
        label={alertConfig.alertLabel}
        severity={alertConfig.alertSeverity}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      />
      <Box display="flex" flexDirection="column">
        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }}>
          <Box
            display="flex"
            flexDirection="column"
            order={{ xs: 2, md: 0 }}
            flexGrow={1}
          >
            {
                formFields.map((field) => field)
            }
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            order={{ xs: 1, md: 0 }}
            width={{ xs: '50%', md: 'auto' }}
            ml={{ xs: 0, md: '1%' }}
          >
            <FormControlLabel
              control={<Switch checked={isEditModeEnabled} />}
              label={userProfileLabels.modifyData}
              onChange={handleEditModeChange}
            />
            <Button
              variant="contained"
              sx={{ mt: '5%' }}
              disabled={!isEditModeEnabled}
              onClick={handleConfirmEdition}
            >
              { sharedLabels.saveChanges }
            </Button>
          </Box>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          sx={{ mt: { xs: '5%', md: '1%' } }}
        >
          <Typography variant="h6" fontWeight="bold">
            {personalDataFormBuilder.fieldsLabels.location}
            {' '}
            :
          </Typography>
          <LocationMap
            token={userToken}
            containerStyles={{
              height: '200px',
              width: '70%',
            }}
            enableDragEvents={isEditModeEnabled}
            location={parseLocationForMap(fieldsValues.location)}
            setLocation={handleLocationChange}
          />
        </Box>
      </Box>
      {
        !!(fieldsValues.fotoPerfilUrl) && (
          <Box
            display="flex"
            flexDirection="column"
            sx={{ height: '30%', ml: '5%' }}
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
