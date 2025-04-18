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
import InfoIcon from '@mui/icons-material/Info';
import StaticAlert from '../StaticAlert';
import { CLIENTE, POST_STATES } from '../../Constants/System';
import { postStateLabelResolver } from '../../Helpers/ProveedorHelper';
import { proveedorLabels } from '../../../StaticData/Proveedor';
import { Tooltip } from '..';
import { labels } from '../../../StaticData/Cliente';

const STATE_SEVERITY = {
  [POST_STATES.ACTIVE]: 'success',
  [POST_STATES.INACTIVE]: 'warning',
  [POST_STATES.IN_REVIEW]: 'info',
  [POST_STATES.REJECTED]: 'error',
  [POST_STATES.PAUSED]: 'info',
};

export default function VendibleCard({
  vendibleTitle, images, LinkSection,
  imageListProps, userRole,
  cardStyles, linkCardStyles, ChildrenComponent,
  state, manageStateChange,
}) {
  const contentStyles = {
    display: 'flex', flex: 1, flexDirection: 'column',
  };

  const imageSection = images.length > 0 && (
    <CardContent sx={{ ...contentStyles }}>
      <ImageList {...imageListProps}>
        {images.map((imageUrl, i) => (
          <ImageListItem key={`image_${vendibleTitle}_${i}`} sx={{ height: '100%' }}>
            <img
              src={imageUrl}
              alt={vendibleTitle}
              loading="lazy"
              style={{
                width: '100%',
                height: 'auto',
                objectFit: 'contain',
                borderRadius: '8px',
                maxWidth: '100%',
                overflowY: 'auto',
              }}
            />
          </ImageListItem>
        ))}
      </ImageList>
    </CardContent>
  );

  const { shouldShowStateSwitch, switchLabel } = useMemo(() => ({
    shouldShowStateSwitch: !!state && (
      state === POST_STATES.ACTIVE || state === POST_STATES.PAUSED
    ),
    switchLabel: state === POST_STATES.ACTIVE
      ? proveedorLabels['vendible.state.pause']
      : proveedorLabels['vendible.state.resume'],
  }), [state]);

  const handleChangeState = (event) => {
    manageStateChange(!event.target.checked
      ? POST_STATES.PAUSED : POST_STATES.ACTIVE);
  };

  const titleSection = (
    <CardContent sx={{ ...contentStyles }}>
      <Typography variant="h5" component="div" fontWeight="bold">
        {vendibleTitle}
        {
          userRole === CLIENTE && (
            <Tooltip
              placement="top-end"
              title={(
                <Typography variant="h6">
                  { labels.vendibleDisclaimer }
                </Typography>

                                  )}
            >
              <InfoIcon sx={{ cursor: 'pointer' }} />
            </Tooltip>
          )
        }
      </Typography>
      {state && (
        <StaticAlert
          styles={{ width: '125px', marginTop: '8px' }}
          severity={STATE_SEVERITY[state]}
          label={postStateLabelResolver[state]}
        />
      )}
      {shouldShowStateSwitch && (
        <Box sx={{ mt: 2 }}>
          <FormControlLabel
            control={<Switch checked={state === POST_STATES.ACTIVE} onChange={handleChangeState} />}
            label={switchLabel}
          />
        </Box>
      )}
    </CardContent>
  );

  const linkContent = (
    <CardContent sx={{
      ...linkCardStyles, ...contentStyles, borderTop: '1px solid #ddd', mt: 1,
    }}
    >
      {LinkSection}
    </CardContent>
  );

  return (
    <Card sx={{ ...cardStyles, p: 2, bgcolor: 'background.paper' }}>
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
  userRole: PropTypes.string.isRequired,
};
