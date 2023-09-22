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

export default function VendibleCard({
  vendibleTitle, images, linkLabel, onLinkClick,
}) {
  return (
    <Card sx={{ mb: '2%', alignSelf: 'flex-start' }}>
      {
        !!images.length && (
          <ImageList cols={3} gap={10}>
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
            onClick={() => onLinkClick(vendibleTitle)}
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
  onLinkClick: PropTypes.func.isRequired,
};
