/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useLoaderData } from 'react-router-dom';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import {
  useMemo, lazy, Suspense, useState, useEffect,
  useCallback,
} from 'react';
import Pagination from '@mui/material/Pagination';
import { sharedLabels } from '../StaticData/Shared';
import { PRODUCTS } from '../Shared/Constants/System';
import { adminRoutes } from '../Shared/Constants/ApiRoutes';
import { ATTRIBUTES_RENDERERS } from './TablesHelper';
import MapModal from '../Shared/Components/MapModal';
import BackdropLoader from '../Shared/Components/BackdropLoader';

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
  precio: 'text',
  tipoPrecio: 'enum',
  offersDelivery: 'boolean',
  offersInCustomAddress: 'boolean',
  category: 'enum',
};

const PRODUCTS_ATTRIBUTES_CONFIG = {
  stock: 'text',
};

const PAGE_SIZE = 10;

function AdminVendiblePosts({ vendibleType, vendibleId, fetchPosts }) {
  const [posts, setPosts] = useState();
  const [paginationInfo, setPaginationInfo] = useState();

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

  const fetchPostsCallback = async (page = 0) => {
    const newInfo = await fetchPosts({ vendibleId, page, pageSize: PAGE_SIZE });
    setPosts(newInfo.content);
    const { totalPages, last, first } = newInfo;
    setPaginationInfo({
      totalPages,
      first,
      last,
    });
  };

  const onPageChange = (_, newPage) => {
    fetchPostsCallback(newPage - 1);
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

  const paramsToRender = ({ rendererType, post, attribute }) => {
    const renderers = {
      enum: [attribute, post[attribute]],
      map: [post.location ? () => renderMapModal(post) : null],
      text: [post[attribute]],
      boolean: [post[attribute]],
      image: [post[attribute]],
    };

    return renderers[rendererType];
  };

  return (
    <>
      <TableContainer component={Paper}>
        <MapModal {...mapModalProps} />
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
            !posts?.length ? (
              <BackdropLoader open />
            ) : posts.map((post) => (
              <TableRow
                key={`post-${post.proveedorId}${post.vendibleNombre}`}
              >
                {
                  Object.keys(FINAL_ATTRIBUTES_CONFIG).map((attribute) => {
                    const rendererType = FINAL_ATTRIBUTES_CONFIG[attribute];

                    return (
                      <TableCell
                        key={`cell-${post.proveedorId}${post.vendibleNombre}-${attribute}`}
                        scope="row"
                        sx={{ borderBottom: '1px solid black', borderRight: '1px solid black' }}
                      >
                        {
                          ATTRIBUTES_RENDERERS[rendererType](...paramsToRender({
                            rendererType,
                            post,
                            attribute,
                          }))
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

export default AdminVendiblePosts;
