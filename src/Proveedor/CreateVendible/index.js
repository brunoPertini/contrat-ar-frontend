import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
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
import StaticAlert from '../../Shared/Components/StaticAlert';
import { proveedorLabels } from '../../StaticData/Proveedor';
import { parseVendibleUnit } from '../../Shared/Helpers/UtilsHelper';
import GoBackLink from '../../Shared/Components/GoBackLink';
import Layout from '../../Shared/Components/Layout';

function VendibleCreateForm({
  userInfo, vendibleType, handleUploadImage, handlePostVendible,
}) {
  const { token, location } = userInfo;

  const [isLoading, setIsLoading] = useState(false);

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
      setIsLoading(true);
      const category = buildCategoryObject(categories.reverse());
      const offersDelivery = locationTypes.includes(SERVICE_LOCATION_AT_HOME)
       || locationTypes.includes(PRODUCT_LOCATION_AT_HOME);
      const offersInCustomAddress = locationTypes.includes(SERVICE_LOCATION_FIXED)
       || locationTypes.includes(PRODUCT_LOCATION_FIXED);
      const proveedoresVendibles = [
        {
          category,
          descripcion,
          precio: Number(priceInfo.amount.replace(DOT_AND_COMMA_REGEX, '')),
          tipoPrecio: priceInfo.type,
          imagenUrl,
          location: vendibleLocation,
          stock: Number(stock.replace(DOT_AND_COMMA_REGEX, '')),
          offersDelivery,
          offersInCustomAddress,
        },
      ];

      handlePostVendible({
        nombre,
        vendibleType,
        proveedoresVendibles,
      }).then(() => {
        setOperationResult(true);
      }).catch(() => {
        setOperationResult(false);
      }).finally(() => setIsLoading(false));
    }
    window.scrollTo({
      top: 0,
      left: 0,
    });
    return setActiveStep(newStep);
  };

  const containerProps = {
    display: 'flex',
    flexDirection: 'column',
    gap: { xs: 2, sm: 7 },
    sx: {
      alignItems: 'center',
    },
  };

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
    <Layout
      isLoading={isLoading}
      gridProps={{ ...containerProps }}
    >
      <GoBackLink styles={{ alignSelf: 'flex-start' }} />
      { steps[activeStep].component }
      {
          activeStep === 2 && (
            <StaticAlert
              styles={{ mt: '3%', fontSize: '1rem', width: '80%' }}
              severity="info"
              label={proveedorLabels['vendible.new.confirmation.disclaimer'].replace(
                '{vendible}',
                parseVendibleUnit(vendibleType),
              )}
            />
          )
        }
      <Box
        item
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignSelf: 'center',
          marginBottom: { xs: '1%', md: 0 },
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
      </Box>
    </Layout>
  );
}

export default VendibleCreateForm;

VendibleCreateForm.propTypes = {
  userInfo: PropTypes.any.isRequired,
  vendibleType: PropTypes.string.isRequired,
  handleUploadImage: PropTypes.func.isRequired,
  handlePostVendible: PropTypes.func.isRequired,
};
