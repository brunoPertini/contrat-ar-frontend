import PropTypes from 'prop-types';
import { forwardRef, useCallback, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Modal from '@mui/material/Modal';
import { sharedLabels } from '../StaticData/Shared';
import { EMPTY_FUNCTION, USUARIO_TYPE_CLIENTES } from '../Shared/Constants/System';
import MapModal from '../Shared/Components/MapModal';
import { clienteAdminShape, proveedorAdminShape } from '../Shared/PropTypes/Admin';
import OptionsMenu from '../Shared/Components/OptionsMenu';
import { rootPageLabels } from '../StaticData/RootPage';
import { adminLabels } from '../StaticData/Admin';
import { DialogModal } from '../Shared/Components';
import InformativeAlert from '../Shared/Components/Alert';
import { ATTRIBUTES_RENDERERS } from './TablesHelper';
import SuscriptionData from '../Shared/Components/SuscriptionData';

const ATTRIBUTES_CONFIG = {
  id: 'text',
  name: 'text',
  surname: 'text',
  email: 'text',
  birthDate: 'text',
  phone: 'text',
  location: 'map',
  createdAt: 'text',
  active: 'boolean',
};

const PROVEEDORES_ATTRIBUTES_CONFIG = {
  dni: 'text',
  fotoPerfilUrl: 'image',
  suscripcion: 'link',
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
  active: sharedLabels.active,
};

const PROVEEDORES_ATTRIBUTES_LABELS = {
  dni: sharedLabels.dni,
  fotoPerfilUrl: sharedLabels.profilePhoto,
  suscripcion: sharedLabels.subscription,
};

const FINAL_ATTRIBUTES_LABELS = {
  actions: sharedLabels.actions,
};

const ACTIONS_OPTIONS = [sharedLabels.delete, rootPageLabels.signin];

const deleteUserModalContentDefaultValues = { title: '', text: '', handleAccept: () => {} };

const snackbarDefaultValues = { open: false, label: '', severity: '' };

function renderSuscripcionData(suscripcion) {
  return (
    <SuscriptionData suscripcion={suscripcion} />
  );
}

const UsuariosTable = forwardRef((
  {
    usuarios, usuarioTypeFilter, loginAsUser, deleteUser,
  },
  tableContainerRef,
) => {
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

  const [deleteUserModalContent, setDeleteUserModalContent] = useState(
    deleteUserModalContentDefaultValues,
  );

  const [snackbarProps, setSnackbarProps] = useState(snackbarDefaultValues);

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

  const onCleanDeletingUserModalContent = () => setDeleteUserModalContent(
    deleteUserModalContentDefaultValues,
  );

  const showDeleteUserAlertModal = useCallback(({ userId, name, surname }) => {
    setDeleteUserModalContent({
      title: sharedLabels.pleaseConfirmAction,
      text: adminLabels.deleteUserText.replace('{nameAndSurname}', `${name} ${surname}`),
      handleAccept: () => deleteUser(userId).then(() => setSnackbarProps({
        open: true, severity: 'success', label: adminLabels.userDeleted,
      })).catch(() => setSnackbarProps({
        open: true, severity: 'error', label: adminLabels.userNotDeleted,
      })).finally(() => onCleanDeletingUserModalContent()),
    });
  }, [setDeleteUserModalContent]);

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
      link: [sharedLabels.seeDetail, () => setModalProps((previous) => ({
        ...previous,
        open: true,
        content: renderSuscripcionData(usuario.suscripcion),
      }))],
    };

    return renderers[rendererType];
  };

  const optionsHandlers = {
    [sharedLabels.delete]: (userId, name, surname) => showDeleteUserAlertModal(
      { userId, name, surname },
    ),
    [rootPageLabels.signin]: (userId) => loginAsUser(userId),
  };

  return (
    <TableContainer component={Paper} ref={tableContainerRef}>
      {
        modalProps.open && (
          <Modal open={modalProps.open} onClose={modalProps.onClose}>
            {modalProps.content}
          </Modal>
        )
      }
      <MapModal {...mapModalProps} />
      <DialogModal
        title={deleteUserModalContent.title}
        contextText={deleteUserModalContent.text}
        cancelText={sharedLabels.cancel}
        acceptText={sharedLabels.accept}
        open={!!(deleteUserModalContent.text)}
        handleAccept={deleteUserModalContent.handleAccept}
        handleDeny={onCleanDeletingUserModalContent}
      />
      <InformativeAlert
        {...snackbarProps}
        onClose={() => setSnackbarProps(snackbarDefaultValues)}
      />
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
          {usuarios.map((usuario) => (
            <TableRow
              key={usuario.id}
            >
              {
                    Object.keys(usuario).map((attribute) => {
                      const rendererType = ATTRIBUTES_CONFIG[attribute]
                      ?? PROVEEDORES_ATTRIBUTES_CONFIG[attribute];

                      if (!rendererType) {
                        return null;
                      }

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
                  onOptionClicked={(option) => (option ? optionsHandlers[option](
                    usuario.id,
                    usuario.name,
                    usuario.surname,
                  ) : EMPTY_FUNCTION)}
                />
              </TableCell>
            </TableRow>
          ))}

        </TableBody>
      </Table>
    </TableContainer>
  );
});

UsuariosTable.defaultProps = {
  usuarios: [],
};

UsuariosTable.propTypes = {
  usuarios: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.shape(proveedorAdminShape),
    PropTypes.shape(clienteAdminShape)])),
  usuarioTypeFilter: PropTypes.oneOf(['proveedores', 'clientes']).isRequired,
  loginAsUser: PropTypes.func.isRequired,
  deleteUser: PropTypes.func.isRequired,
};

export default UsuariosTable;
