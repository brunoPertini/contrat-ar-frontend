import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import {
  Suspense,
  lazy, startTransition, useEffect, useState,
} from 'react';
import { sharedLabels } from '../StaticData/Shared';
import OptionsMenu from '../Shared/Components/OptionsMenu';
import { DialogModal } from '../Shared/Components';
import { EMPTY_FUNCTION, dialogModalTexts } from '../Shared/Constants/System';
import { parseVendibleUnit } from '../Shared/Helpers/UtilsHelper';
import InformativeAlert from '../Shared/Components/Alert';
import BackdropLoader from '../Shared/Components/BackdropLoader';
import { paginationShape } from '../Shared/PropTypes/Shared';
import { PostShape } from '../Shared/PropTypes/ProveedorVendible';
import { adminLabels } from '../StaticData/Admin';

const AdminVendiblePosts = lazy(() => import('./AdminVendiblePosts'));

const ATTIBUTES_LABELS = {
  id: sharedLabels.ID,
  name: sharedLabels.name,
  posts: sharedLabels.posts,
  actions: sharedLabels.actions,
};

const ACTIONS_OPTIONS = [sharedLabels.delete];

function VendiblesTable({
  vendibles, vendibleType, deleteVendible, fetchPosts, setIsShowingVendiblePosts, posts, setPosts,
  isShowingVendiblePosts, vendibleChosen, setVendibleChosen, paginationInfo, setPaginationInfo,
  updatePost,
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [operationResult, setOperationResult] = useState(null);

  const [showPostsTable, setShowPostsTable] = useState(false);

  useEffect(() => {
    setShowPostsTable(false);
    setIsShowingVendiblePosts(false);
  }, [vendibleType]);

  useEffect(() => {
    setShowPostsTable(isShowingVendiblePosts);
  }, [isShowingVendiblePosts]);

  const handleOpenPostsTable = (vendibleId, name) => startTransition(() => {
    setVendibleChosen({ id: vendibleId, name });
    setShowPostsTable(true);
    setIsShowingVendiblePosts(true);
  });

  const vendiblesNames = 'vendibles' in vendibles ? Object.keys(vendibles.vendibles)
    .filter((key) => vendibles.vendibles[key].length) : [];

  const optionHandlers = (option, id, name) => {
    if (!option) {
      return EMPTY_FUNCTION;
    }

    const handlers = {
      [sharedLabels.delete]: () => {
        setVendibleChosen({ id, name });
        setIsDialogOpen(true);
      },
    };

    return handlers[option]();
  };

  const resetDialogData = () => {
    setOperationResult(null);
    setIsDialogOpen(false);
    setVendibleChosen({ id: null, name: null });
  };

  const handleAcceptDeleteVendible = () => deleteVendible(vendibleChosen.id).then(() => {
    setOperationResult(true);
  })
    .catch(() => {
      setOperationResult(false);
    })
    .finally(() => setIsDialogOpen(false));

  if (showPostsTable) {
    return (
      <Suspense fallback={<BackdropLoader open />}>
        <AdminVendiblePosts
          posts={posts}
          setPosts={setPosts}
          fetchPosts={fetchPosts}
          vendibleType={vendibleType}
          vendibleId={vendibleChosen.id}
          paginationInfo={paginationInfo}
          setPaginationInfo={setPaginationInfo}
          updatePost={updatePost}
        />
      </Suspense>
    );
  }

  return !isEmpty(vendibles) ? (
    <TableContainer component={Paper}>
      <Table sx={{ textAlign: 'center', borderTop: '1px solid black' }}>
        <TableHead>
          <TableRow sx={{ borderBottom: '1px solid black' }}>
            {
              Object.values(ATTIBUTES_LABELS).map((label) => (
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
          {vendiblesNames.map((vendibleName) => ((
            <TableRow
              key={vendibleName}
            >

              <TableCell
                key={`cell-${vendibleName}-id`}
                scope="row"
                sx={{ borderBottom: '1px solid black', borderRight: '1px solid black' }}
              >
                { vendibles.vendibles[vendibleName][0].vendibleId }
              </TableCell>
              <TableCell
                key={`cell-${vendibleName}-name`}
                scope="row"
                sx={{ borderBottom: '1px solid black', borderRight: '1px solid black' }}
              >
                { vendibleName }
              </TableCell>
              <TableCell
                key={`cell-${vendibleName}-see-posts`}
                scope="row"
                sx={{ borderBottom: '1px solid black', borderRight: '1px solid black' }}
              >
                <Link
                  sx={{ cursor: 'pointer' }}
                  onClick={() => handleOpenPostsTable(
                    vendibles.vendibles[vendibleName][0].vendibleId,
                    vendibleName,
                  )}
                >
                  { sharedLabels.seePosts }
                </Link>
              </TableCell>
              <TableCell key={`cell-${vendibleName}-actions`} scope="row" sx={{ borderBottom: '1px solid black', borderRight: '1px solid black' }}>
                <OptionsMenu
                  title={sharedLabels.actions}
                  options={ACTIONS_OPTIONS}
                  onOptionClicked={(option) => optionHandlers(
                    option,
                    vendibles.vendibles[vendibleName][0].vendibleId,
                    vendibleName,
                  )}
                />
              </TableCell>
            </TableRow>
          )
          ))}
        </TableBody>
      </Table>
      <DialogModal
        open={isDialogOpen}
        handleAccept={handleAcceptDeleteVendible}
        handleDeny={resetDialogData}
        title={dialogModalTexts.DELETE_VENDIBLE.adminTitle
          .replace('{vendible}', parseVendibleUnit(vendibleType))
          .replace('{vendibleNombre}', vendibleChosen.name)}
        contextText={dialogModalTexts.DELETE_VENDIBLE.text}
        cancelText={sharedLabels.cancel}
        acceptText={sharedLabels.accept}
      />
      <InformativeAlert
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={operationResult !== null}
        label={(operationResult ? adminLabels['deleteVendible.alert.success']
          : adminLabels['deleteVendible.alert.error']).replace('{vendible}', vendibleChosen.name)}
        severity={operationResult ? 'success' : 'error'}
        onClose={resetDialogData}
      />
    </TableContainer>
  ) : null;
}

VendiblesTable.defaultProps = {
  vendibleChosen: { name: '', id: null },
  paginationInfo: {},
  posts: [],
};

VendiblesTable.propTypes = {
  vendibles: PropTypes.shape({ vendibles: PropTypes.any }).isRequired,
  vendibleType: PropTypes.oneOf(['productos', 'servicios']).isRequired,
  deleteVendible: PropTypes.func.isRequired,
  fetchPosts: PropTypes.func.isRequired,
  setIsShowingVendiblePosts: PropTypes.func.isRequired,
  setVendibleChosen: PropTypes.func.isRequired,
  isShowingVendiblePosts: PropTypes.bool.isRequired,
  vendibleChosen: PropTypes.shape({ name: PropTypes.string, id: PropTypes.number }),
  setPaginationInfo: PropTypes.func.isRequired,
  paginationInfo: PropTypes.shape(paginationShape),
  posts: PropTypes.arrayOf(PropTypes.shape(PostShape)),
  setPosts: PropTypes.func.isRequired,
  updatePost: PropTypes.func.isRequired,
};

export default VendiblesTable;
