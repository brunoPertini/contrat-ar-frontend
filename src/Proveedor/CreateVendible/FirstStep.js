/* eslint-disable no-unused-vars */
import PropTypes, { number } from 'prop-types';
import { useMemo } from 'react';
import {
  Box, Grid, TextField, Typography,
} from '@mui/material';
import {
  CheckBoxGroup, LocationMap, Select,
} from '../../Shared/Components';
import { proveedorLabels } from '../../StaticData/Proveedor';
import Searcher from '../../Shared/Components/Searcher';
import CategoryInput from './CategoryInput';
import { sharedLabels } from '../../StaticData/Shared';
import {
  PRICE_TYPE_FIXED, PRICE_TYPE_VARIABLE, PRICE_TYPE_VARIABLE_WITH_AMOUNT,
  PRODUCT,
  SERVICE,
  SERVICE_LOCATION_AT_HOME, SERVICE_LOCATION_FIXED,
} from '../../Shared/Constants/System';
import { stringHasOnlyNumbers } from '../../Shared/Utils/InputUtils';

const pricesTypeMock = [PRICE_TYPE_FIXED, PRICE_TYPE_VARIABLE, PRICE_TYPE_VARIABLE_WITH_AMOUNT];

const serviceLocationsMock = [SERVICE_LOCATION_AT_HOME, SERVICE_LOCATION_FIXED];

function FirstStep({
  nombre, setNombre, locationTypes, setLocationTypes,
  priceInfo, setPriceInfo, setVendibleLocation,
  setCategories, vendibleType, token, vendibleLocation,
}) {
  const showPriceInput = useMemo(() => {
    const { type } = priceInfo;
    return type && (type === PRICE_TYPE_FIXED || type === PRICE_TYPE_VARIABLE_WITH_AMOUNT);
  }, [priceInfo]);

  const handleSetLoation = ({ coords }) => {
    const newCoordinates = {
      coordinates: [coords.latitude, coords.longitude],
    };
    setVendibleLocation(newCoordinates);
  };

  const onChangePriceInfo = ({ priceAmount, priceType }) => {
    setPriceInfo((currentPriceInfo) => ({
      ...currentPriceInfo,
      type: priceType || currentPriceInfo.type,
      amount: priceAmount,
    }));
  };

  /** @param {Array} newCategories */
  const onSetCategories = ({ newCategories }) => {
    setCategories(newCategories);
  };

  const gridConfig = {
    producto: {
      xs: [6, 6],
      showLocationColumn: false,
    },

    servicio: {
      xs: [4, 8],
      showLocationColumn: true,
    },
  };

  return (
    <Grid item display="flex" flexDirection="row" xs={12}>
      <Grid item flexDirection="column" spacing={5} xs={gridConfig[vendibleType].xs[0]}>
        <Grid item>
          <Searcher
            title={(
              <Typography variant="h4">
                {proveedorLabels.nameOfYourVendible.replace('{vendible}', vendibleType)}
              </Typography>
    )}
            placeholder={proveedorLabels['addVendible.name.text'].replace('{vendible}', vendibleType)}
            searcherConfig={{
              sx: {
                width: '50%',
              },
            }}
            inputValue={nombre}
            keyEvents={{ onKeyUp: setNombre }}
          />
        </Grid>
        <Grid item sx={{ mt: '5%' }}>
          <Typography variant="h4">
            {proveedorLabels['addVendible.category.title'].replace('{vendible}', vendibleType)}
          </Typography>
          <Typography
            dangerouslySetInnerHTML={{
              __html: proveedorLabels['addVendible.category.text'].replace('{vendible}', vendibleType),
            }}
            textAlign="justify"
            sx={{ paddingRight: '5px', width: '70%' }}
          />
          <CategoryInput onCategoriesSet={onSetCategories} />
        </Grid>
      </Grid>
      <Grid item flexDirection="column" xs={gridConfig[vendibleType].xs[1]}>
        <Typography variant="h4">
          {sharedLabels.price}
        </Typography>
        <Typography
          dangerouslySetInnerHTML={{
            __html: proveedorLabels['addVendible.price.text'].replace(/{vendible}/ig, vendibleType),
          }}
          textAlign="justify"
          sx={{ paddingRight: '5px', width: '70%' }}
        />
        <Select
          containerStyles={{ mt: '2%', width: '50%' }}
          label={sharedLabels.priceType}
          values={pricesTypeMock}
          handleOnChange={(value) => onChangePriceInfo({ priceType: value })}
        />
        {showPriceInput && (
        <TextField
          sx={{ mt: '2%' }}
          autoFocus
          type="number"
          label={sharedLabels.price}
          onChange={(event) => {
            const { value } = event.target;
            if (stringHasOnlyNumbers(value) || !value) {
              onChangePriceInfo({ priceAmount: value });
            }
          }}
          value={priceInfo.amount}
        />
        )}
        {gridConfig[vendibleType].showLocationColumn && (
        <>
          <Typography sx={{ mt: '5%' }}>
            {proveedorLabels['addVendible.location.text']}
          </Typography>
          <CheckBoxGroup
            elements={serviceLocationsMock}
            handleChange={setLocationTypes}
          />
          <Box display="flex" flexDirection="column">
            <Typography
              dangerouslySetInnerHTML={{
                __html: proveedorLabels['addVendible.location.disclaimer'],
              }}
              textAlign="justify"
              sx={{ paddingRight: '5px', width: '70%' }}
            />
          </Box>
          <LocationMap
            showTranslatedAddress
            location={{
              coords: {
                latitude: vendibleLocation.coordinates[0],
                longitude: vendibleLocation.coordinates[1],
              },
            }}
            setLocation={handleSetLoation}
            containerStyles={{
              width: '50%',
              height: '50%',
            }}
            token={token}
          />

        </>
        )}
      </Grid>
    </Grid>
  );
}

FirstStep.propTypes = {
  nombre: PropTypes.string.isRequired,
  setNombre: PropTypes.func.isRequired,
  locationTypes: PropTypes.oneOf(serviceLocationsMock).isRequired,
  setLocationTypes: PropTypes.func.isRequired,
  priceInfo: PropTypes.shape({
    type: PropTypes.string,
    amount: PropTypes.number,
  }).isRequired,
  setPriceInfo: PropTypes.func.isRequired,
  setVendibleLocation: PropTypes.func.isRequired,
  vendibleType: PropTypes.oneOf([PRODUCT.toLowerCase(), SERVICE.toLowerCase()]).isRequired,
  setCategories: PropTypes.func.isRequired,
  vendibleLocation: PropTypes.shape({
    coordinates: PropTypes.arrayOf(number),
  }).isRequired,
  token: PropTypes.string.isRequired,
};

export default FirstStep;
