/* eslint-disable no-unused-vars */
import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import UserAccountOptions from '../../Shared/Components/UserAccountOptions';
import { labels } from '../../StaticData/Cliente';
import Header from '../../Header';
import { sharedLabels } from '../../StaticData/Shared';
import { List, RadioList } from '../../Shared/Components';
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
        src: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      },
    },
    {
      title: 'Bocha de libros',
      text: 'fdkjdshkdjshfkdsjfhkjsdhfkjsdhfkjdshfkjdshfkjdshfkdsj',
      image: {
        src: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGJvb2t8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
      },
    },
    {
      title: 'Libro en ventanita',
      text: 'fgdfsgfdsgsfdsdflkjgshdfkjhgdfkjhjhkkkkkkkkkkjhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhkdffdggfdgdf',
      image: {
        src: 'https://images.unsplash.com/photo-1495640388908-05fa85288e61?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGJvb2t8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
      },
    },
  ];

  const handleSearchDone = (event) => {
    if (isClickEvent(event) || isEnterPressed(event)) {
      setSearchDone(true);
    }
  };

  const handleSetSearchType = (event) => {
    setSearchDone(false);
    setSearchType(event.target.value);
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
            <FormControl>
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
        { searchDone && (
        <Grid
          container
          item
          xs={6}
          sx={{
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography variant="h3">
            { searchType === systemConstants.SERVICES && labels.foundServices}
            { searchType === systemConstants.PRODUCTS && labels.foundProducts}
          </Typography>
          <List items={searchType === systemConstants.SERVICES ? services : products} />
        </Grid>
        )}
      </Grid>
    </>
  );
}

export default ClienteContainer;
