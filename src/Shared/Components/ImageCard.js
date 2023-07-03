/* eslint-disable react/prop-types */
import Card from '@mui/material/Card';
// import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

export default function MediaCard({ image, title, text }) {
  return (
    <Card sx={{ mb: '2%' }}>
      <CardMedia
        sx={{ height: 140 }}
        image={image.src}
        title={image.text}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          { title }
        </Typography>
        <Typography variant="body2" color="text.secondary">
          { text }
        </Typography>
      </CardContent>
      {/*
      <CardActions>
         TODO: checkbox para marcar proveedor
      </CardActions>
      */}
    </Card>
  );
}
