import PropTypes from 'prop-types';
import Slider from '@mui/material/Slider';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { useState } from 'react';

function RangeSlider({
  values, handleOnChange, getInputTextFunction, inputTextsHelpers,
  shouldShowBottomInputs, bottomInputsProps, step, min, max,
}) {
  const [stateValues, setStateValues] = useState(values);

  const onChangeCommitted = (event, newValues) => {
    setStateValues(newValues);
    handleOnChange(newValues);
  };

  const onInputChange = (event, inputType) => {
    let newValues = [];
    if (inputType === 'min') {
      newValues = handleOnChange([event.target.value, stateValues[1]]);
    }

    if (inputType === 'max') {
      newValues = handleOnChange([stateValues[0], event.target.value]);
    }

    setStateValues(newValues);
  };

  const inputCommonProps = {
    size: 'small',
    sx: { width: '30%' },
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
            inputProps={{
              'aria-labelledby': 'input-slider',
            }}
            onChange={(e) => onInputChange(e, 'min')}
            id={bottomInputsProps.firstInputId}
            {...inputCommonProps}
            {...bottomInputsProps}

          />
          <TextField
            value={getInputTextFunction(stateValues[1])}
            helperText={inputTextsHelpers[1]}
            inputProps={{
              'aria-labelledby': 'input-slider',
            }}
            onChange={(e) => onInputChange(e, 'max')}
            id={bottomInputsProps.secondInputId}
            {...inputCommonProps}
            {...bottomInputsProps}

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
  bottomInputsProps: { readOnly: true },
};

RangeSlider.propTypes = {
  bottomInputsProps: PropTypes.object,
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
