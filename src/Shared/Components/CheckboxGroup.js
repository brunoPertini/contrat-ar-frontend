import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Checkbox from '@mui/material/Checkbox';
import { useCallback, useEffect, useState } from 'react';

function CheckBoxGroup({
  elements, handleChange, title, bottomLabel, defaultChecked,
}) {
  const [checkedElements, setCheckedElements] = useState({});

  const handleChangeChecked = useCallback((checked, element) => {
    setCheckedElements((currentValues) => {
      const newChecked = ({ ...currentValues, [element]: checked });
      const checkedKeys = Object.keys(newChecked).filter((key) => newChecked[key]);
      handleChange(checkedKeys);
      return newChecked;
    });
  }, [setCheckedElements]);

  useEffect(() => {
    if (defaultChecked?.length) {
      const newChecked = defaultChecked.reduce((acum, key) => {
        acum[key] = true;
        return acum;
      }, {});
      setCheckedElements(newChecked);
    }
  }, []);

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
                        checked={checkedElements[element] ?? false}
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
  defaultChecked: [],
  title: null,
};

CheckBoxGroup.propTypes = {
  elements: PropTypes.arrayOf(PropTypes.string).isRequired,
  defaultChecked: PropTypes.arrayOf(PropTypes.string),
  handleChange: PropTypes.func.isRequired,
  title: PropTypes.string,
  bottomLabel: PropTypes.string,
};

export default CheckBoxGroup;
