/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import pickBy from 'lodash/pickBy';
import { PersonalDataFormBuilder } from '../Shared/Helpers/FormBuilder';
import { LocationMap } from '../Shared/Components';
import { parseLocationForMap } from '../Shared/Helpers/UtilsHelper';

const personalDataFormBuilder = new PersonalDataFormBuilder();

function UserPersonalData({
  userInfo, styles, usuarioType, inputProps,
  isEditModeEnabled, userToken, changeUserInfo,
}) {
  const [fieldsValues, setFieldsValues] = useState(userInfo);

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
    inputProps,
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

  return (
    <Box display="flex" flexDirection="column" sx={{ ...styles }}>
      <Box display="flex" flexDirection="column">
        {
        formFields.map((field) => field)
        }
        <Box sx={{ mt: '5%' }}>
          <Typography variant="h6" fontWeight="bold">
            {personalDataFormBuilder.fieldsLabels.location}
            {' '}
            :
          </Typography>
          <LocationMap
            token={userToken}
            containerStyles={{
              height: '200px',
              width: '100%',
              marginTop: '5%',
            }}
            enableDragEvents={isEditModeEnabled}
            location={parseLocationForMap(fieldsValues.location)}
            setLocation={handleLocationChange}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default UserPersonalData;
