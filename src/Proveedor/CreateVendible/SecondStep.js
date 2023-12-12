/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState } from 'react';
import {
  Box,
  Button, Grid, ImageListItem, TextareaAutosize, Typography, styled,
} from '@mui/material';
import axios from 'axios';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { proveedorLabels } from '../../StaticData/Proveedor';
import { sharedLabels } from '../../StaticData/Shared';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

function SecondStep({ vendibleType, token }) {
  const [imageUrl, setImageUrl] = useState();
  const [imageError, setImageError] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      axios.post('http://localhost:8090/image/vendible/iPhone/proveedor/5/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'client-id': process.env.REACT_APP_CLIENT_ID,
          'client-secret': process.env.REACT_APP_CLIENT_SECRET,
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          setImageUrl(response.data);
          setImageError('');
          console.log(response.data);
        })
        .catch((error) => {
          setImageError(error.response.data.error);
          console.error('Error al subir la imagen', error);
        });
    } else {
      console.log('No se ha seleccionado ningún archivo.');
    }
  };

  return (
    <Grid
      item
      display="flex"
      flexDirection="row"
      xs={12}
    >
      <Grid
        item
        display="flex"
        flexDirection="column"
        xs={6}
      >
        <Typography variant="h4" sx={{ paddingLeft: '5%' }}>
          { proveedorLabels['addVendible.lastStep'] }
        </Typography>
        <Typography
          dangerouslySetInnerHTML={{
            __html: proveedorLabels['addVendible.image.text'].replace('{vendible}', vendibleType),
          }}
          textAlign="justify"
          sx={{ width: '50%', mt: '2%' }}
        />
        <Box>
          <ImageListItem
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '50%',
              mt: '5%',
            }}
          >
            {!!imageUrl && (
            <img
              src={imageUrl}
              srcSet={imageUrl}
              alt=""
              loading="lazy"
            />
            )}
            {
              !!imageError && (
                <Typography
                  variant="h6"
                  align="left"
                  color="red"
                >
                  { imageError }
                </Typography>
              )
            }
          </ImageListItem>
          <Box display="flex" flexDirection="column" sx={{ width: '20%' }}>
            <Button
              component="label"
              variant="contained"
              startIcon={<CloudUploadIcon />}
            >
              { sharedLabels.uploadImage }
              <VisuallyHiddenInput type="file" onChange={handleFileChange} />
            </Button>
          </Box>
        </Box>
      </Grid>
      <Grid
        item
        display="flex"
        flexDirection="column"
        xs={6}
      >
        <Typography variant="h4" sx={{ paddingRight: '5%' }}>
          { proveedorLabels['addVendible.description.title'].replace('{vendible}', vendibleType)}
        </Typography>
        <TextareaAutosize
          minRows={15}
          style={{ width: '80%' }}
          placeholder={proveedorLabels['addVendible.description.placeholder'].replace('{vendible}', vendibleType)}
        />
      </Grid>
    </Grid>
  );
}

export default SecondStep;
