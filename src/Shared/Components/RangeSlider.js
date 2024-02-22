import PropTypes from 'prop-types';
import Slider from '@mui/material/Slider';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { useState } from 'react';

function RangeSlider({
  values, handleOnChange, getInputTextFunction, inputTextsHelpers, shouldShowBottomInputs,
}) {
  const [stateValues, setStateValues] = useState(values);

  const handleOnChangeStateValues = (event, newValues) => {
    setStateValues(newValues);
    handleOnChange(newValues);
  };

  return (
    <>
      <Slider
        aria-labelledby="input-slider"
        valueLabelDisplay="auto"
        value={stateValues}
        onChange={handleOnChangeStateValues}
        step={0.5}
        shiftStep={0.5}
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
};

RangeSlider.propTypes = {
  shouldShowBottomInputs: PropTypes.bool,
  values: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])).isRequired,
  handleOnChange: PropTypes.func.isRequired,
  getInputTextFunction: PropTypes.func,
  inputTextsHelpers: PropTypes.arrayOf(PropTypes.string),
};

export default RangeSlider;
