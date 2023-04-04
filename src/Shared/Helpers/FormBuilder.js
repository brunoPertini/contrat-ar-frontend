/* eslint-disable no-undef */
/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import {
  Grid, TextField, Typography,
} from '@mui/material';
import { sharedLabels } from '../../StaticData/Shared';
import { LocationMap } from '../Components';
import { DomUtils } from '../Utils';
import { cleanNumbersFromInput } from '../Utils/InputUtils';

class FormBuilder {
  #fields;

  constructor() {
    this.fields = {};
  }

  prepareForRender() {
    return this;
  }

  build() {
    return this;
  }

  set fields(value) {
    this.#fields = value;
  }

  get fields() {
    return this.#fields;
  }
}

export class PersonalDataFormBuilder extends FormBuilder {
  constructor() {
    super();
    this.fields = {
      name: '',
      surname: '',
      email: '',
      password: '',
      birthDate: '',
    };
  }

  // eslint-disable-next-line no-unused-vars
  build({ fieldsValues, onChangeFields }) {
    const nameAndSurnameRow = (
      <Grid item xs={12}>
        <TextField
          id="form-name"
          type="text"
          value={fieldsValues.name}
          label={sharedLabels.name}
          onChange={(e) => onChangeFields('name', cleanNumbersFromInput(e.target.value))}
        />
        {' '}
        <TextField
          id="form-surname"
          type="text"
          value={fieldsValues.surname}
          label={sharedLabels.surname}
          onChange={(e) => onChangeFields('surname', cleanNumbersFromInput(e.target.value))}
        />
      </Grid>
    );

    const emailAndPasswordRow = (
      <Grid item xs={12}>
        <TextField
          id="form-email"
          value={fieldsValues.email}
          label={sharedLabels.email}
          type="email"
          onChange={(e) => onChangeFields('email', e.target.value)}
        />
        {' '}
        <TextField
          id="form-password"
          value={fieldsValues.password}
          label={sharedLabels.password}
          type="password"
          onChange={(e) => onChangeFields('password', e.target.value)}
        />
      </Grid>
    );

    const birthDateRow = (
      <Grid item xs={12} sx={{ width: '31rem' }}>
        <Typography variant="subtitle1" align="left">
          { sharedLabels.birthDate }
        </Typography>
        <TextField
          id="form-birthDate"
          value={fieldsValues.birthDate}
          type="date"
          sx={{ width: '100%' }}
          onChange={(e) => onChangeFields('birthDate', e.target.value)}
        />
      </Grid>
    );

    const personalDataFields = [nameAndSurnameRow, emailAndPasswordRow, birthDateRow];

    return personalDataFields;
  }
}

export class LocationFormBuilder extends FormBuilder {
  onLocationFormLoading() {
    if (!document.querySelector('#map')) {
      const map = L.map('map').setView([51.505, -0.09], 13);

      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);
    }
  }

  prepareForRender() {
    if (!document.querySelector('#map')) {
      DomUtils.createDomElement('div', 'body', { id: 'map' });

      DomUtils.createDomElement(
        'script',
        'body',
        {
          id: 'leafletJS',
          src: 'https://unpkg.com/leaflet@1.9.3/dist/leaflet.js',
          integrity: 'sha256-WBkoXOwTeyKclOHuWtc+i2uENFpDZ9YPdf5Hf+D7ewM=',
          crossOrigin: '',
        },
      );

      this.onLocationFormLoading();
    }
  }

  build(props) {
    return [<LocationMap {...props} />];
  }
}
