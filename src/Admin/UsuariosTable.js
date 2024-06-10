/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import Checkbox from '@mui/material/Checkbox';
import Modal from '@mui/material/Modal';
import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { sharedLabels } from '../StaticData/Shared';
import { labels } from '../StaticData/LocationMap';
import LocationMap from '../Shared/Components/LocationMap';
import { parseLocationForMap } from '../Shared/Helpers/UtilsHelper';
import { USUARIO_TYPE_CLIENTES } from '../Shared/Constants/System';

const ATTRIBUTES_CONFIG = {
  id: 'text',
  name: 'text',
  surname: 'text',
  email: 'text',
  birthDate: 'text',
  phone: 'text',
  location: 'map',
  active: 'boolean',
};

const PROVEEDORES_ATTRIBUTES_CONFIG = {
  dni: 'text',
  plan: 'enum',
  fotoPerfilUrl: 'image',
};

const ATTRIBUTES_LABELS = {
  id: sharedLabels.id,
  name: sharedLabels.name,
  surname: sharedLabels.surname,
  email: sharedLabels.email,
  birthDate: sharedLabels.birthDate,
  phone: sharedLabels.phone,
  location: sharedLabels.location,
};

const PROVEEDORES_ATTRIBUTES_LABELS = {
  dni: sharedLabels.dni,
  plan: sharedLabels.plan,
  fotoPerfilUrl: sharedLabels.profilePhoto,
};

const ATTRIBUTES_RENDERERS = {
  text: (attribute) => attribute,
  image: (attribute) => (
    <Link
      sx={{ cursor: 'pointer' }}
      onClick={() => window.open(attribute, '_blank')}
    >
      { attribute }
      ,
    </Link>
  ),
  map: (onLinkClick) => (
    <Link
      sx={{ cursor: 'pointer' }}
      onClick={() => onLinkClick()}
    >
      { labels.openMapInModal }
      ,
    </Link>
  ),
  boolean: (attribute, onChange) => (
    <Checkbox
      checked={attribute}
      onChange={(event) => onChange(event.target.checked)}
    />
  ),
  enum: (attribute, attributeValue) => {
    const enumAttributes = {
      plan: () => sharedLabels.plansNames[attributeValue],
    };

    return enumAttributes[attribute]();
  },
};

function MapModal({
  location, handleClose, open, title,
}) {
  return open ? (
    <Modal
      open={open}
      onClose={handleClose}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'white',
        }}
      >
        <Typography variant="h3" sx={{ mb: '2%' }}>
          { title }
        </Typography>

        <LocationMap
          enableDragEvents={false}
          location={parseLocationForMap(location)}
          containerStyles={{
            height: '40rem',
            width: '40rem',
          }}
        />
      </Box>
    </Modal>
  ) : null;
}

export default function UsuariosTable({ usuarios, usuarioTypeFilter }) {
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

  const toLoopAttributes = usuarioTypeFilter === USUARIO_TYPE_CLIENTES
    ? { ...ATTRIBUTES_LABELS, active: sharedLabels.active }
    : { ...ATTRIBUTES_LABELS, ...PROVEEDORES_ATTRIBUTES_LABELS, active: sharedLabels.active };

  return (
    <TableContainer component={Paper}>
      <MapModal {...mapModalProps} />
      <Table sx={{ textAlign: 'center', borderTop: '1px solid black' }} aria-label="Proveedores-table">
        <TableHead>
          <TableRow sx={{ borderBottom: '1px solid black' }}>
            {
              Object.values(toLoopAttributes).map((label) => (
                <TableCell
                  sx={{ borderBottom: '1px solid black', borderRight: '1px solid black' }}
                >
                  { label }
                </TableCell>
              ))
            }
          </TableRow>
        </TableHead>
        <TableBody>
          {usuarios.map((usuario) => (
            <TableRow
              key={usuario.id}
            >
              {
                Object.keys(usuario).map((attribute) => {
                  const rendererType = ATTRIBUTES_CONFIG[attribute]
                  ?? PROVEEDORES_ATTRIBUTES_CONFIG[attribute];

                  const renderMapModal = () => setMapModalProps((previous) => ({
                    ...previous,
                    open: true,
                    location: usuario[attribute],
                    title: `Ubicación de ${usuario.name} ${usuario.surname}`,
                  }));

                  return (
                    <TableCell key={`cell-${usuario.id}-${attribute}`} scope="row" sx={{ borderBottom: '1px solid black', borderRight: '1px solid black' }}>

                      { rendererType !== 'enum' && rendererType !== 'map' && ATTRIBUTES_RENDERERS[rendererType](usuario[attribute])}
                      { rendererType === 'enum' && ATTRIBUTES_RENDERERS[rendererType](attribute, usuario[attribute]) }
                      { rendererType === 'map' && ATTRIBUTES_RENDERERS[rendererType](renderMapModal) }

                    </TableCell>
                  );
                })
              }
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
