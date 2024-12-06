import { PropTypes } from 'prop-types';
import Grid from '@mui/material/Grid';
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
    <Grid
      id={containerId}
      container
      sx={{
        marginTop: '5%',
        marginBottom: '5%',
        flexDirection: 'column',
        ml: 0,
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

    </Grid>
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
