/* eslint-disable no-unused-vars */
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
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import { errorMessages, sharedLabels } from '../../StaticData/Shared';
import LocationMap from '../Components/LocationMap';
import { systemConstants } from '../Constants';
import { DomUtils } from '../Utils';
import { cleanNumbersFromInput, stringIsEmail } from '../Utils/InputUtils';
import { signUpLabels } from '../../StaticData/SignUp';
import { signinLabels } from '../../StaticData/SignIn';
import { FORMAT_DMY, FORMAT_YMD, switchDateFormat } from './DatesHelper';
import { proveedorLabels } from '../../StaticData/Proveedor';

function TextFieldWithLabel(showInlineLabels, componentProps, label) {
  return (
    <>
      { showInlineLabels ? (
        // eslint-disable-next-line react/destructuring-assignment
        <InputLabel htmlFor={componentProps.id}>
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

  #validators;

  constructor() {
    this.fields = {};
    this.fieldsLabels = {};
    this.#validators = {};
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

  set validators(value) {
    this.#validators = value;
  }

  get validators() {
    return this.#validators;
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
      confirmPassword: '',
      birthDate: '',
      phone: '',
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

    this.validators = {
      email: (value) => stringIsEmail(value),
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
   * @param {Function} params.onChangeFields Function that runs after some field changes
   * @param {String} params.usuarioType CLIENTE or SERVICIOS or PRODUCTOS
   * @param {Object} params.inputProps Props to pass to inputs, as readOnly, etc.
   * @param {Object} params.gridStyles Styles applied to each field container
   * @param {Object} params.fieldsOwnConfig Same purpose as inputProps but per each field
   * @param {Boolean} params.showInlineLabels if should show labels inline with input
   * * @param {Boolean} params.showConfirmPasswordInput if should show confirm password input
   * @param {Object<String, Boolean>} params.errorFields fields with error, that should show
helper message
   *  per field key
   * @returns JSX rendered elements for the fields in fieldsValues
   */
  build({
    fieldsValues, errorFields, onChangeFields, usuarioType, gridStyles = {},
    inputProps, showInlineLabels = false, fieldsOwnConfig = {}, showConfirmPasswordInput,
  }) {
    super.build({ usuarioType });

    const baseBox = (component) => <Box {...gridStyles}>{component}</Box>;

    const commonInputStyles = {
      borderRadius: '10px',
      width: '100%',
    };

    const borderStyles = (hasError) => (!hasError ? { border: '2px solid rgb(36, 134, 164)' } : { });

    const nameRow = 'name' in fieldsValues ? baseBox(TextFieldWithLabel(showInlineLabels, {
      id: 'form-name',
      type: 'text',
      value: fieldsValues.name,
      onChange: (e) => onChangeFields('name', cleanNumbersFromInput(e.target.value)),
      sx: { ...commonInputStyles, ...borderStyles(!!(errorFields?.name)) },
      InputProps: 'name' in fieldsOwnConfig ? { ...fieldsOwnConfig.name } : undefined,
    }, sharedLabels.name)) : null;

    const surnameRow = 'surname' in fieldsValues ? baseBox(TextFieldWithLabel(showInlineLabels, {
      id: 'form-surname',
      type: 'text',
      value: fieldsValues.surname,
      onChange: (e) => onChangeFields('surname', cleanNumbersFromInput(e.target.value)),
      sx: { ...commonInputStyles, ...borderStyles(!!(errorFields?.surname)) },
      InputProps: 'surname' in fieldsOwnConfig ? { ...fieldsOwnConfig.surname } : undefined,
    }, sharedLabels.surname)) : null;

    const emailRow = 'email' in fieldsValues ? (
      baseBox(TextFieldWithLabel(showInlineLabels, {
        id: 'form-email',
        type: 'email',
        value: fieldsValues.email,
        inputProps,
        sx: { ...commonInputStyles, ...borderStyles(!!(errorFields?.email)) },
        onChange: (e) => {
          if (this.shouldValidateField('email')) {
            const isEmailValid = this.validators.email(fieldsValues.email);
            return onChangeFields('email', e.target.value, !isEmailValid);
          }

          return onChangeFields('email', e.target.value, false);
        },
        error: !!(errorFields?.email),
        helperText: (errorFields?.email) ? sharedLabels.invalidEmail : undefined,
        InputProps: 'email' in fieldsOwnConfig ? { ...fieldsOwnConfig.email } : undefined,
      }, sharedLabels.email))
    ) : null;

    const passwordRow = 'password' in fieldsValues ? (baseBox(TextFieldWithLabel(showInlineLabels, {
      id: 'form-password',
      type: 'password',
      value: fieldsValues.password,
      inputProps,
      sx: { ...commonInputStyles, ...borderStyles(!!(errorFields?.password)) },
      onChange: (e) => onChangeFields('password', e.target.value),
      InputProps: 'password' in fieldsOwnConfig ? { ...fieldsOwnConfig.password } : undefined,
      error: !!(errorFields?.password),
      helperText: (errorFields?.password) ? errorMessages.passwordsNotMatching : undefined,
    }, sharedLabels.password))) : null;

    const confirmPasswordInput = showConfirmPasswordInput ? (
      baseBox(TextFieldWithLabel(showInlineLabels, {
        id: 'form-confirm-password',
        type: 'password',
        value: fieldsValues.confirmPassword,
        inputProps,
        sx: { ...commonInputStyles, ...borderStyles(!!(errorFields?.confirmPassword)) },
        onChange: (e) => onChangeFields('confirmPassword', e.target.value),
        InputProps: 'confirmPassword' in fieldsOwnConfig ? { ...fieldsOwnConfig.confirmPassword } : undefined,
        error: !!(errorFields?.confirmPassword),
        helperText: (errorFields?.confirmPassword) ? errorMessages.passwordsNotMatching : undefined,
      }, sharedLabels.confirmPassword))) : null;

    const dniRow = this.shouldShowDni && 'dni' in fieldsValues ? (baseBox(TextFieldWithLabel(showInlineLabels, {
      id: 'form-dni',
      type: 'number',
      value: fieldsValues.dni,
      inputProps,
      sx: { ...commonInputStyles, ...borderStyles(!!(errorFields?.dni)) },
      onChange: (e) => onChangeFields('dni', e.target.value),
      InputProps: 'dni' in fieldsOwnConfig ? { ...fieldsOwnConfig.dni } : undefined,
    }, sharedLabels.dni))) : null;

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

      birthDateRow = baseBox(
        <>
          <Typography variant="subtitle1" align="left">
            { sharedLabels.birthDate }
          </Typography>
          <TextField
            id="form-birthDate"
            value={birthDateFinalValue}
            type="date"
            sx={{ ...commonInputStyles, ...borderStyles(!!(errorFields?.dni)) }}
            onChange={(e) => onChangeFields('birthDate', e.target.value)}
            {...('birthDate' in fieldsOwnConfig ? { InputProps: { ...fieldsOwnConfig.birthDate } } : {})}
            {...inputProps}
          />
        </>,
      );
    }

    const phoneRow = 'phone' in fieldsValues ? (baseBox(TextFieldWithLabel(showInlineLabels, {
      id: 'form-phone',
      type: 'number',
      value: fieldsValues.phone,
      inputProps,
      sx: { ...commonInputStyles, ...borderStyles(!!(errorFields?.dni)) },
      onChange: (e) => onChangeFields('phone', e.target.value),
      InputProps: 'phone' in fieldsOwnConfig ? { ...fieldsOwnConfig.phone } : undefined,
    }, sharedLabels.phone))) : null;

    const personalDataFields = [nameRow,
      surnameRow,
      birthDateRow,
      phoneRow,
      dniRow,
      emailRow,
      passwordRow,
      confirmPasswordInput,
    ];

    return personalDataFields;
  }

  shouldValidateField(fieldKey) {
    return fieldKey in this.validators;
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
      <Box
        display="flex"
        flexDirection="column"
        alignSelf="center"
        width={{ xs: '80%', md: '60%', xl: '40%' }}
      >
        <TextField
          id="form-email"
          value={emailValue}
          error={this.#hasError(errorFields, 'email')}
          label={sharedLabels.email}
          type="email"
          onChange={(e) => onChangeFields('email', e.target.value)}
          InputProps={{
            sx: {
              border: '1px solid rgb(36, 134, 164)',
              '&:focus-within': {
                border: '1px solid transparent',
                boxShadow: 'none',
              },
            },
          }}
        />
        <TextField
          id="form-password"
          value={passwordValue}
          error={this.#hasError(errorFields, 'password')}
          label={sharedLabels.password}
          type="password"
          onChange={(e) => onChangeFields('password', e.target.value)}
          sx={{ marginTop: '3%' }}
          InputProps={{
            sx: {
              border: '1px solid rgb(36, 134, 164)',
              '&:focus-within': {
                border: '1px solid transparent',
                boxShadow: 'none',
              },
            },
          }}
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
        <Grid item xs={12} sx={{ mt: '2%' }}>
          <Link href="#">
            { signinLabels.forgotPassword }
          </Link>
        </Grid>
      </Box>
    );

    return [row];
  }
}
