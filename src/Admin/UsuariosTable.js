import PropTypes from 'prop-types';
import { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import Checkbox from '@mui/material/Checkbox';
import { sharedLabels } from '../StaticData/Shared';
import { labels } from '../StaticData/LocationMap';
import { USUARIO_TYPE_CLIENTES } from '../Shared/Constants/System';
import MapModal from '../Shared/Components/MapModal';
import { clienteAdminShape, proveedorAdminShape } from '../Shared/PropTypes/Admin';
import OptionsMenu from '../Shared/Components/OptionsMenu';
import { rootPageLabels } from '../StaticData/RootPage';

const ATTRIBUTES_CONFIG = {
  id: 'text',
  name: 'text',
  surname: 'text',
  email: 'text',
  birthDate: 'text',
  phone: 'text',
  createdAt: 'text',
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
  createdAt: sharedLabels.createdAt,
};

const PROVEEDORES_ATTRIBUTES_LABELS = {
  dni: sharedLabels.dni,
  plan: sharedLabels.plan,
  fotoPerfilUrl: sharedLabels.profilePhoto,
};

const FINAL_ATTRIBUTES_LABELS = {
  actions: sharedLabels.actions,
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
  boolean: (attribute) => (
    <Checkbox
      checked={attribute}
    />
  ),
  enum: (attribute, attributeValue) => {
    const enumAttributes = {
      plan: () => sharedLabels.plansNames[attributeValue],
    };

    return enumAttributes[attribute]();
  },
};

const ACTIONS_OPTIONS = [sharedLabels.delete, rootPageLabels.signin];

export default function UsuariosTable({ usuarios, usuarioTypeFilter, loginAsUser }) {
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
    ? { ...ATTRIBUTES_LABELS, active: sharedLabels.active, ...FINAL_ATTRIBUTES_LABELS }
    : {
      ...ATTRIBUTES_LABELS,
      ...PROVEEDORES_ATTRIBUTES_LABELS,
      active: sharedLabels.active,
      ...FINAL_ATTRIBUTES_LABELS,
    };

  const renderMapModal = (usuario) => setMapModalProps((previous) => ({
    ...previous,
    open: true,
    location: usuario.location,
    title: sharedLabels.locationOf.replace('{name}', usuario.name).replace('{surname}', usuario.surname),
  }));

  const paramsToRender = ({ rendererType, usuario, attribute }) => {
    const renderers = {
      enum: [attribute, usuario[attribute]],
      map: [() => renderMapModal(usuario)],
      text: [usuario[attribute]],
      boolean: [usuario[attribute]],
      image: [usuario[attribute]],
    };

    return renderers[rendererType];
  };

  const optionsHandlers = {
    [sharedLabels.delete]: () => {},
    [rootPageLabels.signin]: (userId) => loginAsUser(userId),
  };

  return (
    <TableContainer component={Paper}>
      <MapModal {...mapModalProps} />
      <Table sx={{ textAlign: 'center', borderTop: '1px solid black' }}>
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
          {usuarios.map((usuario) => ((
            <TableRow
              key={usuario.id}
            >
              {
                  Object.keys(usuario).map((attribute) => {
                    const rendererType = ATTRIBUTES_CONFIG[attribute]
                    ?? PROVEEDORES_ATTRIBUTES_CONFIG[attribute];

                    return (
                      <TableCell key={`cell-${usuario.id}-${attribute}`} scope="row" sx={{ borderBottom: '1px solid black', borderRight: '1px solid black' }}>
                        {
                          ATTRIBUTES_RENDERERS[rendererType](...paramsToRender({
                            rendererType,
                            usuario,
                            attribute,
                          }))
                        }

                      </TableCell>
                    );
                  })
                }
              <TableCell key={`cell-${usuario.id}-actions`} scope="row" sx={{ borderBottom: '1px solid black', borderRight: '1px solid black' }}>
                <OptionsMenu
                  title={sharedLabels.actions}
                  options={ACTIONS_OPTIONS}
                  onOptionClicked={(option) => optionsHandlers[option](usuario.id)}
                />
              </TableCell>
            </TableRow>
          )
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

UsuariosTable.propTypes = {
  usuarios: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.shape(proveedorAdminShape),
    PropTypes.shape(clienteAdminShape)])).isRequired,
  usuarioTypeFilter: PropTypes.oneOf(['proveedores', 'clientes']).isRequired,
  loginAsUser: PropTypes.func.isRequired,
};
