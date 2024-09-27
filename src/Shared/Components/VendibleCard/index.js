import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { useMemo } from 'react';
import StaticAlert from '../StaticAlert';
import { POST_STATES } from '../../Constants/System';
import { postStateLabelResolver } from '../../Helpers/ProveedorHelper';
import { proveedorLabels } from '../../../StaticData/Proveedor';

const STATE_SEVERITY = {
  [POST_STATES.ACTIVE]: 'success',
  [POST_STATES.INACTIVE]: 'warning',
  [POST_STATES.IN_REVIEW]: 'info',
  [POST_STATES.REJECTED]: 'error',
  [POST_STATES.PAUSED]: 'info',
};
export default function VendibleCard({
  vendibleTitle, images, LinkSection,
  imageListProps: { cols, gap, sx },
  cardStyles, linkCardStyles, ChildrenComponent,
  state, manageStateChange,
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

  const { shouldShowStateSwitch, switchLabel } = useMemo(() => ({
    shouldShowStateSwitch: !!state && (
      state === POST_STATES.ACTIVE || state === POST_STATES.PAUSED
    ),
    switchLabel: state === POST_STATES.ACTIVE ? proveedorLabels['vendible.state.pause']
      : proveedorLabels['vendible.state.resume'],
  }), [state]);

  const handleChangeState = (event) => {
    manageStateChange(!event.target.checked
      ? POST_STATES.PAUSED : POST_STATES.ACTIVE);
  };

  const titleSection = (
    <CardContent>
      <Typography gutterBottom variant="h5" component="div">
        { vendibleTitle }
      </Typography>
      {
        state && (
          <StaticAlert
            styles={{
              width: '125px',
              marginTop: '2%',
            }}
            severity={STATE_SEVERITY[state]}
            label={postStateLabelResolver[state]}
          />
        )
      }
      {
         shouldShowStateSwitch && (
         <Box display="flex" flexDirection="column" sx={{ mt: '3%', ml: '3%' }}>
           <FormControlLabel
             control={(
               <Switch
                 checked={state === POST_STATES.ACTIVE}
                 onChange={handleChangeState}
               />
)}
             label={switchLabel}
           />
         </Box>
         )
      }
    </CardContent>
  );

  const linkContent = (
    <CardContent sx={{ ...linkCardStyles }}>
      { LinkSection }
    </CardContent>
  );

  return (
    <Card sx={{ ...cardStyles }}>
      <ChildrenComponent
        vendibleTitle={vendibleTitle}
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
  LinkSection: PropTypes.node.isRequired,
  cardStyles: PropTypes.objectOf(PropTypes.string),
  linkCardStyles: PropTypes.objectOf(PropTypes.string),
  imageListProps: PropTypes.shape({
    cols: PropTypes.number,
    gap: PropTypes.number,
    sx: PropTypes.objectOf(PropTypes.string),
  }).isRequired,
  ChildrenComponent: PropTypes.elementType.isRequired,
  manageStateChange: PropTypes.func.isRequired,
  state: PropTypes.string.isRequired,
};
