import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

function SelectComponent({
  label, handleOnChange, values, containerStyles,
  defaultSelected, renderValue, disabled,
}) {
  const [value, setValue] = useState(defaultSelected);

  useEffect(() => {
    const newValue = defaultSelected ? values[defaultSelected] : values[0];
    setValue(newValue);
  }, [defaultSelected]);

  const handleChange = (event) => {
    setValue(event.target.value);
    handleOnChange(event.target.value);
  };

  return (
    <Box sx={{ ...containerStyles }}>
      <FormControl disabled={disabled}>
        <InputLabel sx={{
          color: 'rgb(36, 134, 164)',
          opacity: 1,
          maxWidth: 'unset',
        }}
        >
          {label}
        </InputLabel>
        <Select
          value={value}
          label={label}
          onChange={handleChange}
          renderValue={renderValue}
          sx={{ mt: '3%' }}
        >
          {
                values.map((valueLabel) => (
                  <MenuItem
                    key={`select_element${valueLabel}`}
                    value={valueLabel}
                  >
                    {valueLabel}
                  </MenuItem>
                ))
            }
        </Select>
      </FormControl>
    </Box>
  );
}

SelectComponent.defaultProps = {
  containerStyles: {},
  defaultSelected: 0,
  renderValue: undefined,
  disabled: false,
};

SelectComponent.propTypes = {
  disabled: PropTypes.bool,
  renderValue: PropTypes.func,
  containerStyles: PropTypes.objectOf(PropTypes.string),
  label: PropTypes.string.isRequired,
  handleOnChange: PropTypes.func.isRequired,
  values: PropTypes.arrayOf(PropTypes.string).isRequired,
  defaultSelected: PropTypes.number,
};

export default SelectComponent;
