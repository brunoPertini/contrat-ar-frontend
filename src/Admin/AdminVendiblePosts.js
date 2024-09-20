import PropTypes from 'prop-types';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {
  useMemo, useState, useEffect,
} from 'react';
import Pagination from '@mui/material/Pagination';
import pickBy from 'lodash/pickBy';
import { sharedLabels } from '../StaticData/Shared';
import { PRODUCTS } from '../Shared/Constants/System';
import { ATTRIBUTES_RENDERERS } from './TablesHelper';
import MapModal from '../Shared/Components/MapModal';
import BackdropLoader from '../Shared/Components/BackdropLoader';
import { PostShape } from '../Shared/PropTypes/ProveedorVendible';
import { DialogModal } from '../Shared/Components';
import { postStateLabelResolver } from '../Shared/Helpers/ProveedorHelper';

const ATTIBUTES_COMMON_LABELS = {
  vendibleNombre: sharedLabels.vendibleNombre,
  proveedorId: sharedLabels.providerId,
  proveedorName: sharedLabels.providerName,
  descripcion: sharedLabels.description,
  imagenUrl: sharedLabels['image.main'],
  location: sharedLabels.location,
  precio: sharedLabels.price,
  tipoPrecio: sharedLabels.priceType,
  offersDelivery: sharedLabels.offersDelivery,
  offersInCustomAddress: sharedLabels.offersInCustomAddress,
  category: sharedLabels.category,
  state: sharedLabels.postState,
};

const PRODUCT_LABELS = {
  stock: sharedLabels.stock,
};

const ATTRIBUTES_CONFIG = {
  vendibleNombre: 'text',
  proveedorId: 'text',
  proveedorName: 'text',
  descripcion: 'text',
  imagenUrl: 'image',
  location: 'map',
  precio: 'enum',
  tipoPrecio: 'enum',
  offersDelivery: 'boolean',
  offersInCustomAddress: 'boolean',
  category: 'enum',
  state: 'enum',
};

const PRODUCTS_ATTRIBUTES_CONFIG = {
  stock: 'enum',
};

const modalContentDefaultValues = { text: '', handleAccept: () => {} };

const modalContexts = {
  state: (value) => sharedLabels['state.change.confirmation'].replace('{newState}', postStateLabelResolver[value]),
};

function AdminVendiblePosts({
  vendibleType, vendibleId, fetchPosts, paginationInfo, setPaginationInfo, posts,
  setPosts, updatePost,
}) {
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

  const [modalProps,
    setModalProps] = useState({
    ...modalContentDefaultValues,
    onClose: () => setModalProps((previous) => ({
      ...previous,
      ...modalContentDefaultValues,
    })),
  });

  const [infoToChangeFields, setInfoToChangeFields] = useState({
    state: {
      newValue: '',
      proveedorId: '',
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const fetchPostsCallback = async (page = 0) => {
    setIsLoading(true);
    const { content } = await fetchPosts({ vendibleId, page });
    setPosts(content.content);
    const newPaginationInfo = pickBy(content, (_, key) => key !== 'content');
    setPaginationInfo({ ...newPaginationInfo, page });
    setIsLoading(false);
  };

  const onPageChange = (_, newPage) => {
    fetchPostsCallback(newPage - 1);
  };

  const cleanModalContent = () => {
    console.log('clean modal content 115');
    setInfoToChangeFields({
      state: {
        newValue: '',
        proveedorId: '',
      },
    });

    setModalProps(
      (previous) => ({ ...previous, ...modalContentDefaultValues }),
    );
  };

  useEffect(() => {
    if (vendibleId) {
      fetchPostsCallback();
    }
  }, [vendibleId]);

  const FINAL_LABELS = useMemo(() => (vendibleType !== PRODUCTS
    ? ATTIBUTES_COMMON_LABELS
    : { ...ATTIBUTES_COMMON_LABELS, ...PRODUCT_LABELS }), [vendibleType]);

  const FINAL_ATTRIBUTES_CONFIG = useMemo(() => (vendibleType !== PRODUCTS ? ATTRIBUTES_CONFIG
    : { ...ATTRIBUTES_CONFIG, ...PRODUCTS_ATTRIBUTES_CONFIG }), [vendibleType]);

  const handleAcceptForField = {
    state: () => updatePost(
      infoToChangeFields.state.proveedorId,
      vendibleId,
      { state: infoToChangeFields.state.newValue },
    ),
  };

  const {
    paginationEnabled, pagesCount, canGoForward, canGoBack,
  } = useMemo(() => {
    if (!paginationInfo) {
      return {
        paginationEnabled: false,
        pagesCount: 0,
        canGoForward: false,
        canGoBack: false,
      };
    }
    return {
      paginationEnabled: paginationInfo.totalPages > 1,
      pagesCount: paginationInfo.totalPages,
      canGoForward: !paginationInfo.last,
      canGoBack: !paginationInfo.first,
    };
  }, [paginationInfo]);

  const renderMapModal = (post) => setMapModalProps((previous) => ({
    ...previous,
    open: true,
    location: post.location,
    title: sharedLabels.locationOfVendible.replace('{vendible}', post.vendibleNombre).replace('{proveedor}', post.proveedorName),
  }));

  const paramsToRender = ({
    rendererType, post, attribute, additionalProps,
  }) => {
    const renderers = {
      enum: [attribute, post[attribute], additionalProps],
      map: [post.location ? () => renderMapModal(post) : null],
      text: [post[attribute]],
      boolean: [post[attribute]],
      image: [post[attribute]],
    };

    return renderers[rendererType];
  };

  const onChangeField = (key, value, additionalInfo) => {
    console.log('ENTRA ON CHANGE FIELD');
    setInfoToChangeFields((previous) => ({
      ...previous,
      [key]: { ...additionalInfo, newValue: value },
    }));
    setModalProps((previous) => ({
      ...previous,
      text: modalContexts[key](value),
      handleAccept: () => handleAcceptForField[key](),
    }));
  };

  return (
    <>
      <TableContainer component={Paper}>
        <MapModal {...mapModalProps} />
        <DialogModal
          title={sharedLabels.pleaseConfirmAction}
          contextText={modalProps.text}
          cancelText={sharedLabels.cancel}
          acceptText={sharedLabels.accept}
          open={!!(modalProps.text)}
          handleAccept={modalProps.handleAccept}
          handleDeny={cleanModalContent}
        />
        <Table sx={{ textAlign: 'center', borderTop: '1px solid black' }}>
          <TableHead>
            {
              Object.values(FINAL_LABELS).map((label) => (
                <TableCell
                  sx={{ borderBottom: '1px solid black', borderRight: '1px solid black' }}
                >
                  { label }
                </TableCell>
              ))
            }
          </TableHead>
          <TableBody>
            {
            isLoading || (!posts) ? (
              <BackdropLoader open />
            ) : posts.map((post) => (
              <TableRow
                key={`post-${post.proveedorId}${post.vendibleNombre}`}
              >
                {
                  Object.keys(FINAL_ATTRIBUTES_CONFIG).map((attribute) => {
                    const rendererType = FINAL_ATTRIBUTES_CONFIG[attribute];

                    const paramsConfig = {
                      rendererType,
                      post,
                      attribute,
                      additionalProps: {
                        state: {
                          onChange: (key, value) => onChangeField(
                            key,
                            value,
                            { proveedorId: post.proveedorId },
                          ),
                          selectedValue: infoToChangeFields.state.newValue,
                        },
                      },
                    };

                    return (
                      <TableCell
                        key={`cell-${post.proveedorId}${post.vendibleNombre}-${attribute}`}
                        scope="row"
                        sx={{ borderBottom: '1px solid black', borderRight: '1px solid black' }}
                      >
                        {
                          ATTRIBUTES_RENDERERS[rendererType](...paramsToRender(paramsConfig))
                        }

                      </TableCell>
                    );
                  })
                }
              </TableRow>
            ))
          }
          </TableBody>
        </Table>
      </TableContainer>
      {
      paginationEnabled && (
        <Pagination
          count={pagesCount}
          hideNextButton={!canGoForward}
          hidePrevButton={!canGoBack}
          onChange={onPageChange}
          sx={{ mt: '1%' }}
        />
      )
    }
    </>
  );
}

AdminVendiblePosts.propTypes = {
  vendibleType: PropTypes.oneOf(['productos', 'servicios']).isRequired,
  vendibleId: PropTypes.number.isRequired,
  fetchPosts: PropTypes.func.isRequired,
  paginationInfo: PropTypes.any.isRequired,
  setPaginationInfo: PropTypes.func.isRequired,
  posts: PropTypes.arrayOf(PropTypes.shape(PostShape)).isRequired,
  setPosts: PropTypes.func.isRequired,
  updatePost: PropTypes.func.isRequired,
};

export default AdminVendiblePosts;
