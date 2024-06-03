import PropTypes from 'prop-types';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import { useState } from 'react';
import { sharedLabels } from '../../StaticData/Shared';
import InformativeAlert from './Alert';

export default function ProfilePhoto({
  src, alt, onUpload, onSuccess,
}) {
  const [alertErrorConfig, setAlertErrorConfig] = useState({
    openSnackbar: false,
    alertSeverity: '',
    alertLabel: '',
  });

  const resetAlertData = () => {
    setAlertErrorConfig({
      openSnackbar: false,
      alertSeverity: '',
      alertLabel: '',
    });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onUpload(file).then((response) => {
        onSuccess(response);
      }).catch(() => {
        setAlertErrorConfig({
          openSnackbar: true,
          alertSeverity: 'error',
          alertLabel: sharedLabels['image.upload.error'],
        });
      });
    }
  };

  return (
    <>
      <InformativeAlert
        open={alertErrorConfig.openSnackbar}
        onClose={() => resetAlertData()}
        label={alertErrorConfig.alertLabel}
        severity={alertErrorConfig.alertSeverity}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      />
      <Avatar
        alt={alt}
        src={src}
        sx={{
          height: 100,
          width: 100,
        }}
      />
      <Button
        component="label"
        variant="contained"
        startIcon={<CloudUploadIcon />}
        sx={{ mt: '5%' }}
      >
        {sharedLabels.changeImage}
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
    </>
  );
}

ProfilePhoto.defaultProps = {
  alt: '',
};

ProfilePhoto.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  onUpload: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};
