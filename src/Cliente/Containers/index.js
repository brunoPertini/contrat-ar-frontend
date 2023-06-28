/* eslint-disable no-unused-vars */
import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import UserAccountOptions from '../../Shared/Components/UserAccountOptions';
import { labels } from '../../StaticData/Cliente';
import Header from '../../Header';
import { sharedLabels } from '../../StaticData/Shared';
import { List } from '../../Shared/Components';
import { isClickEvent, isEnterPressed } from '../../Shared/Utils/DomUtils';
import { systemConstants } from '../../Shared/Constants';

function ClienteContainer() {
  const [searchDone, setSearchDone] = useState(false);
  const [searchType, setSearchType] = useState(systemConstants.PRODUCTS);

  const menuOptions = [{
    component: UserAccountOptions,
    props: { userInfo: { name: 'Bruno' } },
  }];

  const services = [
    {
      title: 'Veterinario',
      text: 'jkdfjkdjfkdjfkdjflkjlkjlkjlkjlkjlkjkljlkjkljkljkljlkjkljlkjlkjlkjlkj',
      image: {
        src: 'https://images.unsplash.com/photo-1544197807-bb503430e22d?ixlib=rb-4.0.3&dpr=1&auto=format&fit=crop&q=60&w=400&h=400',
      },
    },
    {
      title: 'Relojero',
      text: 'gfdlkjgdflkgjdflkgjdflkgjdfgfgfdgggdgd',
      image: {
        src: 'https://images.unsplash.com/photo-1541480601022-2308c0f02487?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8Mnx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=60&h=400',
      },
    },
  ];

  const products = [
    {
      title: 'Libro y cafecito',
      text: 'gffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
      image: {
        src: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8Nnx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
      },
    },
    {
      title: 'Libro negro',
      text: 'dfggfffffffffffffffffffffffffffffff',
      image: {
        src: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8Nnx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
      },
    },
  ];

  const handleSearchDone = (event) => {
    if (isClickEvent(event) || isEnterPressed(event)) {
      setSearchDone(true);
    }
  };

  const handleSetSearchType = (event) => {
    setSearchType(event.target.value);
  };

  return (
    <>
      <Header withMenuComponent menuOptions={menuOptions} />
      <Grid
        container
        sx={{
          marginTop: '5%',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {
          !searchDone && (
            <>
              <Grid item>
                <Typography variant="h2" color="#1976d2">
                  { labels.title }
                </Typography>
              </Grid>
              <Grid
                item
                sx={{ mt: '2%' }}
              >
                <FormControl>
                  <FormLabel>
                    {' '}
                    <Typography variant="h5">
                      { labels.lookingFor }
                    </Typography>

                  </FormLabel>
                  <RadioGroup
                    onChange={handleSetSearchType}
                    defaultValue={systemConstants.PRODUCTS}
                    name="radio-buttons-group"
                    row
                  >
                    <FormControlLabel
                      value={systemConstants.PRODUCTS}
                      control={(
                        <Radio sx={{
                          '& .MuiSvgIcon-root': {
                            fontSize: 50,
                          },
                        }}
                        />
                )}
                      label={sharedLabels.product}
                    />
                    <FormControlLabel
                      value={systemConstants.SERVICES}
                      control={(
                        <Radio sx={{
                          '& .MuiSvgIcon-root': {
                            fontSize: 50,
                          },
                        }}
                        />
                )}
                      label={sharedLabels.service}
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid
                item
                sx={{
                  width: '40%',
                  mt: '2%',
                }}
              >
                <FormControl fullWidth variant="outlined">
                  <InputLabel>
                    {sharedLabels.search}
                  </InputLabel>
                  <OutlinedInput
                    id="vendible-input"
                    type="text"
                    endAdornment={(
                      <IconButton
                        aria-label="search-input"
                        edge="end"
                        onClick={handleSearchDone}
                      >
                        <SearchOutlinedIcon />
                      </IconButton>
)}
                    label={sharedLabels.search}
                    onKeyUp={handleSearchDone}
                  />
                </FormControl>
              </Grid>
            </>
          )
        }
        { searchDone && (
        <>
          <Typography variant="h3">
            { searchType === systemConstants.SERVICES && labels.foundServices}
            { searchType === systemConstants.PRODUCTS && labels.foundProducts}
          </Typography>
          <List items={services} />
        </>
        )}
      </Grid>
    </>
  );
}

export default ClienteContainer;
