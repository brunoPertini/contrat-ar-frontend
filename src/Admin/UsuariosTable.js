/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import * as React from 'react';
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
  map: (attribute) => (
    <Link
      onClick={() => {}}
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

export default function UsuariosTable({ usuarios: { proveedores, clientes } }) {
  return (
    <TableContainer component={Paper}>
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

                  return (
                    <TableCell scope="row" sx={{ borderBottom: '1px solid black', borderRight: '1px solid black' }}>
                      {rendererType !== 'enum' ? ATTRIBUTES_RENDERERS[rendererType](proveedor[attribute])
                        : ATTRIBUTES_RENDERERS[rendererType](attribute, proveedor[attribute]) }
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
