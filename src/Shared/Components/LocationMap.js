/* eslint-disable prefer-arrow-callback */
import {
  useEffect, useState,
  useCallback, useMemo, memo,
} from 'react';
import PropTypes from 'prop-types';
import {
  MapContainer, TileLayer, Marker, Popup, ZoomControl,
} from 'react-leaflet';
import Link from '@mui/material/Link';
import { routes } from '../Constants';
import DialogModal from './DialogModal';
import { labels } from '../../StaticData/LocationMap';
import { HttpClientFactory } from '../../Infrastructure/HttpClientFactory';
import { usePreviousPropValue } from '../Hooks/usePreviousPropValue';

const arePropsEqual = (prevProps, nextProps) => (
  prevProps.location.coords.latitude === nextProps.location.coords.latitude
      && prevProps.location.coords.longitude === nextProps.location.coords.longitude
      && prevProps.token === nextProps.token);

/**
 * Map that requests current user location, shows it in a marker and translates it
 * in a human readable address.
 */
const LocationMap = memo(function LocationMap({
  location,
  setLocation,
  containerStyles,
  token,
}) {
  const previousLocation = usePreviousPropValue(location);

  const [openPermissionDialog, setOpenPermissionDialog] = useState(false);

  const [dialogLabels, setDialogLabels] = useState({
    title: labels['dialog.permission.request.title'],
    contextText: labels['dialog.permission.request.textContext'],
    cancelText: labels['dialog.permission.request.cancelText'],
    acceptText: labels['dialog.permission.request.acceptText'],
  });

  const [readableAddress, setReadableAddress] = useState('');

  const geoSettings = {
    enableHighAccuracy: true,
    maximumAge: 30000,
    timeout: 20000,
  };

  const handleGranted = async (position) => {
    await setLocation(position);
    setOpenPermissionDialog(false);
  };

  const handleDialogDenied = () => {
    window.location.href = routes.index;
  };

  const getCurentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      handleGranted,
      handleDialogDenied,
      geoSettings,
    );
  };

  const handlePermission = useCallback(() => {
    navigator.permissions.query({ name: 'geolocation' }).then((result) => {
      if (result.state === 'granted') {
        getCurentLocation();
      }
      if (result.state === 'prompt') {
        setDialogLabels({

          title: labels['dialog.permission.request.title'],
          contextText: labels['dialog.permission.request.textContext'],
          cancelText: labels['dialog.permission.request.cancelText'],
          acceptText: labels['dialog.permission.request.acceptText'],

        });
        setOpenPermissionDialog(true);
      }

      if (result.state === 'denied') {
        setDialogLabels({
          title: labels['dialog.permission.revoke.title'],
          contextText: <span dangerouslySetInnerHTML={{ __html: labels['dialog.permission.revoke.textContext'] }} />,
          acceptText: labels['dialog.permission.revoke.finish'],
        });
        setOpenPermissionDialog(true);
      }
    });
  }, [handleGranted]);

  const translateAddress = useCallback(async (coordsObject) => {
    const { coords } = coordsObject ?? {};

    if (coords) {
      const httpClient = HttpClientFactory.createExternalHttpClient('', { token });

      // eslint-disable-next-line no-shadow
      const readableAddress = await httpClient.getAddressFromLocation({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });

      setReadableAddress(readableAddress);
    }
  }, [HttpClientFactory]);

  useEffect(() => {
    if (!location) {
      handlePermission();
    }

    const locationHasChanged = location?.coords && previousLocation?.coords
     && (location.coords.latitude !== previousLocation.coords.latitude
      && location.coords.longitude !== previousLocation.coords.longitude);
    if (!(previousLocation) || locationHasChanged) {
      translateAddress(location);
    }
  }, [location.coords.latitude, location.coords.longitude, previousLocation]);

  const LocationMarker = useCallback(() => {
    const eventHandlers = useMemo(() => ({
      dragend(e) {
        const { target: { _latlng } } = e;
        const newCoords = {
          coords: {
            latitude: _latlng.lat,
            longitude: _latlng.lng,
          },
        };
        handleGranted(newCoords);
      },
    }), []);

    return !location?.coords ? null : (
      <Marker
        position={[location.coords.latitude, location.coords.longitude]}
        eventHandlers={eventHandlers}
        draggable
      >

        { !!readableAddress && (
          <Popup>
            { readableAddress}
          </Popup>
        )}

      </Marker>
    );
  }, [location.coords.latitude, location.coords.longitude, readableAddress]);

  return (
    <>
      <MapContainer
        center={[location.coords.latitude, location.coords.longitude]}
        zoom={13}
        scrollWheelZoom
        zoomControl={false}
        style={{ ...containerStyles }}
      >
        <ZoomControl position="bottomright" />
        <DialogModal
          title={dialogLabels.title}
          contextText={dialogLabels.contextText}
          cancelText={dialogLabels.cancelText}
          acceptText={dialogLabels.acceptText}
          open={openPermissionDialog}
          handleAccept={getCurentLocation}
          handleDeny={() => handleDialogDenied()}
        />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker />
      </MapContainer>
      <Link>
        { labels.openMapInModal }
      </Link>
    </>
  );
}, arePropsEqual);

LocationMap.defaultProps = {
  containerStyles: {},
};

LocationMap.propTypes = {
  location: PropTypes.shape({
    coords: PropTypes.shape({
      latitude: PropTypes.number,
      longitude: PropTypes.number,
    }),
  }).isRequired,
  setLocation: PropTypes.func.isRequired,
  containerStyles: PropTypes.objectOf(PropTypes.any),
  token: PropTypes.string.isRequired,
};

export default LocationMap;
