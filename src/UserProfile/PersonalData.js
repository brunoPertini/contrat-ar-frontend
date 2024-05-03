/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import pickBy from 'lodash/pickBy';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Switch from '@mui/material/Switch';
import { parseLocationForMap } from '../Shared/Helpers/UtilsHelper';
import LocationMap from '../Shared/Components/LocationMap';
import { PersonalDataFormBuilder } from '../Shared/Helpers/FormBuilder';
import { userProfileLabels } from '../StaticData/UserProfile';
import { sharedLabels } from '../StaticData/Shared';

const personalDataFormBuilder = new PersonalDataFormBuilder();

function UserPersonalData({
  userInfo, styles, usuarioType,
  userToken, changeUserInfo,
}) {
  const [fieldsValues, setFieldsValues] = useState(userInfo);

  const [isEditModeEnabled, setIsEditModeEnabled] = useState(false);

  const textFields = pickBy(fieldsValues, (value, key) => key !== 'location');

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
    gridStyles: { display: 'flex', flexDirection: 'column', width: '31rem' },
    showInlineLabels: true,
    fieldsOwnConfig: {
      dni: {
        readOnly: true,
        disabled: true,
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

  const handleConfirmEdition = () => {
    setIsEditModeEnabled(false);
  };

  return (
    <Box display="flex" flexDirection="row" sx={{ ...styles }}>
      <Box display="flex" flexDirection="column">
        {
        formFields.map((field) => field)
        }
        <Box display="flex" flexDirection="column" sx={{ mt: '5%' }}>
          <Typography variant="h6" fontWeight="bold">
            {personalDataFormBuilder.fieldsLabels.location}
            {' '}
            :
          </Typography>
          <LocationMap
            token={userToken}
            containerStyles={{
              height: '500px',
              width: '500px',
              marginTop: '5%',
            }}
            enableDragEvents={isEditModeEnabled}
            location={parseLocationForMap(fieldsValues.location)}
            setLocation={handleLocationChange}
          />
        </Box>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        sx={{ height: '30%', ml: '5%' }}
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
  );
}

export default UserPersonalData;
