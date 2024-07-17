/* eslint-disable react/prop-types */
import isEmpty from 'lodash/isEmpty';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import { sharedLabels } from '../StaticData/Shared';

const ATTIBUTES_LABELS = {
  id: sharedLabels.ID,
  name: sharedLabels.name,
  posts: sharedLabels.posts,
};

function VendblesTable({
  vendibles,
}) {
  const vendiblesNames = 'vendibles' in vendibles ? Object.keys(vendibles.vendibles)
    .filter((key) => vendibles.vendibles[key].length) : [];

  return !isEmpty(vendibles) ? (
    <TableContainer component={Paper}>
      {/* <MapModal {...mapModalProps} /> */}
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
                  onClick={() => {}}
                >
                  { sharedLabels.seePosts }
                  ,
                </Link>
              </TableCell>
            </TableRow>
          )
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  ) : null;
}

export default VendblesTable;
