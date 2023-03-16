import {
  useEffect, useState, useMemo,
  useCallback,
} from 'react';
import {
  MapContainer, TileLayer, Marker, Popup,
} from 'react-leaflet';
import withRouter from './HighOrderComponents/withRouter';
import { routes } from '../Constants';
import DialogModal from './DialogModal';
import { labels } from '../../StaticData/LocationMap';

export default withRouter(({ router: { navigate } }) => {
  const [location, setCurrentLocation] = useState();
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

  const handleGranted = (position) => {
    setCurrentLocation(position);
    setOpenPermissionDialog(false);
  };

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

  useEffect(() => {
    handlePermission();
  }, []);

  const LocationMarker = useMemo(() => (location ? (
    <Marker position={[location.coords.latitude, location.coords.longitude]}>
      <Popup>
        { labels['map.marker.title'] }
      </Popup>
    </Marker>
  ) : null), [location]);

  return (
    <MapContainer
      center={[-34.9204509, -57.9944562]}
      zoom={13}
      scrollWheelZoom
      style={{ height: 500, width: '50%' }}
    >
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
      { LocationMarker }
    </MapContainer>
  );
});
