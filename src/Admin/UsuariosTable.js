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
  dni: sharedLabels.dni,
  plan: sharedLabels.plan,
  fotoPerfilUrl: sharedLabels.profilePhoto,
  active: sharedLabels.active,
};

const ATTRIBUTES_RENDERERS = {
  text: (attribute) => attribute,
  image: (attribute) => attribute,
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

export default function UsuariosTable({ usuarios: { proveedores, clientes } }) {
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

  return (
    <TableContainer component={Paper}>
      <MapModal {...mapModalProps} />
      <Table sx={{ textAlign: 'center', borderTop: '1px solid black' }} aria-label="Proveedores-table">
        <TableHead>
          <TableRow sx={{ borderBottom: '1px solid black' }}>
            {
              Object.values(ATTRIBUTES_LABELS).map((label) => (
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
          {proveedores.map((proveedor) => (
            <TableRow
              key={proveedor.id}
            >
              {
                Object.keys(proveedor).map((attribute) => {
                  const rendererType = ATTRIBUTES_CONFIG[attribute]
                  ?? PROVEEDORES_ATTRIBUTES_CONFIG[attribute];

                  const renderMapModal = () => setMapModalProps((previous) => ({
                    ...previous,
                    open: true,
                    location: proveedor[attribute],
                    title: `Ubicación de ${proveedor.name} ${proveedor.surname}`,
                  }));

                  return (
                    <TableCell scope="row" sx={{ borderBottom: '1px solid black', borderRight: '1px solid black' }}>

                      { rendererType !== 'enum' && rendererType !== 'map' && ATTRIBUTES_RENDERERS[rendererType](proveedor[attribute])}
                      { rendererType === 'enum' && ATTRIBUTES_RENDERERS[rendererType](attribute, proveedor[attribute]) }
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
