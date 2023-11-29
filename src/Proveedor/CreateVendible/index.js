/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react/button-has-type */
import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import {
  Box, Button, Grid, Link, TextField, Typography,
} from '@mui/material';
import {
  CheckBoxGroup, Layout, LocationMap, Select,
} from '../../Shared/Components';
import { proveedorLabels } from '../../StaticData/Proveedor';
import Searcher from '../../Shared/Components/Searcher';
import CategoryInput from './CategoryInput';
import { sharedLabels } from '../../StaticData/Shared';
import {
  PRICE_TYPE_FIXED, PRICE_TYPE_VARIABLE, PRICE_TYPE_VARIABLE_WITH_AMOUNT,
  PRODUCT, SERVICE, SERVICE_LOCATION_AT_HOME, SERVICE_LOCATION_FIXED,
} from '../../Shared/Constants/System';
import { stringHasOnlyNumbers } from '../../Shared/Utils/InputUtils';

const pricesTypeMock = [PRICE_TYPE_FIXED, PRICE_TYPE_VARIABLE, PRICE_TYPE_VARIABLE_WITH_AMOUNT];

const serviceLocationsMock = [SERVICE_LOCATION_AT_HOME, SERVICE_LOCATION_FIXED];

function VendibleCreateForm({ userInfo, vendibleType }) {
  const { token, location } = userInfo;

  const [nombre, setNombre] = useState();
  const [selectedFile, setSelectedFile] = useState(null);

  const [vendibleLocation, setVendibleLocation] = useState(location);

  const [priceInfo, setPriceInfo] = useState({
    type: '',
    amount: null,
  });

  const [locationTypes, setLocationTypes] = useState();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append('file', selectedFile);

      axios.post('http://localhost:8090/image/vendible/iPhone/proveedor/5/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'client-id': process.env.REACT_APP_CLIENT_ID,
          'client-secret': process.env.REACT_APP_CLIENT_SECRET,
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          // Manejar la respuesta del servidor
          console.log(response.data);
        })
        .catch((error) => {
          // Manejar errores
          console.error('Error al subir la imagen', error);
        });
    } else {
      console.log('No se ha seleccionado ningún archivo.');
    }
  };

  const handleSetLoation = ({ coords }) => {
    const newCoordinates = {
      coordinates: [coords.latitude, coords.longitude],
    };
    setVendibleLocation(newCoordinates);
  };

  const onChangePriceInfo = ({ priceAmount, priceType }) => {
    setPriceInfo((currentPriceInfo) => ({
      ...currentPriceInfo,
      type: priceType || currentPriceInfo.type,
      amount: priceAmount || currentPriceInfo.amount,
    }));
  };

  const showPriceInput = useMemo(() => {
    const { type } = priceInfo;
    return type && (type === PRICE_TYPE_FIXED || type === PRICE_TYPE_VARIABLE_WITH_AMOUNT);
  }, [priceInfo]);

  const gridConfig = {
    producto: {
      xs: [6, 6],
      showLocationColumn: false,
    },

    servicio: {
      xs: [4, 8],
      showLocationColumn: true,
    },
  };

  return (
    <Grid container flexDirection="column" spacing={35}>
      <Grid item display="flex" flexDirection="row">
        <Grid item flexDirection="column" spacing={5} xs={gridConfig[vendibleType].xs[0]}>
          <Grid item>
            <Searcher
              title={(
                <Typography variant="h4">
                  {proveedorLabels.nameOfYourVendible.replace('{vendible}', vendibleType)}
                </Typography>
            )}
              placeholder={proveedorLabels['addVendible.name.text'].replace('{vendible}', vendibleType)}
              searcherConfig={{
                sx: {
                  width: '50%',
                },
              }}
              inputValue={nombre}
              keyEvents={{ onKeyUp: setNombre }}
            />
          </Grid>
          <Grid item sx={{ mt: '5%' }}>
            <Typography variant="h4">
              {proveedorLabels['addVendible.category.title'].replace('{vendible}', vendibleType)}
            </Typography>
            <Typography
              dangerouslySetInnerHTML={{
                __html: proveedorLabels['addVendible.category.text'].replace('{vendible}', vendibleType),
              }}
              textAlign="justify"
              sx={{ paddingRight: '5px', width: '70%' }}
            />
            <CategoryInput />
          </Grid>
        </Grid>
        <Grid item flexDirection="column" xs={gridConfig[vendibleType].xs[1]}>
          <Typography variant="h4">
            {sharedLabels.price}
          </Typography>
          <Typography
            dangerouslySetInnerHTML={{
              __html: proveedorLabels['addVendible.price.text'].replace(/{vendible}/ig, vendibleType),
            }}
            textAlign="justify"
            sx={{ paddingRight: '5px', width: '70%' }}
          />
          <Select
            containerStyles={{ mt: '2%', width: '50%' }}
            label={sharedLabels.priceType}
            values={pricesTypeMock}
            handleOnChange={(value) => onChangePriceInfo({ priceType: value })}
          />
          {showPriceInput && (
          <TextField
            sx={{ mt: '2%' }}
            autoFocus
            type="text"
            label="Precio"
            onChange={(value) => {
              if (stringHasOnlyNumbers(value)) {
                onChangePriceInfo({ priceAmount: value });
              }
            }}
            value={priceInfo.amount}
          />
          )}
          {gridConfig[vendibleType].showLocationColumn && (
          <>
            <Typography sx={{ mt: '5%' }}>
              {proveedorLabels['addVendible.location.text']}
            </Typography>
            <CheckBoxGroup
              elements={serviceLocationsMock}
              handleChange={setLocationTypes}
            />
            <Box display="flex" flexDirection="column">
              <Typography
                dangerouslySetInnerHTML={{
                  __html: proveedorLabels['addVendible.location.disclaimer'],
                }}
                textAlign="justify"
                sx={{ paddingRight: '5px', width: '70%' }}
              />
            </Box>
            <LocationMap
              showTranslatedAddress
              location={{
                coords: {
                  latitude: vendibleLocation.coordinates[0],
                  longitude: vendibleLocation.coordinates[1],
                },
              }}
              setLocation={handleSetLoation}
              containerStyles={{
                width: '50%',
                height: '50%',
              }}
              token={token}
            />

          </>
          )}
        </Grid>
      </Grid>
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
        >
          {sharedLabels.back}
        </Button>
        <Button
          onClick={() => {}}
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
