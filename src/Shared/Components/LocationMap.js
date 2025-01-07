/* eslint-disable prefer-arrow-callback */
import {
  useEffect, useState,
  useCallback, useMemo, memo,
} from 'react';
import PropTypes from 'prop-types';
import {
  MapContainer, TileLayer, Marker, Popup, ZoomControl, Circle,
} from 'react-leaflet';
import { HttpClientFactory } from '../../Infrastructure/HttpClientFactory';
import { usePreviousPropValue } from '../Hooks/usePreviousPropValue';
import { EMPTY_FUNCTION } from '../Constants/System';
import withErrorHandler from './HighOrderComponents/withErrorHandler';
import { locationShape } from '../PropTypes/Shared';

const arePropsEqual = (prevProps, nextProps) => (
  prevProps.location?.coords.latitude === nextProps.location?.coords.latitude
  && prevProps.location.coords.longitude === nextProps.location.coords.longitude
  && prevProps.enableDragEvents === nextProps.enableDragEvents);

/**
 * Map that requests current user location, shows it in a marker and translates it
 * in a human readable address.
 */
const LocationMap = memo(function LocationMap({
  location,
  setLocation,
  containerStyles,
  enableDragEvents,
  handleError,
  circleRadius,
  translateAddress: shouldTranslateAddress,
}) {
  const previousLocation = usePreviousPropValue(location);

  const [readableAddress, setReadableAddress] = useState('');

  const handleGranted = async (position) => {
    await setLocation({
      coords: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
    });
  };

  const mapCenter = useMemo(() => (location?.coords
    ? [location.coords.latitude, location.coords.longitude] : undefined), [location]);

  const translateAddress = useCallback(async (coordsObject) => {
    const { coords } = coordsObject ?? {};

    if (coords) {
      const httpClient = HttpClientFactory.createExternalHttpClient('', { });

      httpClient.getAddressFromLocation({
        latitude: coords.latitude,
        longitude: coords.longitude,
      }).then((readableAddressResponseData) => setReadableAddress(readableAddressResponseData))
        .catch((error) => handleError(error));
    }
  }, [HttpClientFactory]);

  useEffect(() => {
    const locationHasChanged = location?.coords && previousLocation?.coords
     && (location.coords.latitude !== previousLocation.coords.latitude
      && location.coords.longitude !== previousLocation.coords.longitude);

    if (shouldTranslateAddress && (!(previousLocation) || locationHasChanged)) {
      translateAddress(location);
    }
  }, [shouldTranslateAddress,
    location.coords.latitude,
    location.coords.longitude,
    previousLocation]);

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
        draggable={enableDragEvents}
      >

        { !!readableAddress && (
          <Popup>
            { readableAddress}
          </Popup>
        )}

      </Marker>
    );
  }, [location.coords.latitude, location.coords.longitude, readableAddress, enableDragEvents]);

  const CircleMarker = useCallback(() => (!circleRadius ? null : (
    <Circle
      center={{
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      }}
      radius={circleRadius}
    />
  )), [circleRadius]);

  return (
    <MapContainer
      center={mapCenter}
      zoom={13}
      scrollWheelZoom
      zoomControl={false}
      style={{ ...containerStyles }}
    >
      <ZoomControl position="bottomright" />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker />
      <CircleMarker />
    </MapContainer>
  );
}, arePropsEqual);

LocationMap.defaultProps = {
  containerStyles: {},
  setLocation: EMPTY_FUNCTION,
  enableDragEvents: true,
  translateAddress: true,
  circleRadius: 0,
};

LocationMap.propTypes = {
  location: locationShape.isRequired,
  setLocation: PropTypes.func,
  handleError: PropTypes.func.isRequired,
  containerStyles: PropTypes.objectOf(PropTypes.any),
  enableDragEvents: PropTypes.bool,
  translateAddress: PropTypes.bool,
  circleRadius: PropTypes.number,
};

export default withErrorHandler(LocationMap);
