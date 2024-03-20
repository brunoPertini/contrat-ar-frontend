/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-new-wrappers */
import PropTypes from 'prop-types';
import {
  useCallback,
  useContext, useEffect, useMemo,
  useState,
} from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { sharedLabels } from '../../StaticData/Shared';
import {
  PRICE_TYPE_VARIABLE, PRODUCT,
  SERVICE_LOCATION_AT_HOME,
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

const localStorageService = new LocalStorageService();

function ModifyVendibleForm({
  userToken, vendibleInfo, vendibleType, handleUploadImage, handlePutVendible,
  showSaveChangesAlertModal,
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
      const isProduct = vendibleType === PRODUCT.toLowerCase();
      const proveedoresVendibles = [
        {
          descripcion,
          precio: new Number(priceInfo.amount.replace(DOT_AND_COMMA_REGEX, '')),
          tipoPrecio: buildPriceType(priceInfo.type),
          imagenUrl,
          location: vendibleLocation,
          stock: isProduct ? new Number(stock) : undefined,
          offersDelivery: !isProduct && locationTypes.includes(SERVICE_LOCATION_AT_HOME),
        },
      ];

      handlePutVendible({
        nombre,
        proveedoresVendibles,
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

  console.log(vendibleInfo);

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

export default ModifyVendibleForm;
