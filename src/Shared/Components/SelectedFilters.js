import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { EMPTY_FUNCTION } from '../Constants/System';
import { vendiblesLabels } from '../../StaticData/Vendibles';

function SelectedFilters({ showTitle, labels, onDelete }) {
  return (
    <Box sx={{ mb: '2%' }}>
      {
        showTitle && (
        <Typography variant="h4">
          { vendiblesLabels.appliedFilters}
        </Typography>
        )
    }
      {
        Object.entries(labels).map(([key, value]) => (
          <Chip
            key={`selected_filter_${key}`}
            label={value}
            variant="outlined"
            onDelete={() => onDelete(key)}
          />
        ))
    }
    </Box>
  );
}

SelectedFilters.defaultProps = {
  showTitle: false,
  onDelete: EMPTY_FUNCTION,
};

SelectedFilters.propTypes = {
  showTitle: PropTypes.bool,
  labels: PropTypes.objectOf(PropTypes.string).isRequired,
  onDelete: PropTypes.func,
};

export default SelectedFilters;
