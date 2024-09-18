/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
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

const ATTRIBUTES_CONFIG = {
  id: 'text',
  sourceTable: 'text',
  attributes: 'text',
  sourceTableIdNames: 'enum',
  sourceTableIds: 'enum',
  wasApplied: 'enum',
};

const ATTRIBUTES_LABELS = {
  id: sharedLabels.ID,
  sourceTable: adminLabels['sourceTable.label'],
  attributes: adminLabels['attributes.label'],
  sourceTableIdNames: adminLabels['sourceTableIdNames.label'],
  sourceTableIds: adminLabels['sourceTableIds.label'],
  wasApplied: sharedLabels.wasApplied,
};

const FINAL_ATTRIBUTES_LABELS = {
  actions: sharedLabels.actions,
};

const ACTIONS_OPTIONS = [sharedLabels.apply, sharedLabels.deny];

const modalContentDefaultValues = { title: '', text: '', handleAccept: () => {} };

const snackbarDefaultValues = { open: false, label: '', severity: '' };

function renderSuscripcionData(suscripcion) {
  const planLabel = suscripcion.planId === 1
    ? sharedLabels.plansNames.FREE
    : sharedLabels.plansNames.PAID;

  const styles = { mt: '5% ' };
  return (
    <Box sx={{
      width: '200px',
      height: '300px',
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: 'white',
    }}
    >
      <Typography variant="h5">
        { sharedLabels.plan }
        :
      </Typography>
      <Typography variant="h5">
        { planLabel}
      </Typography>
      <Typography variant="h5" sx={{ ...styles }}>
        { sharedLabels.state}
        :
      </Typography>
      <Typography variant="h5">
        { suscripcion.isActive ? sharedLabels.activeF : sharedLabels.inactiveF }
      </Typography>
      <Typography variant="h5" sx={{ ...styles }}>
        { sharedLabels.activeSinceF}
        :
      </Typography>
      <Typography variant="h5">
        { suscripcion.createdDate }
      </Typography>
    </Box>
  );
}

export default function ChangeRequestsTable({
  requests,
}) {
  const [modalContent, setModalContent] = useState(
    modalContentDefaultValues,
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

  const onCleanModalContent = () => setModalContent(
    modalContentDefaultValues,
  );

  //   const showDeleteUserAlertModal = useCallback(({ userId, name, surname }) => {
  //     setDeleteUserModalContent({
  //       title: sharedLabels.pleaseConfirmAction,
  //       text: adminLabels.deleteUserText.replace('{nameAndSurname}', `${name} ${surname}`),
  //       handleAccept: () => deleteUser(userId).then(() => setSnackbarProps({
  //         open: true, severity: 'success', label: adminLabels.userDeleted,
  //       })).catch(() => setSnackbarProps({
  //         open: true, severity: 'error', label: adminLabels.userNotDeleted,
  //       })).finally(() => onCleanDeletingUserModalContent()),
  //     });
  //   }, [setDeleteUserModalContent]);

  const paramsToRender = ({ rendererType, request, attribute }) => {
    const renderers = {
      enum: [attribute, request[attribute]],
      text: [request[attribute]],
    };

    return renderers[rendererType];
  };

  const optionsHandlers = {
    [sharedLabels.apply]: () => {},
    [sharedLabels.deny]: () => {},
  };

  return (
    <TableContainer component={Paper}>
      {
        modalProps.open && (
          <Modal open={modalProps.open} onClose={modalProps.onClose}>
            {modalProps.content}
          </Modal>
        )
      }
      {/* <DialogModal
        title={deleteUserModalContent.title}
        contextText={deleteUserModalContent.text}
        cancelText={sharedLabels.cancel}
        acceptText={sharedLabels.accept}
        open={!!(deleteUserModalContent.text)}
        handleAccept={deleteUserModalContent.handleAccept}
        handleDeny={onCleanDeletingUserModalContent}
      /> */}
      <InformativeAlert
        {...snackbarProps}
        onClose={() => setSnackbarProps(snackbarDefaultValues)}
      />
      <Table sx={{ textAlign: 'center', borderTop: '1px solid black' }}>
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
          {requests.map((request) => (
            <TableRow
              key={request.id}
            >
              {
                    Object.keys(request).map((attribute) => {
                      const rendererType = ATTRIBUTES_CONFIG[attribute];
                      return (
                        <TableCell key={`cell-${request.id}-${attribute}`} scope="row" sx={{ borderBottom: '1px solid black', borderRight: '1px solid black' }}>
                          {
                            ATTRIBUTES_RENDERERS[rendererType](...paramsToRender({
                              rendererType,
                              request,
                              attribute,
                            }))
                          }

                        </TableCell>
                      );
                    })
                  }
              <TableCell key={`cell-${request.id}-actions`} scope="row" sx={{ borderBottom: '1px solid black', borderRight: '1px solid black' }}>
                <OptionsMenu
                  title={sharedLabels.actions}
                  options={ACTIONS_OPTIONS}
                  onOptionClicked={(option) => (option
                    ? optionsHandlers[option](request)
                    : EMPTY_FUNCTION)}
                />
              </TableCell>
            </TableRow>
          ))}

        </TableBody>
      </Table>
    </TableContainer>
  );
}

ChangeRequestsTable.defaultProps = {
  usuarios: [],
  requests: [],
};

ChangeRequestsTable.propTypes = {
  usuarios: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.shape(proveedorAdminShape),
    PropTypes.shape(clienteAdminShape)])),
  usuarioTypeFilter: PropTypes.oneOf(['proveedores', 'clientes']).isRequired,
  loginAsUser: PropTypes.func.isRequired,
  deleteUser: PropTypes.func.isRequired,
  requests: PropTypes.array,
};
