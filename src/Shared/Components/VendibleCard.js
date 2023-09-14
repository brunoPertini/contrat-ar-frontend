/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { ImageList, ImageListItem } from '@mui/material';
import { sharedLabels } from '../../StaticData/Shared';

export default function VendibleCard({
  vendibleTitle, images, vendibleType,
}) {
  return (
    <Card sx={{ mb: '2%' }}>
      {
        !!images.length && (
          <ImageList cols={images.length} gap={10}>
            {images.map((imageUrl) => (
              <ImageListItem key={imageUrl}>
                <img
                  src={imageUrl}
                  srcSet={imageUrl}
                  alt={vendibleTitle}
                  loading="lazy"
                />
              </ImageListItem>
            ))}
          </ImageList>
        )
      }
      <Box sx={{ display: 'flex', flexDirection: 'row' }}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            { vendibleTitle }
          </Typography>
        </CardContent>
        {/* <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            { sharedLabels.provider }
          </Typography>
          {
            proveedor && (
              <>
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
              </>
            )
          }
        </CardContent> */}
      </Box>
    </Card>
  );
}

VendibleCard.propTypes = {
  vendibleTitle: PropTypes.string.isRequired,
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  vendibleType: PropTypes.oneOf(['servicios', 'productos']).isRequired,
};
