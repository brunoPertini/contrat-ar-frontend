/* eslint-disable no-new-wrappers */
import PropTypes from 'prop-types';
import {
  useContext, useMemo,
  useState,
} from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { sharedLabels } from '../../StaticData/Shared';
import {
  PRICE_TYPE_VARIABLE,
  PRODUCTS,
  PRODUCT_LOCATION_AT_HOME,
  PRODUCT_LOCATION_FIXED,
  SERVICES,
  SERVICE_LOCATION_AT_HOME,
  SERVICE_LOCATION_FIXED,
} from '../../Shared/Constants/System';
import { useOnLeavingTabHandler } from '../../Shared/Hooks/useOnLeavingTabHandler';
import { DOT_AND_COMMA_REGEX } from '../../Shared/Utils/InputUtils';
import { buildLocationTypesArray, buildPriceType } from '../../Shared/Helpers/ProveedorHelper';
import BackdropLoader from '../../Shared/Components/BackdropLoader';
import ConfirmationPage from '../CreateVendible/ConfirmationPage';
import SecondStep from '../CreateVendible/SecondStep';
import FirstStep from '../CreateVendible/FirstStep';
import { NavigationContext } from '../../State/Contexts/NavigationContext';
import { LocalStorageService } from '../../Infrastructure/Services/LocalStorageService';
import { vendibleInfoShape } from '../../Shared/PropTypes/Proveedor';

const localStorageService = new LocalStorageService();

function ModifyVendibleForm({
  userToken, vendibleInfo, vendibleType, handleUploadImage, handlePutVendible,
  showSaveChangesAlertModal, proveedorId,
}) {
  const [nombre, setNombre] = useState(vendibleInfo.vendibleNombre);

  const [vendibleLocation, setVendibleLocation] = useState(vendibleInfo.location);

  const [priceInfo, setPriceInfo] = useState({
    type: vendibleInfo.tipoPrecio,
    amount: vendibleInfo.precio,
  });

  const [stock, setStock] = useState(new String(vendibleInfo.stock));

  const [locationTypes, setLocationTypes] = useState(buildLocationTypesArray(
    vendibleInfo,
    vendibleType,
  ));

  const [imagenUrl, setImagenUrl] = useState(vendibleInfo.imagenUrl);
  const [descripcion, setDescripcion] = useState(vendibleInfo.descripcion);

  const [activeStep, setActiveStep] = useState(0);

  // undefined = no result; false = something went wrong; true= all good
  const [operationResult, setOperationResult] = useState();

  const { setHandleGoBack } = useContext(NavigationContext);

  setHandleGoBack(() => showSaveChangesAlertModal);

  const changeCurrentStep = (newStep) => {
    if (newStep === 3) {
      const offersDelivery = locationTypes.includes(SERVICE_LOCATION_AT_HOME)
      || locationTypes.includes(PRODUCT_LOCATION_AT_HOME);
      const offersInCustomAddress = locationTypes.includes(SERVICE_LOCATION_FIXED)
      || locationTypes.includes(PRODUCT_LOCATION_FIXED);

      const body = {
        descripcion,
        precio: new Number(priceInfo.amount.toString().replace(DOT_AND_COMMA_REGEX, '')),
        tipoPrecio: buildPriceType(priceInfo.type),
        imagenUrl,
        location: vendibleLocation,
        stock: new Number(stock.replace(DOT_AND_COMMA_REGEX, '')),
        offersDelivery,
        offersInCustomAddress,
      };

      handlePutVendible({
        proveedorId,
        vendibleId: vendibleInfo.vendibleId,
        body,

      }).then(() => {
        setOperationResult(true);
      }).catch(() => {
        setOperationResult(false);
      });
    }
    window.scrollTo({
      top: 0,
      left: 0,
    });
    return setActiveStep(newStep);
  };

  const containerProps = useMemo(() => ({
    container: true,
    flexDirection: 'column',
    sx: {
      minHeight: '100vh',
    },
    spacing: activeStep === 0 ? 35 : 10,
  }), [activeStep]);

  const nexButtonLabel = useMemo(() => (activeStep === 0
    ? sharedLabels.next : sharedLabels.finish), [activeStep]);

  const areFirstCommonStepsValid = useMemo(() => {
    const isNombreValid = !!nombre;
    const isPriceInfoValid = (priceInfo.type && priceInfo.amount)
      || (priceInfo.type === PRICE_TYPE_VARIABLE);

    return isNombreValid && isPriceInfoValid;
  }, [nombre, priceInfo]);

  const areSecondCommonStepsValid = useMemo(() => !!(imagenUrl)
  && !!(descripcion), [imagenUrl, descripcion]);

  const canGoStepForward = {
    0: {
      productos: useMemo(
        () => areFirstCommonStepsValid && !!(stock),
        [stock, areFirstCommonStepsValid],
      ),
      servicios: useMemo(() => {
        const isVendibleLocationValid = !!vendibleLocation.coordinates.length;
        const isLocationTypesValid = !!locationTypes.length;

        return areFirstCommonStepsValid && isVendibleLocationValid && isLocationTypesValid;
      }, [vendibleLocation, locationTypes, areFirstCommonStepsValid]),
    },

    1: {
      productos: areSecondCommonStepsValid,
      servicios: areSecondCommonStepsValid,
    },

    2: {
      productos: true,
      servicios: true,
    },

    3: {
      productos: true,
      servicios: true,
    },
  };

  const steps = [{
    component: (
      <FirstStep
        isEditionEnabled
        nombre={nombre}
        setNombre={setNombre}
        locationTypes={locationTypes}
        setLocationTypes={setLocationTypes}
        priceInfo={priceInfo}
        setPriceInfo={setPriceInfo}
        vendibleLocation={vendibleLocation}
        setVendibleLocation={setVendibleLocation}
        vendibleType={vendibleType}
        token={userToken}
        stock={stock}
        setStock={setStock}
      />),
    backButtonEnabled: false,
  },
  {
    component: <SecondStep
      isEditionEnabled
      vendibleType={vendibleType}
      token={userToken}
      handleUploadImage={handleUploadImage}
      imageUrl={imagenUrl}
      setImageUrl={setImagenUrl}
      description={descripcion}
      setDescription={setDescripcion}
    />,
    backButtonEnabled: true,
  },
  {
    component: <ConfirmationPage
      isEditionEnabled
      vendibleType={vendibleType}
      vendibleInfo={{
        nombre,
        priceInfo,
        stock,
        locationTypes,
        vendibleLocation,
        imagenUrl,
        descripcion,
      }}
      userToken={userToken}
    />,
    backButtonEnabled: true,
  },
  {
    component: <BackdropLoader open={activeStep === 3 && operationResult === undefined} />,
    backButtonEnabled: false,
  }];

  useOnLeavingTabHandler(() => localStorageService.removeItem(
    LocalStorageService.PAGES_KEYS.PROVEEDOR.PAGE_SCREEN,
  ));

  return (
    <Grid
      {...containerProps}
    >
      { steps[activeStep].component }
      <Grid
        item
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignSelf: 'center',
        }}
      >
        <Button
          variant="contained"
          onClick={() => changeCurrentStep(activeStep - 1)}
          sx={{
            mr: '5%',
          }}
          disabled={!steps[activeStep].backButtonEnabled}
        >
          {sharedLabels.back}
        </Button>
        <Button
          variant="contained"
          onClick={() => changeCurrentStep(activeStep + 1)}
          disabled={!canGoStepForward[activeStep][vendibleType]}
        >
          {nexButtonLabel}
        </Button>
      </Grid>
    </Grid>
  );
}

ModifyVendibleForm.propTypes = {
  userToken: PropTypes.string.isRequired,
  vendibleInfo: PropTypes.shape(vendibleInfoShape).isRequired,
  vendibleType: PropTypes.oneOf([PRODUCTS, SERVICES]).isRequired,
  handleUploadImage: PropTypes.func.isRequired,
  handlePutVendible: PropTypes.func.isRequired,
  showSaveChangesAlertModal: PropTypes.func.isRequired,
  proveedorId: PropTypes.string.isRequired,
};

export default ModifyVendibleForm;
