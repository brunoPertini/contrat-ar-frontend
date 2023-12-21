import PropTypes from 'prop-types';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { isDeletePressed, isEnterPressed } from '../Utils/DomUtils';
import { EMPTY_FUNCTION } from '../Constants/System';
/**
 * Text input component capable of running a set of functions when some event occurs,
 * as keyUp, enter pressed, delete pressed, click (over its search icon).
 * It's meant to be an uncontrolled component.
 */
function Searcher({
  title, titleConfig, searcherConfig, onSearchClick, placeholder, keyEvents,
  isSearchDisabled, searchLabel, autoFocus, required,
  hasError, errorMessage, inputValue, inputProps,
}) {
  const {
    onKeyUp = EMPTY_FUNCTION,
    onEnterPressed = EMPTY_FUNCTION,
    onDeletePressed = EMPTY_FUNCTION,
  } = keyEvents;

  const handleKeyEvents = (event) => {
    if (isSearchDisabled) {
      return;
    }

    if (isEnterPressed(event)) {
      onEnterPressed();
    }

    if (isDeletePressed(event)) {
      onDeletePressed();
    }
  };

  const handleOnChange = (event) => onKeyUp(event.target.value);

  const handleOnClick = () => onSearchClick();

  return (
    <>
      <Typography {...titleConfig}>
        {title}
      </Typography>
      <FormControl {...searcherConfig}>
        <TextField
          required={required}
          autoFocus={autoFocus}
          type="text"
          inputProps={{
            ...inputProps,
          }}
          // eslint-disable-next-line react/jsx-no-duplicate-props
          InputProps={{
            endAdornment: onSearchClick ? (
              <IconButton
                aria-label="search-input"
                edge="end"
                onClick={handleOnClick}
                disabled={isSearchDisabled}
              >
                <SearchOutlinedIcon />
              </IconButton>
            ) : undefined,
          }}
          InputLabelProps={{ shrink: true }}
          label={searchLabel}
          onKeyUp={handleKeyEvents}
          onChange={handleOnChange}
          error={hasError}
          helperText={errorMessage}
          value={inputValue}
          placeholder={placeholder}
        />
      </FormControl>

    </>
  );
}

Searcher.defaultProps = {
  title: '',
  placeholder: '',
  isSearchDisabled: false,
  autoFocus: false,
  searchLabel: '',
  hasError: false,
  errorMessage: '',
  inputValue: '',
  titleConfig: {},
  searcherConfig: {},
  onSearchClick: EMPTY_FUNCTION,
  keyEvents: {
    onKeyUp: EMPTY_FUNCTION,
    onEnterPressed: EMPTY_FUNCTION,
    onDeletePressed: EMPTY_FUNCTION,
  },
  inputProps: {},
  required: false,
};

Searcher.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  placeholder: PropTypes.string,
  onSearchClick: PropTypes.func,
  isSearchDisabled: PropTypes.bool,
  autoFocus: PropTypes.bool,
  searchLabel: PropTypes.string,
  hasError: PropTypes.bool,
  errorMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  inputValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  titleConfig: PropTypes.any,
  searcherConfig: PropTypes.any,
  keyEvents: PropTypes.shape({
    onKeyUp: PropTypes.func,
    onEnterPressed: PropTypes.func,
    onDeletePressed: PropTypes.func,
  }),
  inputProps: PropTypes.object,
  required: PropTypes.bool,
};

export default Searcher;
