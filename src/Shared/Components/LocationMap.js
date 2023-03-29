/* eslint-disable no-unused-vars */
import {
  useEffect, useState,
  useCallback, useMemo,
} from 'react';
import {
  MapContainer, TileLayer, Marker, Popup, ZoomControl,
} from 'react-leaflet';
import { TextField } from '@mui/material';
import withRouter from './HighOrderComponents/withRouter';
import { routes, thirdPartyRoutes } from '../Constants';
import DialogModal from './DialogModal';
import { labels } from '../../StaticData/LocationMap';
import { HttpClientFactory } from '../../Infrastructure/HttpClientFactory';
import { isElementBeingShown } from '../Utils/DomUtils';

/**
 * Map that requests current user location, shows it in a marker and translates it
 * in a human readable address.
 */
export default withRouter(({
  router: { navigate }, showTranslatedAddress, containerId,
  location, setLocation, readableAddress, setReadableAddress,
}) => {
  const [openPermissionDialog, setOpenPermissionDialog] = useState(false);

  const [dialogLabels, setDialogLabels] = useState({
    title: labels['dialog.permission.request.title'],
    contextText: labels['dialog.permission.request.textContext'],
    cancelText: labels['dialog.permission.request.cancelText'],
    acceptText: labels['dialog.permission.request.acceptText'],
  });

  const geoSettings = {
    enableHighAccuracy: true,
    maximumAge: 30000,
    timeout: 20000,
  };

  const handleGranted = async (position) => {
    await setLocation(position);
    setOpenPermissionDialog(false);
  };

  const isMainContainerShown = useMemo(() => isElementBeingShown('#locationMapContainer'), [isElementBeingShown]);

  const handleDialogDenied = useCallback(() => {
    navigate(routes.index);
  }, [navigate]);

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

  const translateAddress = useCallback(async ({ coords }) => {
    const httpClient = HttpClientFactory.createExternalHttpClient(
      thirdPartyRoutes.getAddressFromCoordinates,
    );

    // eslint-disable-next-line no-shadow
    const readableAddress = await httpClient.getAddressFromLocation({
      lat: coords.latitude,
      lon: coords.longitude,
    });

    setReadableAddress(readableAddress);
  }, [HttpClientFactory]);

  useEffect(() => {
    if (isMainContainerShown) {
      handlePermission();
    }
  }, [isMainContainerShown]);

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
        translateAddress(newCoords);
      },
    }), []);

    return !location?.coords ? null : (
      <Marker
        position={[location.coords.latitude, location.coords.longitude]}
        eventHandlers={eventHandlers}
        draggable
      >
        <Popup>
          { labels['map.marker.title'] }
        </Popup>
      </Marker>
    );
  }, [location]);

  // TODO: unharcode center and fix flickering

  return (
    <>
      <MapContainer
        center={[-34.9204509, -57.9944562]}
        zoom={13}
        scrollWheelZoom
        zoomControl={false}
        style={{ height: 500, width: '50%' }}
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
      {
        showTranslatedAddress && (
          <TextField
            aria-readonly
            value={readableAddress}
            sx={{
              mt: '2%',
              width: '30%',
            }}
          />
        )
      }
    </>
  );
});
