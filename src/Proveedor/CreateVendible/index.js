/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react/button-has-type */
import { useMemo, useState } from 'react';
import {
  Button, Grid,
} from '@mui/material';
import { sharedLabels } from '../../StaticData/Shared';
import FirstStep from './FirstStep';
import { PRICE_TYPE_VARIABLE } from '../../Shared/Constants/System';
import { useOnLeavingTabHandler } from '../../Shared/Hooks/useOnLeavingTabHandler';

function VendibleCreateForm({ userInfo, vendibleType }) {
  const { token, location } = userInfo;

  const [nombre, setNombre] = useState();

  const [vendibleLocation, setVendibleLocation] = useState(location);

  const [priceInfo, setPriceInfo] = useState({
    type: '',
    amount: null,
  });

  const [locationTypes, setLocationTypes] = useState([]);

  const [categories, setCategories] = useState([]);

  const [activeStep, setActiveStep] = useState(0);

  const [errorMessages, setErrorMessages] = useState({
    nombre: '',
    vendibleLocation: '',
    priceInfo: '',
    locationTypes: '',
    categories: '',
  });

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
    component: <></>,
    backButtonEnabled: false,
    nextButtonEnabled: false,
  }];

  useOnLeavingTabHandler();

  return (
    <Grid container flexDirection="column" spacing={35}>
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
          onClick={() => {}}
          sx={{
            mr: '5%',
          }}
          disabled={!steps[activeStep].backButtonEnabled}
        >
          {sharedLabels.back}
        </Button>
        <Button
          onClick={() => {}}
          disabled={!steps[activeStep].nextButtonEnabled}
        >
          {sharedLabels.next}
        </Button>
      </Grid>
    </Grid>
  );
}

export default VendibleCreateForm;

// eslint-disable-next-line no-lone-blocks
{ /* <div>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Subir Imagen</button>
      </div> */ }

// const handleFileChange = (event) => {
//   const file = event.target.files[0];
//   setSelectedFile(file);
// };

// const handleUpload = () => {
//   if (selectedFile) {
//     const formData = new FormData();
//     formData.append('file', selectedFile);

//     axios.post('http://localhost:8090/image/vendible/iPhone/proveedor/5/upload', formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//         'client-id': process.env.REACT_APP_CLIENT_ID,
//         'client-secret': process.env.REACT_APP_CLIENT_SECRET,
//         Authorization: `Bearer ${token}`,
//       },
//     })
//       .then((response) => {
//         // Manejar la respuesta del servidor
//         console.log(response.data);
//       })
//       .catch((error) => {
//         // Manejar errores
//         console.error('Error al subir la imagen', error);
//       });
//   } else {
//     console.log('No se ha seleccionado ningún archivo.');
//   }
// };
