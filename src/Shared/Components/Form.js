/* eslint-disable react/prop-types */
import { PropTypes } from 'prop-types';
import {
  Grid, Typography,
} from '@mui/material';
import { useEffect } from 'react';

export default function Form({ fields, title, onLoad }) {
  useEffect(() => {
    onLoad();
  }, [fields]);
  return (
    <Grid
      container
      sx={{
        marginTop: '5%',
        marginBottom: '5%',
        flexDirection: 'column',
        alignItems: 'center',
      }}
      spacing={2}
    >
      <Typography variant="h6" align="left">
        { title }
      </Typography>
      {
        fields.map((Field) => <Field />)
     }
    </Grid>
  );
}

Form.propTypes = {
  title: PropTypes.string.isRequired,
  fields: PropTypes.arrayOf(PropTypes.node).isRequired,
};
