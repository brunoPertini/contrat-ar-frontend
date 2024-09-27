import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { sharedLabels } from '../../StaticData/Shared';
import { suscriptionShape } from '../PropTypes/Proveedor';
import { getPlanLabel } from '../Helpers/PlanesHelper';

export default function SuscriptionData({ suscripcion, styles }) {
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
      <Typography variant="h5">
        { sharedLabels.plan }
        :
      </Typography>
      <Typography variant="h5">
        { planLabel}
      </Typography>
      <Typography variant="h5" sx={{ ...styles }}>
        { sharedLabels.state}
        :
      </Typography>
      <Typography variant="h5">
        { suscripcion.isActive ? sharedLabels.activeF : sharedLabels.inactiveF }
      </Typography>
      <Typography variant="h5" sx={{ ...styles }}>
        { sharedLabels.activeSinceF}
        :
      </Typography>
      <Typography variant="h5">
        { suscripcion.createdDate }
      </Typography>
    </Box>
  );
}

SuscriptionData.defaultProps = {
  styles: {},
};

SuscriptionData.propTypes = {
  suscripcion: PropTypes.shape(suscriptionShape).isRequired,
  styles: PropTypes.object,
};
