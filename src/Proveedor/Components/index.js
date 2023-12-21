import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import HelpOutline from '@mui/icons-material/HelpOutline';
import { useEffect, useState } from 'react';
import Header from '../../Header';
import { DialogModal, SearcherInput, Tooltip } from '../../Shared/Components';
import { proveedorLabels } from '../../StaticData/Proveedor';
import VendiblesList from '../VendiblesList';
import VendiblesFilters from '../../Vendible/Filters';
import {
  PRODUCT,
  PRODUCTS,
  ROLE_PROVEEDOR_PRODUCTOS,
  SERVICE,
  SERVICES,
} from '../../Shared/Constants/System';
import { sharedLabels } from '../../StaticData/Shared';
import { menuOptionsShape } from '../../Shared/PropTypes/Header';
import { vendibleCategoryShape } from '../../Shared/PropTypes/Vendibles';
import { proveedoresVendiblesShape } from '../../Shared/PropTypes/Proveedor';
import { filterVendiblesByCategory, filterVendiblesByTerm } from '../../Shared/Helpers/ProveedorHelper';
import VendibleCreateForm from '../CreateVendible';
import { LocalStorageService } from '../../Infrastructure/Services/LocalStorageService';

const localStorageService = new LocalStorageService();

function ProveedorPage({
  menuOptions,
  addVendibleSectionProps: {
    addVendibleLabel,
    addVendibleLink,
  },
  vendibles,
  categorias,
  userInfo,
  handleLogout,
  handleUploadImage,
}) {
  const vendibleType = userInfo.role === ROLE_PROVEEDOR_PRODUCTOS ? PRODUCTS : SERVICES;

  const [filteredVendibles, setFilteredVendibles] = useState(vendibles);

  const [searchValue, setSearchValue] = useState('');
  const [categorySelected, setCategorySelected] = useState();

  const [currentInnerScreen, setCurrentInnerScreen] = useState();

  const [modalContent, setModalContent] = useState({ title: '', text: '' });

  useEffect(() => {
    const storedScreen = localStorageService.getItem(
      LocalStorageService.PAGES_KEYS.PROVEEDOR.PAGE_SCREEN,
    );
    if (storedScreen) {
      setCurrentInnerScreen(storedScreen);
    }

    if (localStorageService.getItem(LocalStorageService.PAGES_KEYS.SHARED.BACKPRESSED)) {
      const title = '¿Desea salir?';
      const text = 'Perderá todos los cambios';
      setModalContent({ title, text });
    }
  }, []);

  useEffect(() => {
    if (currentInnerScreen) {
      localStorageService.setItem(
        LocalStorageService.PAGES_KEYS.PROVEEDOR.PAGE_SCREEN,
        currentInnerScreen,
      );
    }
  }, [currentInnerScreen]);

  const handleSetSearchValue = (value) => {
    setSearchValue(value);
  };

  const handleOnSelectCategory = ({ category }) => {
    setSearchValue((currentSearchValue) => {
      setFilteredVendibles((previous) => {
        let newFilteredVendibles;
        const vendiblesSource = currentSearchValue ? previous : vendibles;
        if (category) {
          newFilteredVendibles = filterVendiblesByCategory({
            vendibles: vendiblesSource,
            categoryName: category,
          });
        } else if (currentSearchValue) {
          newFilteredVendibles = filterVendiblesByTerm({
            sourceVendibles: vendibles,
            term: currentSearchValue,
          });
        } else {
          newFilteredVendibles = [...vendibles];
        }

        return newFilteredVendibles;
      });
      return currentSearchValue;
    });

    setCategorySelected(category || null);
  };

  const handleOnDeleteVendibleTerm = () => {
    if (!categorySelected) {
      setFilteredVendibles(vendibles);
    } else {
      handleOnSelectCategory({ category: categorySelected });
    }
  };

  const handleFilterVendiblesByName = () => {
    setFilteredVendibles((previous) => {
      const newFilteredVendibles = filterVendiblesByTerm({
        sourceVendibles: categorySelected ? previous : vendibles,
        term: searchValue,
      });

      return newFilteredVendibles;
    });
  };

  const onChangeCurrentScreen = ({ newScreen }) => {
    setCurrentInnerScreen(newScreen);
  };

  const innerScreens = {
    addNewVendible: {
      component: VendibleCreateForm,
      props: {
        userInfo,
        vendibleType: (userInfo.role === ROLE_PROVEEDOR_PRODUCTOS ? PRODUCT : SERVICE)
          .toLowerCase(),
        handleUploadImage,
      },
    },
  };

  let mainContent;

  const onCancelLeavingPage = () => {
    setModalContent({ title: '', text: '' });
    localStorageService.removeItem(LocalStorageService.PAGES_KEYS.SHARED.BACKPRESSED);
  };

  if (currentInnerScreen) {
    const InnerComponent = innerScreens[currentInnerScreen].component;
    const innerProps = innerScreens[currentInnerScreen].props;

    mainContent = <InnerComponent {...innerProps} />;
  } else {
    mainContent = (
      <Grid
        container
        sx={{
          flexDirection: 'row',
        }}
        justifyContent="center"
      >
        <Grid item xs={4}>
          <SearcherInput
            title={sharedLabels.filters}
            titleConfig={{
              variant: 'h3',
            }}
            searcherConfig={{
              sx: {
                mt: '5%',
              },
            }}
            onSearchClick={handleFilterVendiblesByName}
            keyEvents={{
              onKeyUp: handleSetSearchValue,
              onEnterPressed: handleFilterVendiblesByName,
              onDeletePressed: handleOnDeleteVendibleTerm,
            }}
            placeholder={proveedorLabels.filterByName}
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
              <Link
                sx={{ mt: '10px', cursor: 'pointer' }}
                onClick={() => onChangeCurrentScreen({ newScreen: 'addNewVendible' })}
              >
                {addVendibleLink}
              </Link>
            </div>
          </Box>
          <Box>
            <VendiblesList vendibles={filteredVendibles} />
          </Box>
        </Grid>
      </Grid>
    );
  }

  return (
    <>
      <Header withMenuComponent menuOptions={menuOptions} />
      { mainContent }
      <DialogModal
        title={modalContent.title}
        contextText={modalContent.text}
        cancelText={sharedLabels.cancel}
        acceptText={sharedLabels.accept}
        open={!!(modalContent?.title && modalContent.text)}
        handleAccept={handleLogout}
        handleDeny={onCancelLeavingPage}
      />
    </>
  );
}

ProveedorPage.propTypes = {
  menuOptions: PropTypes.arrayOf(PropTypes.shape(menuOptionsShape)).isRequired,
  addVendibleSectionProps: PropTypes.shape({
    addVendibleLabel: PropTypes.string,
    addVendibleLink: PropTypes.string,
  }).isRequired,
  vendibles: proveedoresVendiblesShape.isRequired,
  categorias: PropTypes.objectOf(PropTypes.shape(vendibleCategoryShape)).isRequired,
  userInfo: PropTypes.any.isRequired,
  handleLogout: PropTypes.func.isRequired,
  handleUploadImage: PropTypes.func.isRequired,
};

export default ProveedorPage;
