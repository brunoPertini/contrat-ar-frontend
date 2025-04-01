import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { sharedLabels } from '../../StaticData/Shared';
import { suscriptionShape } from '../PropTypes/Proveedor';
import { getPlanLabel } from '../Helpers/PlanesHelper';
import { flexColumn } from '../Constants/Styles';

const rowStyles = { mt: '5%' };

const renderRowAsText = (label, value) => (
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

export default function SuscriptionData({ suscripcion }) {
  const planLabel = getPlanLabel(suscripcion.planId);

  return (
    <Box sx={{
      width: '200px',
      height: '300px',
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: 'white',
    }}
    >
      {
        renderRowAsText(sharedLabels.plan, planLabel)
      }
      {
        renderRowAsText(sharedLabels.state, suscripcion.active
          ? sharedLabels.activeF : sharedLabels.inactiveF)
      }
      {
        renderRowAsText(sharedLabels.activeSinceF, suscripcion.createdDate)
      }

    </Box>
  );
}

SuscriptionData.propTypes = {
  suscripcion: PropTypes.shape(suscriptionShape).isRequired,
};
