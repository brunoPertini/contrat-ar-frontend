import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import Alert from '@mui/material/Alert';
import Header from '../../Header';
import { List, RadioList, Layout } from '../../Shared/Components';
import { systemConstants } from '../../Shared/Constants';
import { sharedLabels } from '../../StaticData/Shared';
import { isEnterPressed, isKeyEvent } from '../../Shared/Utils/DomUtils';
import { labels } from '../../StaticData/Cliente';
import { vendiblesLabels } from '../../StaticData/Vendibles';

function Cliente({
  menuOptions, dispatchHandleSearch,
}) {
  const [searchErrorMessage, setErrorMessage] = useState('');

  const [searchInputValue, setSearchInputValue] = useState('');
  const [searchType, setSearchType] = useState(systemConstants.PRODUCTS);

  const [vendibles, setVendibles] = useState([]);

  const [searchDone, setSearchDone] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [thereIsNoResults, setThereIsNoResults] = useState(false);

  const handleSetSearchType = (event) => {
    setSearchInputValue('');
    setVendibles([]);
    setSearchDone(false);
    setThereIsNoResults(false);
    setSearchType(event.target.value);
  };

  const handleStartSearch = (event) => {
    if ((isKeyEvent(event) && isEnterPressed(event)) || !isKeyEvent(event)) {
      if (searchInputValue) {
        setIsLoading(true);
        setErrorMessage('');
        const params = { searchType, searchInput: searchInputValue };
        setTimeout(() => {
          dispatchHandleSearch(params).then((vendiblesResponse) => {
            setSearchDone(true);
            setVendibles(vendiblesResponse);
            if (!vendiblesResponse.length) {
              setThereIsNoResults(true);
            } else {
              setThereIsNoResults(false);
            }
          })
            .catch((errorMessage) => {
              setErrorMessage(errorMessage);
            })
            .finally(() => {
              setIsLoading(false);
            });
        }, 3000);
      } else {
        setErrorMessage(labels.searchErrorMessage);
      }
    }
  };

  const handleSearchDone = (event) => {
    setSearchInputValue(event.target.value);
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

  const VendiblesList = useCallback(() => (vendibles?.length
    ? <List items={vendibles} vendibleType={searchType} /> : null), [vendibles]);

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
        <Grid
          container
          item
          height="30%"
          xs={6}
          sx={{
            flexDirection: 'column',
            position: 'sticky',
            top: 130,
            'z-index': 100,
          }}
        >
          <Grid
            item
          >
            <Typography variant="h2" color="#1976d2">
              { labels.title }
            </Typography>
            <FormControl fullWidth variant="outlined">
              <TextField
                autoFocus
                id="vendible-input"
                type="text"
                InputProps={{
                  endAdornment: (
                    <IconButton
                      aria-label="search-input"
                      edge="end"
                      onClick={handleStartSearch}
                    >
                      <SearchOutlinedIcon />
                    </IconButton>
                  ),
                }}
                label={!searchInputValue ? sharedLabels.search : ''}
                onChange={handleSearchDone}
                onKeyUp={handleStartSearch}
                error={!!searchErrorMessage}
                helperText={searchErrorMessage}
                value={searchInputValue}
              />
            </FormControl>
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
        </Grid>
        <Layout gridProps={gridProps} isLoading={isLoading}>
          {searchDone && !thereIsNoResults && (
          <Typography variant="h3">
            { searchType === systemConstants.SERVICES && labels.foundServices}
            { searchType === systemConstants.PRODUCTS && labels.foundProducts}
          </Typography>
          )}
          <VendiblesList />
          { thereIsNoResults
          && (
          <Alert
            severity="info"
            variant="filled"
            sx={{
              mt: '2%',
              fontSize: 'h4.fontSize',
              '.MuiAlert-icon': {
                fontSize: '50px;',
              },
            }}
          >
            { vendiblesLabels.noResultsFound}
          </Alert>
          ) }
        </Layout>
      </Grid>
    </>
  );
}

Cliente.propTypes = {
  menuOptions: PropTypes.arrayOf(PropTypes.shape({
    component: PropTypes.elementType,
    props: PropTypes.object,
  })).isRequired,
  dispatchHandleSearch: PropTypes.func.isRequired,
};

export default Cliente;
