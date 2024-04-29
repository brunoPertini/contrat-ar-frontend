/* eslint-disable react/prop-types */
import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import pickBy from 'lodash/pickBy';
import { PersonalDataFormBuilder } from '../Shared/Helpers/FormBuilder';
import { LocationMap } from '../Shared/Components';

const personalDataFormBuilder = new PersonalDataFormBuilder();

function UserPersonalData({
  userInfo, styles, usuarioType, inputProps, isEditModeEnabled, userToken,
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
      setFieldsValues({ ...fieldsValues, [fieldId]: fieldValue });
    },
    gridStyles: { display: 'flex', flexDirection: 'column' },
    showInlineLabels: true,
  })), [isEditModeEnabled]);

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
              'margin-top': '5%',
            }}
            enableDragEvents={false}
            location={{
              coords: {
                latitude: fieldsValues.location.coordinates[0],
                longitude: fieldsValues.location.coordinates[1],
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default UserPersonalData;
