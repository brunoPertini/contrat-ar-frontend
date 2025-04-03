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
import pick from 'lodash/pick';
import { sharedLabels } from '../StaticData/Shared';
import { CLIENTE, EMPTY_FUNCTION } from '../Shared/Constants/System';
import OptionsMenu from '../Shared/Components/OptionsMenu';
import { adminLabels } from '../StaticData/Admin';
import InformativeAlert from '../Shared/Components/Alert';
import { ATTRIBUTES_RENDERERS } from './TablesHelper';
import { ENTITY_NAME } from '../Infrastructure/Constants';
import VendibleInfo from '../Shared/Components/VendibleInfo';
import SuscriptionData from '../Shared/Components/SuscriptionData';
import { buildVendibleInfo } from '../Shared/Helpers/ProveedorHelper';
import DialogModal from '../Shared/Components/DialogModal';
import UserInfo from '../Shared/Components/UserInfo';

const ATTRIBUTES_CONFIG = {
  id: 'text',
  sourceTable: 'enum',
  attributes: 'enum',
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

const ACTIONS_OPTIONS = (requestWasApplied) => (!requestWasApplied
  ? [sharedLabels.seeDetail, sharedLabels.apply, sharedLabels.deny]
  : [sharedLabels.seeDetail]);

const dialogModalContentDefaultValues = {
  text: '', open: false, operation: '', handleAccept: () => {},
};

const snackbarDefaultValues = { open: false, label: '', severity: '' };

async function renderChangeRequestDetail({ request, requestDetail }, userToken) {
  let InnerComponent = null;
  let props = {};

  // TODO: refactor this somehow. Should never be aware of DDBB attributes names
  const shouldRenderSubscriptionData = request.sourceTable === ENTITY_NAME.suscripcion
   || (request.sourceTable === ENTITY_NAME.proveedor && request.attributes.includes('suscripcion'));

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

  if (shouldRenderSubscriptionData) {
    InnerComponent = SuscriptionData;
    props = {
      suscripcion: requestDetail,
    };
  }

  if (request.sourceTable === ENTITY_NAME.usuario) {
    InnerComponent = UserInfo;
    const toShowCommonData = pick(requestDetail, ['id', 'name', 'surname', 'email',
      'birthDate', 'phone', 'location', 'role', 'password']);

    const toShowRole = toShowCommonData.role?.nombre;
    const toShowProveedorData = toShowRole === CLIENTE ? {} : pick(requestDetail, ['dni',
      'fotoPerfilUrl', 'suscripcion']);

    props = {
      userInfo: {
        ...toShowCommonData,
        ...toShowProveedorData,
      },
    };

    if (toShowRole) {
      props.userInfo.role = toShowRole;
    }
  }

  return <InnerComponent {...props} />;
}

export default function ChangeRequestsTable({
  requests,
  getChangeRequestDetail,
  confirmChangeRequest,
  deleteChangeRequest,
  userToken,
}) {
  const [dialogModalContent, setDialogModalContent] = useState(
    dialogModalContentDefaultValues,
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

  const onCleanDialogModalContent = () => setDialogModalContent(
    dialogModalContentDefaultValues,
  );

  const OPERATION_DATA = {
    CONFIRM: {
      callingFunction: confirmChangeRequest,
      successLabel: adminLabels['changeRequest.confirm.success'],
      errorLabel: adminLabels['changeRequest.confirm.error'],
    },
    DENY: {
      callingFunction: deleteChangeRequest,
      successLabel: adminLabels['changeRequest.delete.success'],
      errorLabel: adminLabels['changeRequest.delete.error'],
    },
  };

  const showDialogModal = (changeRequestId, operation) => {
    setDialogModalContent({
      open: true,
      text: (operation === 'CONFIRM' ? adminLabels['changeRequest.confirm']
        : adminLabels['changeRequest.delete.confirm']).replace(
        '{id}',
        changeRequestId,
      ),
      handleAccept: () => {
        const newSnackbarProps = {
          open: true,
          label: '',
          severity: '',
        };

        OPERATION_DATA[operation].callingFunction(changeRequestId).then(() => {
          newSnackbarProps.label = OPERATION_DATA[operation].successLabel;
          newSnackbarProps.severity = 'success';
        }).catch(() => {
          newSnackbarProps.label = OPERATION_DATA[operation].errorLabel;
          newSnackbarProps.severity = 'error';
        }).finally(() => {
          setSnackbarProps({ ...newSnackbarProps });
          onCleanDialogModalContent();
        });
      },
    });
  };

  const paramsToRender = ({ rendererType, request, attribute }) => {
    const renderers = {
      enum: [attribute, request[attribute]],
      text: [request[attribute]],
    };

    return renderers[rendererType] ?? {};
  };

  const optionsHandlers = {
    [sharedLabels.apply]: (changeRequest) => showDialogModal(changeRequest.id, 'CONFIRM'),
    [sharedLabels.deny]: (changeRequest) => showDialogModal(changeRequest.id, 'DENY'),
    [sharedLabels.seeDetail]: async (changeRequest) => {
      const detail = await getChangeRequestDetail(changeRequest.changeDetailUrl);

      const content = await renderChangeRequestDetail({
        request: { ...changeRequest },
        requestDetail: { ...detail },
      }, userToken);

      setModalProps((previous) => ({
        ...previous,
        content,
        open: true,
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
      <DialogModal
        title={sharedLabels.pleaseConfirmAction}
        contextText={dialogModalContent.text}
        cancelText={sharedLabels.cancel}
        acceptText={sharedLabels.accept}
        open={dialogModalContent.open}
        handleAccept={dialogModalContent.handleAccept}
        handleDeny={onCleanDialogModalContent}
      />
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
                          <TableCell
                            key={`cell-${request.id}-${attribute}`}
                            scope="row"
                            sx={{ borderBottom: '1px solid black', borderRight: '1px solid black' }}
                          >
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
              <TableCell
                key={`cell-${request.id}-actions`}
                scope="row"
                sx={{ borderBottom: '1px solid black', borderRight: '1px solid black' }}
              >
                <OptionsMenu
                  title={sharedLabels.actions}
                  options={ACTIONS_OPTIONS(request.wasApplied)}
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
  requests: [],
};

ChangeRequestsTable.propTypes = {
  userToken: PropTypes.string.isRequired,
  confirmChangeRequest: PropTypes.func.isRequired,
  deleteChangeRequest: PropTypes.func.isRequired,
  getChangeRequestDetail: PropTypes.func.isRequired,
  requests: PropTypes.array,
};
