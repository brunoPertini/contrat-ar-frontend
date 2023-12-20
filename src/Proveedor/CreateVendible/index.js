import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import {
  Button, Grid,
} from '@mui/material';
import { sharedLabels } from '../../StaticData/Shared';
import FirstStep from './FirstStep';
import { PRICE_TYPE_VARIABLE } from '../../Shared/Constants/System';
import { useOnLeavingTabHandler } from '../../Shared/Hooks/useOnLeavingTabHandler';
import SecondStep from './SecondStep';
import ConfirmationPage from './ConfirmationPage';

function VendibleCreateForm({ userInfo, vendibleType, handleUploadImage }) {
  const { token, location } = userInfo;

  const [nombre, setNombre] = useState('');

  const [vendibleLocation, setVendibleLocation] = useState(location);

  const [priceInfo, setPriceInfo] = useState({
    type: '',
    amount: '',
  });

  const [stock, setStock] = useState('');

  const [locationTypes, setLocationTypes] = useState([]);

  const [categories, setCategories] = useState([]);

  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');

  const [activeStep, setActiveStep] = useState(0);

  const changeCurrentStep = (newStep) => {
    if (newStep === 3) {
      return () => {};
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
    const areCategoriesValid = !!categories.length;
    const isPriceInfoValid = (priceInfo.type && priceInfo.amount)
      || (priceInfo.type === PRICE_TYPE_VARIABLE);

    return isNombreValid && areCategoriesValid && isPriceInfoValid;
  }, [nombre, categories, priceInfo]);

  const areSecondCommonStepsValid = useMemo(() => !!(imageUrl)
  && !!(description), [imageUrl, description]);

  const canGoStepForward = {
    0: {
      producto: useMemo(() => areFirstCommonStepsValid && !!(stock), [stock]),
      servicio: useMemo(() => {
        const isVendibleLocationValid = !!vendibleLocation.coordinates.length;
        const isLocationTypesValid = !!locationTypes.length;

        return areFirstCommonStepsValid && isVendibleLocationValid && isLocationTypesValid;
      }, [vendibleLocation, locationTypes]),
    },

    1: {
      producto: areSecondCommonStepsValid,
      servicio: areSecondCommonStepsValid,
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
    nextButtonEnabled: canGoStepForward[0][vendibleType],
  },
  {
    component: <SecondStep
      vendibleType={vendibleType}
      token={token}
      handleUploadImage={handleUploadImage}
      imageUrl={imageUrl}
      setImageUrl={setImageUrl}
      description={description}
      setDescription={setDescription}
    />,
    backButtonEnabled: true,
    nextButtonEnabled: canGoStepForward[1][vendibleType],
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
        imageUrl,
        description,
      }}
    />,
    backButtonEnabled: true,
    nextButtonEnabled: true,
  }];

  useOnLeavingTabHandler();

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
          disabled={!steps[activeStep].nextButtonEnabled}
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
};
