import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import ImageListItem from '@mui/material/ImageListItem';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import Typography from '@mui/material/Typography';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { proveedorLabels } from '../../StaticData/Proveedor';
import { sharedLabels } from '../../StaticData/Shared';
import { maxLengthConstraints } from '../../Shared/Constants/InputConstraints';
import { parseVendibleUnit } from '../../Shared/Helpers/UtilsHelper';

function SecondStep({
  vendibleType, handleUploadImage, imageUrl, setImageUrl, description,
  setDescription, isEditionEnabled,
}) {
  const [imageError, setImageError] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleUploadImage(file).then((response) => {
        setImageUrl(response);
        setImageError('');
      }).catch((error) => {
        setImageError(error);
      });
    }
  };

  const handleChangeDescription = (event) => {
    setDescription(event.target.value);
  };

  const { imageTitle, mainTitle } = useMemo(() => (isEditionEnabled ? {
    imageTitle:
    <Typography variant="h5" sx={{ paddingRight: '5%' }}>
      { sharedLabels.currentImage }
    </Typography>,
    mainTitle: null,
  } : {
    mainTitle: (
      <Typography variant="h4" sx={{ paddingLeft: '5%' }}>
        { proveedorLabels['addVendible.lastStep'] }
      </Typography>
    ),
    imageTitle: null,
  }), [isEditionEnabled]);

  const vendibleUnit = useMemo(() => parseVendibleUnit(vendibleType), [vendibleType]);

  return (
    <Grid
      item
      display="flex"
      flexDirection="row"
      xs={10}
    >
      <Grid
        item
        display="flex"
        flexDirection="column"
        xs={6}
      >

        { mainTitle }
        <Typography
          dangerouslySetInnerHTML={{
            __html: proveedorLabels['addVendible.image.text'].replace('{vendible}', vendibleUnit),
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
            { imageTitle }
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
              <input
                type="file"
                onChange={handleFileChange}
                style={{
                  clip: 'rect(0 0 0 0)',
                  clipPath: 'inset(50%)',
                  height: 1,
                  overflow: 'hidden',
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  whiteSpace: 'nowrap',
                  width: 1,
                }}
              />
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
          { proveedorLabels['addVendible.description.title'].replace('{vendible}', vendibleUnit)}
        </Typography>
        <TextareaAutosize
          minRows={15}
          maxLength={maxLengthConstraints.PROVEEDOR.description}
          style={{ width: '80%', resize: 'none' }}
          placeholder={proveedorLabels['addVendible.description.placeholder'].replace('{vendible}', vendibleType)}
          value={description}
          onChange={handleChangeDescription}
        />
      </Grid>
    </Grid>
  );
}

SecondStep.defaultProps = {
  isEditionEnabled: false,
};

SecondStep.propTypes = {
  vendibleType: PropTypes.string.isRequired,
  handleUploadImage: PropTypes.func.isRequired,
  imageUrl: PropTypes.string.isRequired,
  setImageUrl: PropTypes.func.isRequired,
  description: PropTypes.string.isRequired,
  setDescription: PropTypes.func.isRequired,
  isEditionEnabled: PropTypes.bool,
};

export default SecondStep;
