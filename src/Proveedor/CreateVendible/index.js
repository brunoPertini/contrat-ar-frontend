/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react/button-has-type */
import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { Grid, TextField, Typography } from '@mui/material';
import { Layout, LocationMap, Select } from '../../Shared/Components';
import { proveedorLabels } from '../../StaticData/Proveedor';
import Searcher from '../../Shared/Components/Searcher';
import CategoryInput from './CategoryInput';
import { sharedLabels } from '../../StaticData/Shared';
import {
  PRICE_TYPE_FIXED, PRICE_TYPE_VARIABLE, PRICE_TYPE_VARIABLE_WITH_AMOUNT, PRODUCT, SERVICE,
} from '../../Shared/Constants/System';
import { stringHasOnlyNumbers } from '../../Shared/Utils/InputUtils';

const pricesTypeMock = [PRICE_TYPE_FIXED, PRICE_TYPE_VARIABLE, PRICE_TYPE_VARIABLE_WITH_AMOUNT];

function VendibleCreateForm({ userInfo, vendibleType }) {
  const { token, location } = userInfo;

  const [selectedFile, setSelectedFile] = useState(null);

  const [vendibleLocation, setVendibleLocation] = useState(location);
  const [readableAddress, setReadableAddress] = useState('');

  const [priceInfo, setPriceInfo] = useState({
    type: '',
    amount: null,
  });

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
      xs: [5, 3, 4],
      showLocationColumn: true,
    },
  };

  return (
    <Layout gridProps={{
      container: true,
      flexDirection: 'row',
    }}
    >
      <Grid item flexDirection="column" spacing={5} xs={gridConfig[vendibleType].xs[0]}>
        <Grid item>
          <Searcher
            title={(
              <Typography variant="h4">
                { proveedorLabels.nameOfYourVendible.replace('{vendible}', vendibleType)}
              </Typography>
            )}
            placeholder={proveedorLabels['addVendible.name.text'].replace('{vendible}', vendibleType)}
            searcherConfig={{
              sx: {
                width: '50%',
              },
            }}
          />
        </Grid>
        <Grid item>
          <Typography variant="h4">
            { proveedorLabels['addVendible.category.title'].replace('{vendible}', vendibleType)}
          </Typography>
          <Typography
            dangerouslySetInnerHTML={{
              __html: proveedorLabels['addVendible.category.text'].replace('{vendible}', vendibleType),
            }}
            sx={{
              whiteSpace: 'pre',
            }}
          />
          <CategoryInput />
        </Grid>
      </Grid>
      <Grid item flexDirection="column" justifyContent="space-between" xs={gridConfig[vendibleType].xs[1]}>
        <Typography variant="h4">
          { sharedLabels.price }
        </Typography>
        <Typography
          dangerouslySetInnerHTML={{
            __html: proveedorLabels['addVendible.price.text'].replace(/{vendible}/ig, vendibleType),
          }}
          textAlign="justify"
          sx={{ paddingRight: '5px' }}
        />
        <Select
          containerStyles={{ mt: '5%' }}
          label="Tipo de precio"
          values={pricesTypeMock}
          handleOnChange={(value) => onChangePriceInfo({ priceType: value })}
        />
        {
          showPriceInput && (
            <TextField
              sx={{ mt: '5%' }}
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
          )
        }
      </Grid>
      {
        gridConfig[vendibleType].showLocationColumn && (
          <Grid item flexDirection="column" xs={gridConfig[vendibleType].xs[2]}>
            <LocationMap
              showTranslatedAddress
              location={{
                coords: {
                  latitude: vendibleLocation.coordinates[0],
                  longitude: vendibleLocation.coordinates[1],
                },
              }}
              setLocation={setVendibleLocation}
              readableAddress={readableAddress}
              setReadableAddress={setReadableAddress}
            />
          </Grid>
        )
      }
    </Layout>
  );
}

export default VendibleCreateForm;

// eslint-disable-next-line no-lone-blocks
{ /* <div>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Subir Imagen</button>
      </div> */ }
