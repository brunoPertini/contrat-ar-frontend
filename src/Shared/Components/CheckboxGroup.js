/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Checkbox from '@mui/material/Checkbox';
import { useCallback, useState } from 'react';

function CheckBoxGroup({ elements, handleChange }) {
  const [checked, setChecked] = useState({});

  const handleChangeChecked = useCallback((event) => {
    console.log(event);
    handleChange();
  }, [handleChange]);

  return (
    <Box sx={{ display: 'flex' }}>
      <FormControl
        error={false}
        component="fieldset"
      >
        <FormLabel component="legend">Categoría de producto</FormLabel>
        <FormGroup>
          {
                elements.map((element) => (
                  <FormControlLabel
                    key={`filters_category_${element}`}
                    control={(
                      <Checkbox
                        checked={checked[element]}
                        onChange={handleChangeChecked}
                        name={element}
                      />
                    )}
                    label={element}
                  />
                ))
            }
        </FormGroup>
        <FormHelperText>Podés seleccionar más de una categoría</FormHelperText>
      </FormControl>
    </Box>
  );
}

export default CheckBoxGroup;
