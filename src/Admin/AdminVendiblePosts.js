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
import { sharedLabels } from '../StaticData/Shared';
import { PRODUCTS } from '../Shared/Constants/System';
import { adminRoutes } from '../Shared/Constants/ApiRoutes';

const ATTIBUTES_COMMON_LABELS = {
  proveedorId: sharedLabels.providerId,
  proveedorName: sharedLabels.providerName,
  description: sharedLabels.description,
  image: sharedLabels['image.main'],
  location: sharedLabels.location,
  price: sharedLabels.price,
  priceType: sharedLabels.priceType,
  offersDelivery: sharedLabels.offersDelivery,
  offersInCustomAddress: sharedLabels.offersInCustomAddress,
  category: sharedLabels.category,
};

const PRODUCT_LABELS = {
  stock: sharedLabels.stock,
};

const handleFetch = (url, queryString) => fetch(`${url}?${queryString}`, {
  headers: {
    Authorization: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJicnVub3BlcnRpbmlAZ21haWwuY29tIiwicm9sZSI6IkFETUlOIiwibmJmIjoxNzIxNzU5NjIxLCJzdXJuYW1lIjoiUGVydGluaSIsIm5hbWUiOiJCcnVubyIsImlkIjoiMSIsImV4cCI6MTcyMTc2MjAyMSwiaW5kZXhQYWdlIjoiL2FkbWluIiwiYXV0aG9yaXRpZXMiOlsiQURNSU4iXX0.kJd6X3Viwp8UMgwaXaQOvuUJIBL1Uawz6hF5AB0iDjD7NaAf_7ai7gXnqu50yr5pOkt27_qzKiW40566y25QN9TCSHd1k6N3NbmVJ9BHJT4Grk44fd78xywpxkbV0c2HTPYE7tSUUttjlGm8jp2VFH0ZwLiCNG_zqmsgkEoDChES-eU403IGGAYHak03fRdxTSdvaCD4RCi1uSLa_oGPBBfmdJePuVda9fEZbcsKltaRYeZTotq1aXGLiUwAmQOvoiU8OyKMXpTjyvhD8rxCyFENoNRqN5XnBI8-Uca7JB6ng8rxV21-OtiYdvY6MbI4yALPyc3xAz0qK9f5JocOUQ',
  },
}).then((response) => response.json())
  .then((data) => data);

const handleFetchPosts = async (vendibleId = 1) => {
  const url = process.env.REACT_APP_ADMIN_BACKEND_URL + adminRoutes.vendiblePosts.replace('{vendibleId}', vendibleId);

  const queryParams = { page: 0, pageSize: 3 };

  const queryString = new URLSearchParams(queryParams).toString();

  const newData = await handleFetch(url, queryString);

  return newData;
};

function AdminVendiblePosts({ vendibleType, vendibleId, fetchPosts }) {
  const [posts, setPosts] = useState();

  const fetchPostsCallback = async () => {
    const newPosts = await handleFetchPosts();
    setPosts(newPosts);
  };

  useEffect(() => {
    fetchPostsCallback();
  }, []);

  const FINAL_LABELS = useMemo(() => (vendibleType !== PRODUCTS
    ? ATTIBUTES_COMMON_LABELS
    : { ...ATTIBUTES_COMMON_LABELS, ...PRODUCT_LABELS }), [vendibleType]);

  return (
    <TableContainer component={Paper}>
      {/* <MapModal {...mapModalProps} /> */}
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
          {JSON.stringify(posts)}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default AdminVendiblePosts;
