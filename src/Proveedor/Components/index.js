/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import {
  Box, Grid, Link, Typography,
} from '@mui/material';
import HelpOutline from '@mui/icons-material/HelpOutline';
import Header from '../../Header';
import { SearcherInput } from '../../Shared/Components';
import { proveedorLabels } from '../../StaticData/Proveedor';
import VendiblesList from '../VendiblesList';

function ProveedorPage({
  menuOptions,
  addVendibleSectionProps: {
    addVendibleLabel,
    addVendibleLink,
  },
  vendibles,
}) {
  return (
    <>
      <Header withMenuComponent menuOptions={menuOptions} />
      <Grid
        container
        sx={{
          flexDirection: 'row',
        }}
        justifyContent="center"
      >
        <Grid item xs={6}>
          <SearcherInput
            title="Filtros"
            onSearchClick={() => {}}
            handleSearchDone={() => {}}
            hasError={false}
          />
        </Grid>
        <Grid item display="flex" xs={6} flexDirection="column">
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <Typography variant="h4">
                { proveedorLabels.yourPosts }
              </Typography>
              <HelpOutline />
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
            >
              <Typography variant="h6">
                {addVendibleLabel}
              </Typography>
              <Link sx={{ mt: '10px' }}>
                {addVendibleLink}
              </Link>
            </div>
          </Box>
          <Box>
            <VendiblesList vendibles={vendibles} />
          </Box>
        </Grid>
      </Grid>
    </>
  );
}

export default ProveedorPage;
