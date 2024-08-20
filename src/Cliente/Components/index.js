import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import {
  useCallback, useContext, useEffect, useMemo, useState,
} from 'react';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Header from '../../Header';
import {
  RadioList, Layout, SearcherInput, StaticAlert,
} from '../../Shared/Components';
import List from '../VendiblesList';
import VendiblesFilters from '../../Vendible/Filters';
import { systemConstants } from '../../Shared/Constants';
import { sharedLabels } from '../../StaticData/Shared';
import { labels } from '../../StaticData/Cliente';
import { vendiblesLabels } from '../../StaticData/Vendibles';
import { menuOptionsShape } from '../../Shared/PropTypes/Header';
import GoBackLink from '../../Shared/Components/GoBackLink';
import { NavigationContext } from '../../State/Contexts/NavigationContext';
import useExitAppDialog from '../../Shared/Hooks/useExitAppDialog';
import { getUserInfoResponseShape } from '../../Shared/PropTypes/Vendibles';

function Cliente({
  menuOptions, dispatchHandleSearch, handleLogout, userInfo,
}) {
  const [searchErrorMessage, setErrorMessage] = useState('');

  const [searchInputValue, setSearchInputValue] = useState('');
  const [previousSearchInputValue, setPreviousSearchInputValue] = useState('');
  const [searchType, setSearchType] = useState(systemConstants.PRODUCTS);

  const [vendiblesResponse, setVendiblesResponse] = useState({});

  const [lastFiltersApplied, setLastFiltersApplied] = useState({});

  const [searchDone, setSearchDone] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [thereIsNoResults, setThereIsNoResults] = useState(false);

  const [filtersEnabled, setFiltersEnabled] = useState(false);

  const [isExitAppModalOpen, setIsExitAppModalOpen] = useState(false);

  const { setHandleGoBack } = useContext(NavigationContext);

  const showlExitAppModal = () => setIsExitAppModalOpen(true);

  const onCancelExitApp = () => setIsExitAppModalOpen(false);

  const handleSetSearchType = (event) => {
    setErrorMessage('');
    setSearchInputValue('');
    setPreviousSearchInputValue('');
    setVendiblesResponse({});
    setLastFiltersApplied({});
    setSearchDone(false);
    setThereIsNoResults(false);
    setSearchType(event.target.value);
  };

  const handleStartSearch = (filters) => {
    if (searchInputValue) {
      setIsLoading(true);
      setErrorMessage('');
      if (filters) {
        setLastFiltersApplied(filters);
      }
      const finalAppliedFilters = filters ?? lastFiltersApplied;
      const params = {
        searchType,
        searchInput: searchInputValue,
        filters: finalAppliedFilters,
      };
      dispatchHandleSearch(params).then((response) => {
        setPreviousSearchInputValue(searchInputValue);
        setSearchDone(true);
        setVendiblesResponse(response);
        setFiltersEnabled(!!response.categorias);
        setThereIsNoResults(isEmpty(response.vendibles));
      })
        .catch((errorMessage) => {
          setErrorMessage(errorMessage);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setErrorMessage(labels.searchErrorMessage);
    }
  };

  const handleKeyUp = (newValue) => {
    setSearchInputValue(newValue);
  };

  const radioGroupConfig = {
    onChange: handleSetSearchType,
    defaultValue: systemConstants.PRODUCTS,
    row: true,
    values: [
      {
        value: systemConstants.PRODUCTS,
        style: {
          '& .MuiSvgIcon-root': {
            fontSize: 50,
          },
        },
        label: sharedLabels.product,
      },
      {
        value: systemConstants.SERVICES,
        style: {
          '& .MuiSvgIcon-root': {
            fontSize: 50,
          },
        },
        label: sharedLabels.service,
      },
    ],
  };

  const gridProps = {
    container: true,
    item: true,
    xs: 6,
    sx: {
      flexDirection: 'column',
      alignItems: 'center',
    },
  };

  const VendiblesList = useCallback(
    () => (!isEmpty(vendiblesResponse)
      ? (
        <List
          vendiblesObject={vendiblesResponse}
          vendibleType={searchType}
          filtersEnabled={filtersEnabled}
        />
      ) : null),
    [vendiblesResponse],
  );

  const isSearchDisabled = useMemo(
    () => (!!previousSearchInputValue
    && previousSearchInputValue === searchInputValue),
    [previousSearchInputValue, searchInputValue],
  );

  useEffect(() => {
    setHandleGoBack(() => showlExitAppModal);
  }, []);

  const ExitAppDialog = useExitAppDialog(isExitAppModalOpen, handleLogout, onCancelExitApp);

  return (
    <>
      <Header withMenuComponent menuOptions={menuOptions} userInfo={userInfo} />
      <GoBackLink />
      { ExitAppDialog }
      <Grid
        container
        sx={{
          flexDirection: 'row',
        }}
        justifyContent="center"
      >
        <Grid
          container
          item
          height="30%"
          xs={6}
          sx={{
            flexDirection: 'column',
            position: 'sticky',
            'z-index': 100,
          }}
        >
          <Grid
            item
          >
            <SearcherInput
              title={labels.title}
              onSearchClick={handleStartSearch}
              isSearchDisabled={isSearchDisabled}
              searchLabel={!searchInputValue ? sharedLabels.search : ''}
              hasError={!!searchErrorMessage}
              errorMessage={searchErrorMessage}
              inputValue={searchInputValue}
              titleConfig={{
                variant: 'h2',
                color: '#1976d2',
              }}
              searcherConfig={{
                variant: 'outlined',
                sx: { width: '60%' },
              }}
              keyEvents={{
                onKeyUp: handleKeyUp,
                onEnterPressed: handleStartSearch,
              }}
            />
          </Grid>
          <Grid item>
            <FormControl sx={{ mt: '3%' }}>
              <FormLabel>
                {' '}
                <Typography variant="h5">
                  { labels.lookingFor }
                </Typography>

              </FormLabel>
              <RadioList {...radioGroupConfig} />
            </FormControl>
          </Grid>
          {
            filtersEnabled && (
            <Grid item sx={{ mt: '3%' }}>
              <VendiblesFilters
                filtersApplied={lastFiltersApplied}
                setFiltersApplied={setLastFiltersApplied}
                categories={vendiblesResponse.categorias}
                vendibleType={searchType}
                onFiltersApplied={handleStartSearch}
              />
            </Grid>
            )
          }
        </Grid>
        <Layout gridProps={gridProps} isLoading={isLoading}>
          {searchDone && !thereIsNoResults && (
          <Typography variant="h3">
            { searchType === systemConstants.SERVICES && labels.foundServices}
            { searchType === systemConstants.PRODUCTS && labels.foundProducts}
          </Typography>
          )}
          <VendiblesList />
          {
            thereIsNoResults && (
              <StaticAlert
                label={vendiblesLabels.noResultsFound}
                styles={{
                  mt: '2%',
                  fontSize: 'h4.fontSize',
                  '.MuiAlert-icon': {
                    fontSize: '50px;',
                  },
                }}
              />
            )
          }
        </Layout>
      </Grid>
    </>
  );
}

Cliente.propTypes = {
  userInfo: PropTypes.shape(getUserInfoResponseShape).isRequired,
  menuOptions: PropTypes.arrayOf(PropTypes.shape(menuOptionsShape)).isRequired,
  dispatchHandleSearch: PropTypes.func.isRequired,
  handleLogout: PropTypes.func.isRequired,
};

export default Cliente;
