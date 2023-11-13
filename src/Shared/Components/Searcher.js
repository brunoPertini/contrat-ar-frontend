import PropTypes from 'prop-types';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

function Searcher({
  title, titleConfig, searcherConfig, onSearchClick, placeholder,
  isSearchDisabled, searchLabel, handleSearchDone, hasError, errorMessage, inputValue,
}) {
  return (
    <>
      <Typography {...titleConfig}>
        {title}
      </Typography>
      <FormControl {...searcherConfig}>
        <TextField
          autoFocus
          id="vendible-input"
          type="text"
          InputProps={{
            endAdornment: (
              <IconButton
                aria-label="search-input"
                edge="end"
                onClick={onSearchClick}
                disabled={isSearchDisabled}
              >
                <SearchOutlinedIcon />
              </IconButton>
            ),
          }}
          label={searchLabel}
          onChange={handleSearchDone}
          onKeyUp={(event) => (!isSearchDisabled ? onSearchClick(event) : () => {})}
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
};

Searcher.propTypes = {
  title: PropTypes.string,
  placeholder: PropTypes.string,
  onSearchClick: PropTypes.func.isRequired,
  isSearchDisabled: PropTypes.bool,
  searchLabel: PropTypes.string,
  handleSearchDone: PropTypes.func.isRequired,
  hasError: PropTypes.bool,
  errorMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  inputValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  titleConfig: PropTypes.any,
  searcherConfig: PropTypes.any,
};

export default Searcher;
