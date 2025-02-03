import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { sharedLabels } from '../../StaticData/Shared';
import { flexColumn } from '../Constants/Styles';

const rowStyles = { mt: '5%' };

const renderRow = (label, value) => (
  <Box {...flexColumn} {...rowStyles}>
    <Typography variant="h5">
      { label }
      :
    </Typography>
    <Typography variant="h5">
      { value }
    </Typography>
  </Box>
);

export default function UserInfo({ userInfo }) {
  return (
    <Box sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: 'white',
    }}
    >
      {
        Object.keys(userInfo).map((key) => renderRow(sharedLabels[key], userInfo[key]))
      }
    </Box>
  );
}

UserInfo.propTypes = {
  userInfo: PropTypes.object.isRequired,
};
