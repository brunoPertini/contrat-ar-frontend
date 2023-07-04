import PropTypes from 'prop-types';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';

export default function RadioGroupComponent({
  onChange, defaultValue, row, values,
}) {
  return (
    <RadioGroup
      onChange={onChange}
      defaultValue={defaultValue}
      name="radio-buttons-group"
      row={row}
    >
      {
            values.map(({ value, style, label }) => (
              <FormControlLabel
                value={value}
                control={(
                  <Radio sx={{ ...style }} />
              )}
                label={label}
              />
            ))
      }
    </RadioGroup>
  );
}

RadioGroupComponent.propTypes = {
  onChange: PropTypes.func.isRequired,
  defaultValue: PropTypes.string.isRequired,
  row: PropTypes.bool.isRequired,
  values: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string,
    style: PropTypes.any,
    label: PropTypes.string,
  })).isRequired,
};
