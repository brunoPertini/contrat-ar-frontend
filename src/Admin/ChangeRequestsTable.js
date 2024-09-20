/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Modal from '@mui/material/Modal';
import { sharedLabels } from '../StaticData/Shared';
import { EMPTY_FUNCTION } from '../Shared/Constants/System';
import { clienteAdminShape, proveedorAdminShape } from '../Shared/PropTypes/Admin';
import OptionsMenu from '../Shared/Components/OptionsMenu';
import { adminLabels } from '../StaticData/Admin';
import InformativeAlert from '../Shared/Components/Alert';
import { ATTRIBUTES_RENDERERS } from './TablesHelper';
import { ENTITY_NAME } from '../Infrastructure/Constants';
import VendibleInfo from '../Shared/Components/VendibleInfo';
import SuscriptionData from '../Shared/Components/SuscriptionData';
import { buildVendibleInfo } from '../Shared/Helpers/ProveedorHelper';

const ATTRIBUTES_CONFIG = {
  id: 'text',
  sourceTable: 'enum',
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

const ACTIONS_OPTIONS = [sharedLabels.seeDetail, sharedLabels.apply, sharedLabels.deny];

const modalContentDefaultValues = { title: '', text: '', handleAccept: () => {} };

const snackbarDefaultValues = { open: false, label: '', severity: '' };

function renderChangeRequestDetail({ request, requestDetail }, userToken) {
  let InnerComponent = null;
  let props = {};

  if (request.sourceTable === ENTITY_NAME.proveedor_vendible) {
    const { vendibleType } = requestDetail;
    InnerComponent = VendibleInfo;
    props = {
      userToken,
      vendibleType,
      vendibleInfo: buildVendibleInfo(requestDetail, vendibleType),
      cardStyles: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'white',
        height: '100%',
        width: '40rem',
        overflowY: 'scroll',
        overflowX: 'none',
      },
    };
  }

  if (request.sourceTable === ENTITY_NAME.suscripcion) {
    InnerComponent = SuscriptionData;
    props = {
      suscripcion: requestDetail,
      styles: { mt: '5% ' },
    };
  }

  return <InnerComponent {...props} />;
}

export default function ChangeRequestsTable({
  requests,
  getChangeRequestDetail,
  userToken,
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

    return renderers[rendererType] ?? {};
  };

  const optionsHandlers = {
    [sharedLabels.apply]: () => {},
    [sharedLabels.deny]: () => {},
    [sharedLabels.seeDetail]: async (changeRequest) => {
      const detail = await getChangeRequestDetail(changeRequest.changeDetailUrl);

      setModalProps((previous) => ({
        ...previous,
        open: true,
        content: renderChangeRequestDetail({
          request: { ...changeRequest },
          requestDetail: { ...detail },
        }, userToken),
      }));
    },
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
      <InformativeAlert
        {...snackbarProps}
        onClose={() => setSnackbarProps(snackbarDefaultValues)}
      />
      <Table sx={{ textAlign: 'center', borderTop: '1px solid black' }}>
        <TableHead>
          <TableRow sx={{ borderBottom: '1px solid black' }}>
            {
              Object.values({ ...ATTRIBUTES_LABELS, ...FINAL_ATTRIBUTES_LABELS }).map((label) => (
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
                      if (rendererType) {
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
                      }

                      return null;
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
