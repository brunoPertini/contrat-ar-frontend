/* eslint-disable no-undef */
/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import {
  Grid, TextField, Typography,
} from '@mui/material';
import {
  MapContainer, TileLayer, Marker, Popup,
} from 'react-leaflet';
import { sharedLabels } from '../../StaticData/Shared';

class FormBuilder {
  prepareForRender() {
    return this;
  }

  build() {
    return this;
  }
}

export class PersonalDataFormBuilder extends FormBuilder {
  prepareForRender() {
    const mapContainer = document.querySelector('#map');
    if (mapContainer) {
      mapContainer.remove();
    }
  }

  build() {
    const nameAndSurnameRow = () => (
      <Grid item xs={12}>
        <TextField
          id="outlined-controlled"
          label={sharedLabels.name}
          onChange={() => {}}
        />
        {' '}
        <TextField
          id="outlined-controlled"
          label={sharedLabels.surname}
          onChange={() => {}}
        />
      </Grid>
    );

    const emailAndPasswordRow = () => (
      <Grid item xs={12}>
        <TextField
          id="outlined-controlled"
          label={sharedLabels.email}
          type="email"
          onChange={() => {}}
        />
        {' '}
        <TextField
          id="outlined-controlled"
          label={sharedLabels.password}
          type="password"
          onChange={() => {}}
        />
      </Grid>
    );

    const birthDateRow = () => (
      <Grid item xs={12} sx={{ width: '31rem' }}>
        <Typography variant="subtitle1" align="left">
          { sharedLabels.birthDate }
        </Typography>
        <TextField
          id="outlined-controlled"
          type="date"
          sx={{ width: '100%' }}
          onChange={() => {}}
        />
      </Grid>
    );

    const personalDataFields = [nameAndSurnameRow, emailAndPasswordRow, birthDateRow];

    return personalDataFields;
  }
}

export class LocationFormBuilder extends FormBuilder {
  onLocationFormLoading() {
    const map = L.map('map').setView([51.505, -0.09], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
  }

  prepareForRender() {
    if (!document.querySelector('#map')) {
      const mapContainer = document.createElement('div');
      mapContainer.id = 'map';
      document.body.appendChild(mapContainer);
    }

    if (!document.querySelector('#leafletCSS')) {
      const mapCSS = document.createElement('link');
      mapCSS.id = 'leafletCSS';
      mapCSS.rel = 'stylesheet';
      mapCSS.href = 'https://unpkg.com/leaflet@1.9.3/dist/leaflet.css';
      mapCSS.integrity = 'sha256-kLaT2GOSpHechhsozzB+flnD+zUyjE2LlfWPgU04xyI=';
      mapCSS.crossOrigin = '';

      document.head.appendChild(mapCSS);
    }

    if (!document.querySelector('#leafletJS')) {
      const mapJS = document.createElement('script');
      mapJS.id = 'leafletJS';
      mapJS.src = 'https://unpkg.com/leaflet@1.9.3/dist/leaflet.js';
      mapJS.integrity = 'sha256-WBkoXOwTeyKclOHuWtc+i2uENFpDZ9YPdf5Hf+D7ewM=';
      mapJS.crossOrigin = '';
      document.body.prepend(mapJS);
    }

    this.onLocationFormLoading();
  }

  build() {
    return [
      () => (
        <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false} style={{ height: 500, width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[51.505, -0.09]}>
            <Popup>
              A pretty CSS3 popup.
              {' '}
              <br />
              {' '}
              Easily customizable.
            </Popup>
          </Marker>
        </MapContainer>
      ),
    ];
  }
}
