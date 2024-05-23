/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-undef */
/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import InputLabel from '@mui/material/InputLabel';
import InfoIcon from '@mui/icons-material/Info';
import isEmpty from 'lodash/isEmpty';
import { sharedLabels } from '../../StaticData/Shared';
import LocationMap from '../Components/LocationMap';
import { systemConstants } from '../Constants';
import { DomUtils } from '../Utils';
import { cleanNumbersFromInput } from '../Utils/InputUtils';
import { signUpLabels } from '../../StaticData/SignUp';
import { signinLabels } from '../../StaticData/SignIn';
import { FORMAT_DMY, FORMAT_YMD, switchDateFormat } from './DatesHelper';
import { proveedorLabels } from '../../StaticData/Proveedor';

function TextFieldWithLabel(showInlineLabels, componentProps, label) {
  return (
    <>
      { showInlineLabels ? (
        <InputLabel>
          {' '}
          { label }
        </InputLabel>
      ) : null }

      <TextField
        {...componentProps}
        label={!showInlineLabels ? label : undefined}
      />
    </>
  );
}

class FormBuilder {
  #fields;

  #fieldsLabels;

  constructor() {
    this.fields = {};
  }

  prepareForRender() {
    return this;
  }

  build(props) {
    const { usuarioType } = props;
    const shouldShowDni = usuarioType && usuarioType !== systemConstants.USER_TYPE_CLIENTE;

    if (shouldShowDni) {
      this.fields.dni = '';
    }
    this.shouldShowDni = shouldShowDni;
    this.usuarioType = usuarioType;

    return this;
  }

  set fields(value) {
    this.#fields = value;
  }

  get fields() {
    return this.#fields;
  }

  set fieldsLabels(value) {
    this.#fieldsLabels = value;
  }

  get fieldsLabels() {
    return this.#fieldsLabels;
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

    this.fieldsLabels = {
      name: sharedLabels.name,
      surname: sharedLabels.surname,
      email: sharedLabels.email,
      password: sharedLabels.password,
      birthDate: sharedLabels.birthDate,
      phone: sharedLabels.phone,
      location: sharedLabels.yourLocation,
      dni: sharedLabels.dni,
      fotoPerfilUrl: proveedorLabels.yourProfilePhoto,
    };
  }

  /**
   * @typedef UserFormModel
     @property {String}name,
     @property {String}surname,
     @property {String}email,
     @property {String} birthDate,
     @property {{Number[]}} location,
     @property {String} phone,
     @property {String} password
  }
   */

  /**
   * @param {Object} params
   * @param {UserFormModel} params.fieldsValues Holder object that controls fields values
   * @param {Function} params.onChangeFields function that runs after some field changes
   * @param {String} params.usuarioType CLIENTE or SERVICIOS or PRODUCTOS
   * @param {Object} params.inputProps props to pass to inputs, as readOnly, etc.
   * @param {Object} params.gridStyles styles applied to each field container
   * @param {Object} params.fieldsOwnConfig same purpose as inputProps but differentiating
   *  per field key
   * @returns JSX rendered elements for the fields in fieldsValues
   */
  build({
    fieldsValues, onChangeFields, usuarioType, gridStyles = {},
    inputProps, showInlineLabels = false, fieldsOwnConfig = {},
  }) {
    super.build({ usuarioType });

    const finalStyles = isEmpty(gridStyles) ? { xs: 12 } : { ...gridStyles };

    const renderNameRow = 'name' in fieldsValues && 'surname' in fieldsValues;

    const nameAndSurnameRow = renderNameRow ? (
      <Grid item {...finalStyles}>
        {TextFieldWithLabel(showInlineLabels, {
          id: 'form-name',
          type: 'text',
          value: fieldsValues.name,
          onChange: (e) => onChangeFields('name', cleanNumbersFromInput(e.target.value)),
          InputProps: 'name' in fieldsOwnConfig ? { ...fieldsOwnConfig.name } : undefined,
        }, sharedLabels.name) }
        {' '}
        {TextFieldWithLabel(showInlineLabels, {
          id: 'form-surname',
          type: 'text',
          value: fieldsValues.surname,
          onChange: (e) => onChangeFields('surname', cleanNumbersFromInput(e.target.value)),
          InputProps: 'surname' in fieldsOwnConfig ? { ...fieldsOwnConfig.surname } : undefined,
        }, sharedLabels.surname) }
      </Grid>
    ) : null;

    const rendeEmailRow = 'email' in fieldsValues && 'password' in fieldsValues;

    const emailAndPasswordRow = rendeEmailRow ? (
      <Grid item {...finalStyles}>
        {TextFieldWithLabel(showInlineLabels, {
          id: 'form-email',
          type: 'email',
          value: fieldsValues.email,
          inputProps,
          onChange: (e) => onChangeFields('email', e.target.value),
        }, sharedLabels.email)}
        {' '}
        {TextFieldWithLabel(showInlineLabels, {
          id: 'form-password',
          type: 'password',
          value: fieldsValues.password,
          inputProps,
          onChange: (e) => onChangeFields('password', e.target.value),
        }, sharedLabels.password)}
      </Grid>
    ) : null;

    const dniRow = this.shouldShowDni && 'dni' in fieldsValues ? (
      <Grid item xs={12} sx={{ width: '31rem' }}>
        <Typography variant="subtitle1" align="left">
          { sharedLabels.dni }
        </Typography>
        <TextField
          id="form-dni"
          value={fieldsValues.dni}
          type="number"
          sx={{ width: '100%' }}
          onChange={(e) => onChangeFields('dni', e.target.value)}
          {...('dni' in fieldsOwnConfig ? { InputProps: { ...fieldsOwnConfig.dni } } : {})}
        />
      </Grid>
    ) : null;

    let birthDateRow = null;

    if ('birthDate' in fieldsValues) {
      const shouldDateBeFormatted = fieldsValues.birthDate.includes('/');

      const birthDateFinalValue = shouldDateBeFormatted
        ? switchDateFormat({
          date: fieldsValues.birthDate,
          inputFormat: FORMAT_DMY,
          outputFormat: FORMAT_YMD,
        })
        : fieldsValues.birthDate;

      birthDateRow = (
        <Grid item xs={12} sx={{ width: '31rem' }}>
          <Typography variant="subtitle1" align="left">
            { sharedLabels.birthDate }
          </Typography>
          <TextField
            id="form-birthDate"
            value={birthDateFinalValue}
            type="date"
            sx={{ width: '100%' }}
            onChange={(e) => onChangeFields('birthDate', e.target.value)}
            {...('birthDate' in fieldsOwnConfig ? { InputProps: { ...fieldsOwnConfig.birthDate } } : {})}
            {...inputProps}
          />
        </Grid>
      );
    }

    const phoneRow = 'phone' in fieldsValues ? (
      <Grid item xs={12} sx={{ width: '31rem' }}>
        <Typography variant="subtitle1" align="left">
          { sharedLabels.phone }
        </Typography>
        <TextField
          id="form-phone"
          value={fieldsValues.phone}
          type="number"
          sx={{ width: '100%' }}
          onChange={(e) => onChangeFields('phone', e.target.value)}
        />
      </Grid>
    ) : null;

    const personalDataFields = [nameAndSurnameRow,
      emailAndPasswordRow,
      dniRow, birthDateRow,
      phoneRow];

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

  getTitle() {
    const { usuarioType } = this;

    return (
      <>
        {usuarioType
         && usuarioType !== systemConstants.USER_TYPE_CLIENTE
          ? signUpLabels['location.proveedor.title'] : signUpLabels['location.cliente.title']}
        <Tooltip
          title={(
            <Typography variant="h6">
              {signUpLabels['title.disclaimer']}
            </Typography>
            )}
          placement="right-start"
        >
          <IconButton>
            <InfoIcon />
          </IconButton>
        </Tooltip>
      </>
    );
  }

  build(props) {
    super.build(props);
    return [<LocationMap {...props} />];
  }
}

export class SignInFormBuilder extends FormBuilder {
  constructor() {
    super();
    this.fields = {
      email: '',
      password: '',
    };
  }

  #hasError(errorFields, field) {
    return errorFields.includes(field);
  }

  build({
    onButtonClick, onChangeFields, fieldsValues = {}, errorFields = [], errorMessage,
  }) {
    const emailValue = fieldsValues.email || this.fields.email;
    const passwordValue = fieldsValues.password || this.fields.password;

    const row = (
      <>
        <Grid item xs={12} sx={{ width: '30%' }}>
          <TextField
            id="form-email"
            value={emailValue}
            error={this.#hasError(errorFields, 'email')}
            label={sharedLabels.email}
            type="email"
            onChange={(e) => onChangeFields('email', e.target.value)}
            sx={{ width: '100%' }}
          />
        </Grid>
        <Grid item xs={12} sx={{ width: '30%' }}>
          <TextField
            id="form-password"
            value={passwordValue}
            error={this.#hasError(errorFields, 'password')}
            label={sharedLabels.password}
            type="password"
            onChange={(e) => onChangeFields('password', e.target.value)}
            sx={{ width: '100%' }}
          />
          {
            !!errorMessage && (
            <Typography
              variant="h6"
              align="left"
              color="red"
              sx={{ marginTop: '15px' }}
            >
              { errorMessage }
            </Typography>
            )
          }
          <Button
            variant="contained"
            sx={{ marginTop: '15px' }}
            onClick={onButtonClick}
          >
            { signinLabels.buttonLabel }
          </Button>
        </Grid>
        <Grid item xs={12} sx={{ width: '30%' }}>
          <Link href="#">
            { signinLabels.forgotPassword }
          </Link>
        </Grid>

      </>
    );

    return [row];
  }
}
