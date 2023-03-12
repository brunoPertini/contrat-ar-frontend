import { useEffect, useState, useMemo } from 'react';
import {
  MapContainer, TileLayer, Marker, Popup,
} from 'react-leaflet';

export default function LocationMap() {
  const [location, setCurrentLocation] = useState();

  const geoSettings = {
    enableHighAccuracy: true,
    maximumAge: 30000,
    timeout: 20000,
  };

  function preShowLocation(position) {
    setCurrentLocation(position);
  }

  function handlePermission() {
    navigator.permissions.query({ name: 'geolocation' }).then((result) => {
      if (result.state === 'granted') {
        console.log(result.state);
      } else if (result.state === 'prompt') {
        const position = navigator.geolocation.getCurrentPosition(
          preShowLocation,
          () => {},
          geoSettings,
        );
        console.log(position);
      } else if (result.state === 'denied') {
        // Manejar caso revoke, mostrar alerta con botones para volver a mostrar el alert de permisos o para directamente salir del registro
        console.log(result.state);
      }
    });
  }

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
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      { LocationMarker }
    </MapContainer>
  );
}
