/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react/button-has-type */
import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { Grid, TextField, Typography } from '@mui/material';
import { Layout, Select } from '../../Shared/Components';
import { proveedorLabels } from '../../StaticData/Proveedor';
import Searcher from '../../Shared/Components/Searcher';
import CategoryInput from './CategoryInput';
import { sharedLabels } from '../../StaticData/Shared';
import { PRICE_TYPE_FIXED, PRICE_TYPE_VARIABLE, PRICE_TYPE_VARIABLE_WITH_AMOUNT } from '../../Shared/Constants/System';
import { stringHasOnlyNumbers } from '../../Shared/Utils/InputUtils';

const pricesTypeMock = [PRICE_TYPE_FIXED, PRICE_TYPE_VARIABLE, PRICE_TYPE_VARIABLE_WITH_AMOUNT];

function VendibleCreateForm({ userInfo, vendibleType }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [priceInfo, setPriceInfo] = useState({
    type: '',
    amount: null,
  });

  const { token } = userInfo;

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

  return (
    <Layout gridProps={{
      container: true,
      flexDirection: 'row',
    }}
    >
      <Grid item flexDirection="column" spacing={5} xs={5}>
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
      <Grid item flexDirection="column" justifyContent="space-between" xs={3}>
        <Typography variant="h4">
          { sharedLabels.price }
        </Typography>
        <Typography
          dangerouslySetInnerHTML={{
            __html: proveedorLabels['addVendible.price.text'].replace(/{vendible}/ig, vendibleType),
          }}
          textAlign="justify"
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
      <Grid item flexDirection="column" xs={4}>
        <Typography>
          fdsfsdsdffdsfds
        </Typography>
      </Grid>
    </Layout>
  );
}

export default VendibleCreateForm;

// eslint-disable-next-line no-lone-blocks
{ /* <div>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Subir Imagen</button>
      </div> */ }
