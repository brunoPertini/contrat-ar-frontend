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
import VendiblesFilters from '../../Vendible/Filters';
import { PRODUCTS, ROLE_PROVEEDOR_PRODUCTOS, SERVICES } from '../../Shared/Constants/System';

function ProveedorPage({
  menuOptions,
  addVendibleSectionProps: {
    addVendibleLabel,
    addVendibleLink,
  },
  vendibles,
  categorias,
  role,
}) {
  const vendibleType = role === ROLE_PROVEEDOR_PRODUCTOS ? PRODUCTS : SERVICES;

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
        <Grid item xs={4}>
          <SearcherInput
            title="Filtros"
            titleConfig={{
              variant: 'h3',
            }}
            searcherConfig={{
              sx: {
                mt: '5%',
              },
            }}
            onSearchClick={() => {}}
            handleSearchDone={() => {}}
            hasError={false}
            placeholder="Filtrá por nombre"
          />
          <VendiblesFilters
            categories={categorias}
            vendibleType={vendibleType}
            onFiltersApplied={() => {}}
            containerStyles={{
              mt: '5%',
            }}
            showAccordionTitle={false}
            alternativeAccordionTitle={(
              <Typography variant="h6">
                Filtrá por categoría
              </Typography>
            )}
          />
        </Grid>
        <Grid item display="flex" xs={8} flexDirection="column">
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
              <Link sx={{ mt: '10px', cursor: 'pointer' }}>
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
