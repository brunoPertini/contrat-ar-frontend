/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { PersonalDataFormBuilder } from '../Shared/Helpers/FormBuilder';
import { LocationMap } from '../Shared/Components';

const personalDataFormBuilder = new PersonalDataFormBuilder();

function UserPersonalData({
  userInfo, styles, usuarioType, inputProps, isEditModeEnabled, userToken,
}) {
  const [fieldsValues, setFieldsValues] = useState(userInfo);

  const formFields = !isEditModeEnabled ? Object.keys(fieldsValues).map((dataKey) => {
    if (dataKey !== 'location') {
      return (
        <Typography variant="h6" fontWeight="bold">
          {personalDataFormBuilder.fieldsLabels[dataKey]}
          :
          {' '}
          { fieldsValues[dataKey] }
        </Typography>
      );
    }

    return (
      <Box>
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
    );
  }) : personalDataFormBuilder.build({
    usuarioType,
    fieldsValues,
    inputProps,
    onChangeFields: (fieldId, fieldValue) => {
      setFieldsValues({ ...fieldsValues, [fieldId]: fieldValue });
    },
    gridStyles: { display: 'flex', flexDirection: 'column' },
    showInlineLabels: true,
  });

  return (
    <Box display="flex" flexDirection="column" sx={{ ...styles }}>
      {
        formFields.map((field) => field)

      }
    </Box>
  );
}

export default UserPersonalData;
