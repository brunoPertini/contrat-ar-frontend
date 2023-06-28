import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import Typography from '@mui/material/Typography';

/**
 * Component that renders objects meant to have an image
 * @param {Array<T>} items
 */
export default function ImageList({ items }) {
  return (
    <Box sx={{ width: '100%' }}>
      <List>
        {
            items.map((item) => (
              <ListItem sx={{
                flexDirection: 'column',
                alignItems: 'center',
              }}
              >
                <Typography variant="h5">
                  {item.title}
                </Typography>
                <ImageListItem>
                  <img
                    src={`${item.image.src}`}
                    srcSet={`${item.image.src}`}
                    alt={item.title}
                  />
                  <ImageListItemBar position="below" title={item.text} />
                </ImageListItem>
              </ListItem>
            ))
        }
      </List>
    </Box>
  );
}

ImageList.propTypes = {
  items: PropTypes.array.isRequired,
};
