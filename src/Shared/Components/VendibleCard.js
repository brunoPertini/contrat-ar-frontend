/* eslint-disable jsx-a11y/anchor-is-valid */
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import { Link } from '@mui/material';
import Groups2Icon from '@mui/icons-material/Groups2';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export default function VendibleCard({
  vendibleTitle, images, linkLabel, redirectLink,
}) {
  const navigate = useNavigate();

  const handleGoToVendiblePage = useCallback(() => {
    navigate(redirectLink, { state: { test: 'fdfdfd' } });
  }, [navigate]);
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
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <CardContent sx={{ display: 'flex' }}>
          <Groups2Icon fontSize="large" />
          <Link
            onClick={handleGoToVendiblePage}
            variant="h5"
            sx={{
              ml: '10px',
              cursor: 'pointer',
            }}
          >
            { linkLabel }
          </Link>
        </CardContent>
      </Box>
    </Card>
  );
}

VendibleCard.propTypes = {
  vendibleTitle: PropTypes.string.isRequired,
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  linkLabel: PropTypes.string.isRequired,
  redirectLink: PropTypes.string.isRequired,
};

// TODO: extraerlo a pagina de vendible
/* <CardContent>
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
</CardContent> */
