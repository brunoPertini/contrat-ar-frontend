import PropTypes from 'prop-types';
import Slider from '@mui/material/Slider';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { useState } from 'react';

function RangeSlider({
  values, handleOnChange, getInputTextFunction, inputTextsHelpers,
  shouldShowBottomInputs, step, min, max,
}) {
  const [stateValues, setStateValues] = useState(values);

  const onChangeCommitted = (event, newValues) => {
    setStateValues(newValues);
    handleOnChange(newValues);
  };

  return (
    <>
      <Slider
        aria-labelledby="input-slider"
        valueLabelDisplay="auto"
        value={stateValues}
        step={step}
        onChangeCommitted={onChangeCommitted}
        min={min}
        max={max}
      />
      {
        shouldShowBottomInputs && (
        <Box display="flex" flexDirection="row" justifyContent="space-between">
          <TextField
            value={getInputTextFunction(stateValues[0])}
            helperText={inputTextsHelpers[0]}
            size="small"
            readOnly
            inputProps={{
              'aria-labelledby': 'input-slider',
            }}
            sx={{ width: '30%' }}
          />
          <TextField
            value={getInputTextFunction(stateValues[1])}
            helperText={inputTextsHelpers[1]}
            size="small"
            readOnly
            inputProps={{
              'aria-labelledby': 'input-slider',
            }}
            sx={{ width: '30%' }}
          />
        </Box>
        )
      }
    </>
  );
}

RangeSlider.defaultProps = {
  inputTextsHelpers: [],
  getInputTextFunction: () => {},
  shouldShowBottomInputs: false,
  step: 1,
  min: undefined,
  max: undefined,
};

RangeSlider.propTypes = {
  shouldShowBottomInputs: PropTypes.bool,
  values: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])).isRequired,
  handleOnChange: PropTypes.func.isRequired,
  getInputTextFunction: PropTypes.func,
  inputTextsHelpers: PropTypes.arrayOf(PropTypes.string),
  step: PropTypes.number,
  min: PropTypes.number,
  max: PropTypes.number,
};

export default RangeSlider;
