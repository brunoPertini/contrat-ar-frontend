import PropTypes from 'prop-types';
import Slider from '@mui/material/Slider';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { useState } from 'react';

function RangeSlider({
  values, handleOnChange, getInputTextFunction, inputTextsHelpers,
  shouldShowBottomInputs, bottomInputsProps, step, min, max, showInputsIcon,
}) {
  const [stateValues, setStateValues] = useState(values);
  const [iconDisabled, setIconDisabled] = useState(false);

  const onChangeCommitted = (event, newValues) => {
    setStateValues(newValues);
  };

  const onInputChange = (event, inputType) => {
    if (bottomInputsProps.readOnly) {
      return () => {};
    }

    const newValues = inputType === 'min' ? handleOnChange([event.target.value, stateValues[1]], true)
      : handleOnChange([stateValues[0], event.target.value], true);

    return setStateValues(newValues);
  };

  const onIconClick = () => {
    if (!showInputsIcon) {
      return () => {};
    }

    setIconDisabled(true);
    handleOnChange(stateValues, true, true);

    return setTimeout(() => {
      setIconDisabled(false);
    }, 2000);
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
        onChange={onChangeCommitted}
        onChangeCommitted={() => handleOnChange(stateValues)}
        min={min}
        max={max}
      />
      {
        shouldShowBottomInputs && (
        <Box display="flex" flexDirection="row" justifyContent="space-evenly">
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
          {
            showInputsIcon && (
              <IconButton disabled={iconDisabled}>
                <SearchOutlinedIcon
                  style={{ fontSize: '2.5rem', cursor: 'pointer' }}
                  onClick={onIconClick}
                />
              </IconButton>
            )
          }
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
  showInputsIcon: false,
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
  showInputsIcon: PropTypes.bool,
};

export default RangeSlider;
