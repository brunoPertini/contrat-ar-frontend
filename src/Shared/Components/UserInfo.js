import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Modal from '@mui/material/Modal';
import { useState } from 'react';
import { sharedLabels } from '../../StaticData/Shared';
import { flexColumn } from '../Constants/Styles';
import SuscriptionData from './SuscriptionData';
import MapModal from './MapModal';

const rowStyles = { mt: '5%' };

const renderRowAsText = (label, value) => (
  <Box {...flexColumn} {...rowStyles}>
    <Typography variant="h5" color="white">
      { label }
      :
    </Typography>
    <Typography variant="h5" color="white">
      { value }
    </Typography>
  </Box>
);

const renderRowAsLink = (label, onClick) => (
  <Box {...flexColumn} {...rowStyles}>
    <Link
      variant="h5"
      sx={{ cursor: 'pointer', color: '#f5c242' }}
      onClick={() => onClick()}
    >
      { label }
    </Link>
  </Box>
);

export default function UserInfo({ userInfo }) {
  const [modalProps,
    setModalProps] = useState({
    open: false,
    content: null,
    onClose: () => setModalProps((previous) => ({
      ...previous,
      open: false,
      content: null,
    })),
  });

  const [mapModalProps, setMapModalProps] = useState({
    open: false,
    handleClose: () => setMapModalProps((previous) => ({
      ...previous,
      open: false,
      location: null,
      title: '',
    })),
    location: null,
    title: '',
  });

  const renderers = {
    fotoPerfilUrl: (_, url) => renderRowAsLink(sharedLabels.profilePhoto, () => window.open(url, '_blank')),

    suscripcion: (_, info) => renderRowAsLink(
      sharedLabels.subscription,
      () => setModalProps((previous) => ({
        ...previous,
        open: true,
        content: <SuscriptionData suscripcion={info} />,
      })),
    ),

    location: (label, userLocation) => renderRowAsLink(label, () => setMapModalProps((previous) => ({
      ...previous,
      open: true,
      location: userLocation,
      title: sharedLabels.locationOf.replace('{name}', userInfo.name).replace('{surname}', userInfo.surname),
    }))),

    textAttribute: (label, value) => renderRowAsText(label, value),

    hasWhatsapp: (label, value) => renderRowAsText(label, value ? sharedLabels.yes : sharedLabels.no),
  };

  return (
    <Box sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: 'rgb(36, 134, 164)',
      overflowY: 'auto',
      maxHeight: '100vh',
    }}
    >
      <MapModal {...mapModalProps} />
      {
        modalProps.open && (
        <Modal open={modalProps.open} onClose={modalProps.onClose}>
          {modalProps.content}
        </Modal>
        )
      }

      {
        Object.keys(userInfo).map((key) => (renderers[key]
          ? renderers[key](sharedLabels[key], userInfo[key])
          : renderers.textAttribute(sharedLabels[key], userInfo[key])))
      }
    </Box>
  );
}

UserInfo.propTypes = {
  userInfo: PropTypes.object.isRequired,
};
