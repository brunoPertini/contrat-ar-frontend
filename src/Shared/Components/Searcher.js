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
  isSearchDisabled, searchLabel,
  hasError, errorMessage, inputValue,
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
          autoFocus
          type="text"
          InputProps={{
            endAdornment: (
              <IconButton
                aria-label="search-input"
                edge="end"
                onClick={handleOnClick}
                disabled={isSearchDisabled}
              >
                <SearchOutlinedIcon />
              </IconButton>
            ),
          }}
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
  searchLabel: '',
  hasError: false,
  errorMessage: '',
  inputValue: '',
  titleConfig: {},
  searcherConfig: {},
  keyEvents: {
    onKeyUp: EMPTY_FUNCTION,
    onEnterPressed: EMPTY_FUNCTION,
    onDeletePressed: EMPTY_FUNCTION,
  },
};

Searcher.propTypes = {
  title: PropTypes.string,
  placeholder: PropTypes.string,
  onSearchClick: PropTypes.func.isRequired,
  isSearchDisabled: PropTypes.bool,
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
};

export default Searcher;
