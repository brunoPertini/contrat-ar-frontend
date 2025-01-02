import PropTypes from 'prop-types';
import Slider from '@mui/material/Slider';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { useEffect, useRef, useState } from 'react';
import { deleteNonNumericCharacters } from '../Utils/InputUtils';
import { replaceArgentinianCurrencySymbol } from '../Helpers/PricesHelper';
import { INTEGER_MAXIMUM } from '../Constants/System';

function RangeSlider({
  values, handleOnChange, getInputTextFunction, inputTextsHelpers, getAriaValueText,
  valueLabelFormat, shouldShowBottomInputs, bottomInputsProps, step, min, max, showInputsIcon,
}) {
  const [stateValues, setStateValues] = useState(values);
  const [iconDisabled, setIconDisabled] = useState(false);
  const [isSliderDisabled, setIsSliderDisabled] = useState(false);

  const firstInputRef = useRef(null);
  const secondInputRef = useRef(null);

  const onChangeCommitted = (event, newValues) => {
    setStateValues(newValues);
  };

  const onMouseUp = () => {
    setIsSliderDisabled(true);
    handleOnChange(stateValues);
    setTimeout(() => {
      setIsSliderDisabled(false);
    }, 1300);
  };

  const onInputChange = (event, inputType) => {
    if (bottomInputsProps.readOnly) {
      return () => {};
    }

    if (inputType === 'min') {
      firstInputRef.current.focus();
    } else {
      secondInputRef.current.focus();
    }

    const { value } = event.target;

    let preFormattedValue = deleteNonNumericCharacters(
      replaceArgentinianCurrencySymbol(value),
    );

    if (preFormattedValue > INTEGER_MAXIMUM) {
      preFormattedValue = INTEGER_MAXIMUM.toString();
    }

    const newValues = inputType === 'min' ? handleOnChange([preFormattedValue, stateValues[1]], true)
      : handleOnChange([stateValues[0], preFormattedValue], true);

    return setStateValues(newValues);
  };

  const onIconClick = () => {
    if (!showInputsIcon) {
      return () => {};
    }

    setIconDisabled(true);
    setIsSliderDisabled(true);
    handleOnChange(stateValues, true, true);

    return setTimeout(() => {
      setIconDisabled(false);
      setIsSliderDisabled(false);
    }, 2000);
  };

  const inputCommonProps = {
    size: 'small',
    width: '30%',
  };

  useEffect(() => {
    setStateValues([...values]);
  }, [values]);

  return (
    <>
      <Slider
        disabled={isSliderDisabled}
        aria-labelledby="input-slider"
        valueLabelDisplay="auto"
        value={stateValues}
        step={step}
        onChange={onChangeCommitted}
        onChangeCommitted={onMouseUp}
        min={min}
        max={max}
        getAriaValueText={getAriaValueText}
        valueLabelFormat={valueLabelFormat}
        sx={{
          '& .MuiSlider-track': {
            backgroundColor: 'primary.main',
          },
          '& .MuiSlider-thumb': {
            backgroundColor: 'primary.main',
          },
          '& .MuiSlider-rail': {
            backgroundColor: 'text.disabled',
          },
        }}
      />
      {
        shouldShowBottomInputs && (
        <Box
          display="flex"
          flexDirection={{
            xs: 'column', sm: 'column', md: 'column', lg: 'row',
          }}
          gap={2}
        >
          <TextField
            ref={firstInputRef}
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
            ref={secondInputRef}
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
              <IconButton disabled={iconDisabled} sx={{ padding: 0 }}>
                <SearchOutlinedIcon
                  style={{ fontSize: '1.5rem', cursor: 'pointer' }}
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
  values: [],
  inputTextsHelpers: [],
  getInputTextFunction: () => {},
  shouldShowBottomInputs: false,
  step: 1,
  min: undefined,
  max: undefined,
  bottomInputsProps: { readOnly: true },
  showInputsIcon: false,
  getAriaValueText: undefined,
  valueLabelFormat: undefined,
};

RangeSlider.propTypes = {
  bottomInputsProps: PropTypes.object,
  shouldShowBottomInputs: PropTypes.bool,
  values: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])),
  handleOnChange: PropTypes.func.isRequired,
  getInputTextFunction: PropTypes.func,
  inputTextsHelpers: PropTypes.arrayOf(PropTypes.string),
  step: PropTypes.number,
  min: PropTypes.number,
  max: PropTypes.number,
  showInputsIcon: PropTypes.bool,
  getAriaValueText: PropTypes.func,
  valueLabelFormat: PropTypes.func,
};

export default RangeSlider;
