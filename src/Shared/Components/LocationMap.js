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

export default withRouter(({ router: { navigate } }) => {
  const [location, setCurrentLocation] = useState();
  const [openPermissionDialog, setOpenPermissionDialog] = useState();

  const geoSettings = {
    enableHighAccuracy: true,
    maximumAge: 30000,
    timeout: 20000,
  };

  function handleGranted(position) {
    setCurrentLocation(position);
  }

  function handleDenied() {
    setOpenPermissionDialog(true);
  }

  const handlePermission = useCallback(() => {
    navigator.permissions.query({ name: 'geolocation' }).then((result) => {
      if (result.state === 'prompt') {
        navigator.geolocation.getCurrentPosition(
          handleGranted,
          handleDenied,
          geoSettings,
        );
      }
    });
  }, [handleGranted, handleDenied]);

  const handleDialogDenied = useCallback(() => {
    navigate(routes.index);
  }, [navigate]);

  useEffect(() => {
    handlePermission();
  }, []);

  const LocationMarker = useMemo(() => (location ? (
    <Marker position={[location.coords.latitude, location.coords.longitude]}>
      <Popup>
        Esta es su ubicación estimada
      </Popup>
    </Marker>
  ) : null), [location]);

  return (
    <MapContainer
      center={[-34.9204509, -57.9944562]}
      zoom={13}
      scrollWheelZoom={false}
      style={{ height: 500, width: '50%' }}
    >
      <DialogModal
        open={openPermissionDialog}
        handleAccept={handlePermission}
        handleDeny={() => handleDialogDenied()}
      />
      ;
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      { LocationMarker }
    </MapContainer>
  );
});
