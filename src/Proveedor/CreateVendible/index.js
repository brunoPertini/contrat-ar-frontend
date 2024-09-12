/* eslint-disable no-new-wrappers */
import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { sharedLabels } from '../../StaticData/Shared';
import FirstStep from './FirstStep';
import {
  PRICE_TYPE_FIXED,
  PRICE_TYPE_VARIABLE,
  PRODUCT_LOCATION_AT_HOME,
  PRODUCT_LOCATION_FIXED,
  SERVICE_LOCATION_AT_HOME,
  SERVICE_LOCATION_FIXED,
} from '../../Shared/Constants/System';
import { useOnLeavingTabHandler } from '../../Shared/Hooks/useOnLeavingTabHandler';
import SecondStep from './SecondStep';
import ConfirmationPage from './ConfirmationPage';
import { DOT_AND_COMMA_REGEX } from '../../Shared/Utils/InputUtils';
import { buildCategoryObject } from '../../Shared/Helpers/ProveedorHelper';
import BackdropLoader from '../../Shared/Components/BackdropLoader';
import { StaticAlert } from '../../Shared/Components';
import { proveedorLabels } from '../../StaticData/Proveedor';
import { parseVendibleUnit } from '../../Shared/Helpers/UtilsHelper';

function VendibleCreateForm({
  userInfo, vendibleType, handleUploadImage, handlePostVendible,
}) {
  const { token, location } = userInfo;

  const [nombre, setNombre] = useState('');

  const [vendibleLocation, setVendibleLocation] = useState(location);

  const [priceInfo, setPriceInfo] = useState({
    type: PRICE_TYPE_FIXED,
    amount: '',
  });

  const [stock, setStock] = useState('');

  const [locationTypes, setLocationTypes] = useState([]);

  const [categories, setCategories] = useState([]);

  const [imagenUrl, setImagenUrl] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const [activeStep, setActiveStep] = useState(0);

  // undefined = no result; false = something went wrong; true= all good
  const [operationResult, setOperationResult] = useState();

  const changeCurrentStep = (newStep) => {
    if (newStep === 3) {
      const category = buildCategoryObject(categories.reverse());
      const offersDelivery = locationTypes.includes(SERVICE_LOCATION_AT_HOME)
       || locationTypes.includes(PRODUCT_LOCATION_AT_HOME);
      const offersInCustomAddress = locationTypes.includes(SERVICE_LOCATION_FIXED)
       || locationTypes.includes(PRODUCT_LOCATION_FIXED);
      const proveedoresVendibles = [
        {
          category,
          descripcion,
          precio: new Number(priceInfo.amount.replace(DOT_AND_COMMA_REGEX, '')),
          tipoPrecio: priceInfo.type,
          imagenUrl,
          location: vendibleLocation,
          stock: new Number(stock.replace(DOT_AND_COMMA_REGEX, '')),
          offersDelivery,
          offersInCustomAddress,
        },
      ];

      handlePostVendible({
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
      alignItems: 'center',
    },
    spacing: activeStep === 0 ? 35 : 10,
  }), [activeStep]);

  const nexButtonLabel = useMemo(() => (activeStep === 0
    ? sharedLabels.next : sharedLabels.finish), [activeStep]);

  const areFirstCommonStepsValid = useMemo(() => {
    const isNombreValid = !!nombre;
    const areCategoriesValid = !!categories.length;
    const isPriceInfoValid = (priceInfo.type && priceInfo.amount)
      || (priceInfo.type === PRICE_TYPE_VARIABLE);

    return isNombreValid && areCategoriesValid && isPriceInfoValid;
  }, [nombre, categories, priceInfo]);

  const areSecondCommonStepsValid = useMemo(() => !!(imagenUrl)
  && !!(descripcion), [imagenUrl, descripcion]);

  const canGoStepForward = {
    0: {
      productos: useMemo(
        () => areFirstCommonStepsValid && !!(stock) && !!(locationTypes.length),
        [stock, areFirstCommonStepsValid, locationTypes],
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
        nombre={nombre}
        setNombre={setNombre}
        locationTypes={locationTypes}
        setLocationTypes={setLocationTypes}
        priceInfo={priceInfo}
        setPriceInfo={setPriceInfo}
        vendibleLocation={vendibleLocation}
        setVendibleLocation={setVendibleLocation}
        categories={categories}
        setCategories={setCategories}
        vendibleType={vendibleType}
        token={token}
        stock={stock}
        setStock={setStock}
      />),
    backButtonEnabled: false,
  },
  {
    component: <SecondStep
      vendibleType={vendibleType}
      token={token}
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
      vendibleType={vendibleType}
      vendibleInfo={{
        nombre,
        categories,
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

  useOnLeavingTabHandler();

  return (
    <Grid
      {...containerProps}
    >
      { steps[activeStep].component }
      {
          activeStep === 2 && (
            <StaticAlert
              styles={{ mt: '3%', fontSize: '1.1rem' }}
              severity="info"
              label={proveedorLabels['vendible.new.confirmation.disclaimer'].replace('{vendible}', parseVendibleUnit(vendibleType))}
            />
          )
        }
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

export default VendibleCreateForm;

VendibleCreateForm.propTypes = {
  userInfo: PropTypes.any.isRequired,
  vendibleType: PropTypes.string.isRequired,
  handleUploadImage: PropTypes.func.isRequired,
  handlePostVendible: PropTypes.func.isRequired,
};
