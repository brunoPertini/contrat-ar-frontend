import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Checkbox from '@mui/material/Checkbox';
import { useCallback, useState } from 'react';

function CheckBoxGroup({
  elements, handleChange, title, bottomLabel,
}) {
  const [checkedElements, setCheckedElements] = useState({});

  const handleChangeChecked = useCallback((checked, element) => {
    setCheckedElements((currentValues) => ({ ...currentValues, [element]: checked }));
    handleChange();
  }, [setCheckedElements]);

  return (
    <Box sx={{ display: 'flex' }}>
      <FormControl
        error={false}
        component="fieldset"
      >
        <FormLabel component="legend">{title}</FormLabel>
        <FormGroup>
          {
                elements.map((element, i) => (
                  <FormControlLabel
                    key={`checkbox_${i}`}
                    control={(
                      <Checkbox
                        checked={checkedElements[element]}
                        onChange={(event) => handleChangeChecked(event.target.checked, element)}
                        name={element}
                      />
                    )}
                    label={element}
                  />
                ))
            }
        </FormGroup>
        { !!bottomLabel && <FormHelperText>{ bottomLabel }</FormHelperText>}
      </FormControl>
    </Box>
  );
}

CheckBoxGroup.defaultProps = {
  bottomLabel: '',
};

CheckBoxGroup.propTypes = {
  elements: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleChange: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  bottomLabel: PropTypes.string,
};

export default CheckBoxGroup;
