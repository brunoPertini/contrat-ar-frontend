import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { sharedLabels } from '../../StaticData/Shared';

export default function VendibleCard({
  image, title, text, proveedor,
}) {
  return (
    <Card sx={{ mb: '2%' }}>
      <CardMedia
        sx={{ height: 140 }}
        image={image.src}
        title={image.text}
      />
      <Box sx={{ display: 'flex', flexDirection: 'row' }}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            { title }
          </Typography>
          <Typography variant="body2" color="text.secondary">
            { text }
          </Typography>
        </CardContent>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            { sharedLabels.provider }
          </Typography>
          <Typography variant="body2" color="text.secondary">
            { proveedor.name }
            {' '}
            { proveedor.surname }
          </Typography>
          {
            !!(proveedor.location.distanceFrom) && (
              <Typography variant="body2" color="text.secondary">
                  {sharedLabels.to}
                  {' '}
                  {proveedor.location.distanceFrom}
                  {' '}
                  {sharedLabels.kilometersAway}
                <LocationOnIcon fontSize="medium" />
              </Typography>
            )
          }
        </CardContent>
      </Box>
      {/*
      <CardActions>
         TODO: checkbox para marcar proveedor
      </CardActions>
      */}
    </Card>
  );
}

VendibleCard.defaultProps = {
  image: {
    src: '',
    text: '',
  },
};

VendibleCard.propTypes = {
  image: PropTypes.shape({
    text: PropTypes.string,
    src: PropTypes.string,
  }),
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  proveedor: PropTypes.shape({
    name: PropTypes.string,
    surname: PropTypes.string,
    location: PropTypes.any,
  }).isRequired,
};
