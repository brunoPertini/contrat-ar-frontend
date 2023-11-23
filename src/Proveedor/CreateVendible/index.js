/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react/button-has-type */
import axios from 'axios';
import { useState } from 'react';
import { Grid, Typography } from '@mui/material';
import { Layout } from '../../Shared/Components';
import { proveedorLabels } from '../../StaticData/Proveedor';
import Searcher from '../../Shared/Components/Searcher';
import CategoryInput from './CategoryInput';

function VendibleCreateForm({ userInfo, vendibleType }) {
  const [selectedFile, setSelectedFile] = useState(null);

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

  return (
    <Layout gridProps={{
      container: true,
      flexDirection: 'row',
    }}
    >
      <Grid container flexDirection="column" spacing={5} xs={5}>
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
              'white-space': 'pre',
            }}
          />
          <CategoryInput />
        </Grid>
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
