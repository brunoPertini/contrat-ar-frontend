/* eslint-disable no-unused-vars */
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

function VendibleCreateForm({ userInfo, vendibleType, handleUploadImage }) {
  const { token, location } = userInfo;

  const [nombre, setNombre] = useState('');

  const [vendibleLocation, setVendibleLocation] = useState(location);

  const [priceInfo, setPriceInfo] = useState({
    type: '',
    amount: null,
  });

  const [locationTypes, setLocationTypes] = useState([]);

  const [categories, setCategories] = useState([]);

  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');

  const [activeStep, setActiveStep] = useState(0);

  const [errorMessages, setErrorMessages] = useState({
    nombre: '',
    vendibleLocation: '',
    priceInfo: '',
    locationTypes: '',
    categories: '',
  });

  const changeCurrentStep = (newStep) => {
    window.scrollTo({
      top: 0,
      left: 0,
    });
    setActiveStep(newStep);
  };

  const nexButtonLabel = useMemo(() => (activeStep !== 1
    ? sharedLabels.next : sharedLabels.finish), [activeStep]);

  const canGoStepForward = {
    0: useMemo(() => {
      const isNombreValid = !!nombre;
      const isVendibleLocationValid = !!vendibleLocation.coordinates.length;
      const isPriceInfoValid = (priceInfo.type && priceInfo.amount)
      || (priceInfo.type === PRICE_TYPE_VARIABLE);
      const isLocationTypesValid = !!locationTypes.length;
      const isCategoriesValid = !!categories.length;

      return isNombreValid
       && isVendibleLocationValid
       && isPriceInfoValid && isLocationTypesValid && isCategoriesValid;
    }, [nombre, vendibleLocation, priceInfo, locationTypes, categories]),

    1: useMemo(() => !!(imageUrl) && !!(description), [imageUrl, description]),
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
      />),
    backButtonEnabled: false,
    nextButtonEnabled: canGoStepForward[0],
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
    nextButtonEnabled: true,
  }];

  useOnLeavingTabHandler();

  return (
    <Grid
      container
      flexDirection="column"
      sx={{
        minHeight: '100vh',
      }}
      spacing={30}
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
