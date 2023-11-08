/* eslint-disable react/prop-types */
import { Box, Grid, Typography } from '@mui/material';
import HelpOutline from '@mui/icons-material/HelpOutline';
import Header from '../../Header';
import { SearcherInput } from '../../Shared/Components';

function ProveedorPage({ menuOptions }) {
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
        <Grid item xs={6} flexDirection="row">
          <Box display="flex" flexDirection="row">
            <Typography variant="h4" sx={{ width: '30%' }}>
              Tus Publicaciones
            </Typography>
            <HelpOutline />
          </Box>
        </Grid>
      </Grid>
    </>
  );
}

export default ProveedorPage;
