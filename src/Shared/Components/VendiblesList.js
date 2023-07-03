/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import Typography from '@mui/material/Typography';
import { Divider } from '@mui/material';
import ImageCard from './ImageCard';

/**
 * List that shows each service or product info, including its provider
 * @param {Array<T>} items
 */
export default function VendiblesList({ items }) {
  return (
    <List sx={{
      width: '100%', flexDirection: 'column', alignItems: 'center', display: 'flex',
    }}
    >
      { items.map((item) => {
        const vendibleType = 'services' in item ? 'services' : 'products';
        return item[vendibleType].map(
          (vendible) => (
            <ImageCard
              image={vendible.image}
              title={vendible.title}
              text={vendible.text}
            />
          ),
        );
      })}
    </List>

  // <ListItem sx={{
  //   flexDirection: 'column',
  //   alignItems: 'center',
  // }}
  // >
  //   <Typography variant="h5">
  //     {item.title}
  //   </Typography>
  //   <ImageListItem>
  //     <img
  //       src={`${item.image.src}`}
  //       srcSet={`${item.image.src}`}
  //       alt={item.title}
  //     />
  //     <ImageListItemBar position="below" title={item.text} />
  //   </ImageListItem>
  // </ListItem>
  );
}

VendiblesList.propTypes = {
  items: PropTypes.array.isRequired,
};
