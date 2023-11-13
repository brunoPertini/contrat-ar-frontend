/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';

export default function VendibleCard({
  vendibleTitle, images, linkSection,
  imageListProps: { cols, gap, sx },
  cardStyles, linkCardStyles, ChildrenComponent,
}) {
  const imageSection = !!images.length && (
    <ImageList cols={cols} gap={gap} sx={sx}>
      {images.map((imageUrl, i) => (
        <ImageListItem key={`image_${vendibleTitle}_${i}`}>
          <img
            src={imageUrl}
            srcSet={imageUrl}
            alt={vendibleTitle}
            loading="lazy"
          />
        </ImageListItem>
      ))}
    </ImageList>
  );

  const titleSection = (
    <CardContent>
      <Typography gutterBottom variant="h5" component="div">
        { vendibleTitle }
      </Typography>
    </CardContent>
  );

  const linkContent = (
    <CardContent sx={{ ...linkCardStyles }}>
      {linkSection}
    </CardContent>
  );

  return (
    <Card sx={{ ...cardStyles }}>
      <ChildrenComponent
        linkSection={linkContent}
        imageSection={imageSection}
        titleSection={titleSection}
      />
    </Card>
  );
}

VendibleCard.defaultProps = {
  cardStyles: {},
  linkCardStyles: {},
};

VendibleCard.propTypes = {
  vendibleTitle: PropTypes.string.isRequired,
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  linkSection: PropTypes.node.isRequired,
  cardStyles: PropTypes.objectOf(PropTypes.string),
  linkCardStyles: PropTypes.objectOf(PropTypes.string),
  imageListProps: PropTypes.shape({
    MAX_GALLERY_IMAGES: PropTypes.number.isRequired,
    gap: PropTypes.number.isRequired,
  }).isRequired,
  ChildrenComponent: PropTypes.node.isRequired,
};
