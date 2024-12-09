import { PropTypes } from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useEffect } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';

export default function Form({
  fields, title, onLoad, styles, containerId,
}) {
  useEffect(() => {
    onLoad();
  }, [fields]);

  const showSmallerTitle = useMediaQuery('(max-width:768px)');

  return (
    <Box
      id={containerId}
      display="flex"
      flexDirection="column"
      sx={{
        marginTop: '5%',
        marginBottom: '5%',
        ...styles,
      }}
      spacing={2}
    >
      <Typography
        variant={!showSmallerTitle ? 'h5' : 'h6'}
        align="center"
        sx={{
          whiteSpace: 'break-spaces',
        }}
      >
        { title }
      </Typography>
      {
        fields.map((field) => field)

      }

    </Box>
  );
}

Form.propTypes = {
  containerId: PropTypes.string,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  fields: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.elementType])).isRequired,
  onLoad: PropTypes.func,
  styles: PropTypes.objectOf(PropTypes.string),
};

Form.defaultProps = {
  containerId: '',
  onLoad: () => {},
  styles: {},
};
