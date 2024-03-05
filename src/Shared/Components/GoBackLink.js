import PropTypes from 'prop-types';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import { sharedLabels } from '../../StaticData/Shared';

function GoBackLink({ goBackFunction }) {
  return (
    <Box sx={{ mt: '1rem', mb: '1rem' }}>
      <Link
        variant="h5"
        onClick={() => goBackFunction()}
        sx={{ width: '30%', cursor: 'pointer' }}
      >
        { sharedLabels.goBack }
      </Link>
    </Box>
  );
}

GoBackLink.propTypes = {
  goBackFunction: PropTypes.func.isRequired,
};

export default GoBackLink;
