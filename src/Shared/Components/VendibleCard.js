/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Box } from '@mui/material';
import Card from '@mui/material/Card';
// import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
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
