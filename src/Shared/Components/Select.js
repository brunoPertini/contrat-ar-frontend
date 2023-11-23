import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

function SelectComponent({
  label, handleOnChange, values, containerStyles,
}) {
  const [value, setValue] = useState(values[0]);

  useEffect(() => {
    handleOnChange(values[0]);
  }, []);

  const handleChange = (event) => {
    setValue(event.target.value);
    handleOnChange(event.target.value);
  };

  return (
    <Box sx={{ ...containerStyles }}>
      <FormControl fullWidth>
        <InputLabel>{label}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={value}
          label={label}
          onChange={handleChange}
        >
          {
                values.map((valueLabel) => <MenuItem value={valueLabel}>{valueLabel}</MenuItem>)
            }
        </Select>
      </FormControl>
    </Box>
  );
}

SelectComponent.defaultProps = {
  containerStyles: {},
};

SelectComponent.propTypes = {
  containerStyles: PropTypes.objectOf(PropTypes.string),
  label: PropTypes.string.isRequired,
  handleOnChange: PropTypes.func.isRequired,
  values: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default SelectComponent;
