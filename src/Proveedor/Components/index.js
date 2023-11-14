/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import {
  Box, Grid, Link, Typography,
} from '@mui/material';
import HelpOutline from '@mui/icons-material/HelpOutline';
import { useState } from 'react';
import Header from '../../Header';
import { SearcherInput, Tooltip } from '../../Shared/Components';
import { proveedorLabels } from '../../StaticData/Proveedor';
import VendiblesList from '../VendiblesList';
import VendiblesFilters from '../../Vendible/Filters';
import { PRODUCTS, ROLE_PROVEEDOR_PRODUCTOS, SERVICES } from '../../Shared/Constants/System';
import { isDeletePressed, isEnterPressed, isKeyEvent } from '../../Shared/Utils/DomUtils';

/**
 *
 * @param {{sourceVendibles: Array<T>, term: String}}
 */
function filterVendiblesByTerm({ sourceVendibles, term }) {
  const regEx = new RegExp(term, 'i');
  return sourceVendibles.filter((v) => regEx.test(v.vendibleNombre));
}

/**
 *
 * @param {{vendibles: Array<T>, categoryName: String}}
 */
function filterVendiblesByCategory({ vendibles, categoryName }) {
  return vendibles.filter((vendible) => vendible.categoryNames.includes(categoryName));
}

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

  const [filteredVendibles, setFilteredVendibles] = useState(vendibles);

  const [searchValue, setSearchValue] = useState('');
  const [categorySelected, setCategorySelected] = useState();

  const handleSetSearchValue = (event) => {
    setSearchValue(event.target.value);
  };

  const handleOnSelectCategory = (_, { category }) => {
    setFilteredVendibles((previous) => {
      let newFilteredVendibles;
      const vendiblesSource = searchValue ? previous : vendibles;
      if (category) {
        newFilteredVendibles = filterVendiblesByCategory({
          vendibles: vendiblesSource,
          categoryName: category,
        });
      } else if (searchValue) {
        newFilteredVendibles = filterVendiblesByTerm({
          sourceVendibles: vendibles,
          term: searchValue,
        });
      } else {
        newFilteredVendibles = [...vendibles];
      }

      return newFilteredVendibles;
    });
    setCategorySelected(category || null);
  };

  const handleOnDeleteVendibleTerm = () => {
    if (!categorySelected) {
      setFilteredVendibles(vendibles);
    } else {
      handleOnSelectCategory(null, { category: categorySelected });
    }
  };

  const handleFilterVendiblesByName = (event) => {
    console.log(event);
    if ((isKeyEvent(event) && isEnterPressed(event)) || !isKeyEvent(event)) {
      setFilteredVendibles((previous) => {
        const newFilteredVendibles = filterVendiblesByTerm({
          sourceVendibles: categorySelected ? previous : vendibles,
          term: searchValue,
        });

        return newFilteredVendibles;
      });
    }

    if (!searchValue && isKeyEvent(event) && isDeletePressed(event)) {
      handleOnDeleteVendibleTerm();
    }
  };

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
            onSearchClick={handleFilterVendiblesByName}
            handleSearchDone={handleSetSearchValue}
            hasError={false}
            placeholder="Filtrá por nombre"
            inputValue={searchValue}
          />
          <VendiblesFilters
            categories={categorias}
            vendibleType={vendibleType}
            onFiltersApplied={handleOnSelectCategory}
            containerStyles={{
              mt: '5%',
            }}
            showAccordionTitle={false}
            alternativeAccordionTitle={(
              <Typography variant="h6">
                {proveedorLabels.filterByCategory}
              </Typography>
            )}
          />
        </Grid>
        <Grid
          item
          display="flex"
          xs={8}
          flexDirection="column"
        >
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <Typography variant="h4">
                { proveedorLabels.yourPosts }
              </Typography>
              <Tooltip
                placement="right-start"
                title={(
                  <Typography variant="h6">
                    {proveedorLabels.tooltipLabel}
                  </Typography>
                )}
              >
                <HelpOutline />
              </Tooltip>
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
            <VendiblesList vendibles={filteredVendibles} />
          </Box>
        </Grid>
      </Grid>
    </>
  );
}

export default ProveedorPage;
