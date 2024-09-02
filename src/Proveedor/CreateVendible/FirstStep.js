/* eslint-disable no-new-wrappers */
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import {
  CheckBoxGroup, LocationMap, Select,
} from '../../Shared/Components';
import { proveedorLabels } from '../../StaticData/Proveedor';
import Searcher from '../../Shared/Components/Searcher';
import CategoryInput from './CategoryInput';
import { inputHelperLabels, sharedLabels } from '../../StaticData/Shared';
import {
  ARGENTINA_LOCALE,
  PRICE_TYPES,
  PRICE_TYPE_FIXED, PRICE_TYPE_VARIABLE_WITH_AMOUNT,
  PRODUCTS, PRODUCT_LOCATION_FIXED,
  SERVICES,
  SERVICE_LOCATION_FIXED,
  pricesTypeMock,
  productLocationsMock,
  serviceLocationsMock,
} from '../../Shared/Constants/System';
import { deleteNonNumericCharacters } from '../../Shared/Utils/InputUtils';
import { maxLengthConstraints } from '../../Shared/Constants/InputConstraints';
import { parseVendibleUnit } from '../../Shared/Helpers/UtilsHelper';
import { formatNumberWithLocale, replaceArgentinianCurrencySymbol } from '../../Shared/Helpers/PricesHelper';

function FirstStep({
  nombre, setNombre, locationTypes, setLocationTypes, categories,
  priceInfo, setPriceInfo, setVendibleLocation, stock, setStock,
  setCategories, vendibleType, token, vendibleLocation, isEditionEnabled,
}) {
  const vendibleUnit = useMemo(() => parseVendibleUnit(vendibleType), [vendibleType]);

  const showPriceInput = useMemo(() => {
    const { type } = priceInfo;
    return ((type && (type === PRICE_TYPE_FIXED || type === PRICE_TYPE_VARIABLE_WITH_AMOUNT)));
  }, [priceInfo.type, priceInfo.amount, isEditionEnabled]);

  const defaultPriceTypeSelected = useMemo(() => {
    if (priceInfo.type) {
      const priceLabel = PRICE_TYPES[priceInfo.type];
      return pricesTypeMock.findIndex((priceType) => priceType === priceLabel);
    }

    return 0;
  }, []);

  const {
    shouldRenderStock,
    locationTypesMock,
  } = useMemo(() => (vendibleType === PRODUCTS.toLowerCase()
    ? { shouldRenderStock: true, locationTypesMock: productLocationsMock }
    : { shouldRenderStock: false, locationTypesMock: serviceLocationsMock }), [vendibleType]);

  const handleSetLoation = ({ coords }) => {
    const newCoordinates = {
      coordinates: [coords.latitude, coords.longitude],
    };
    setVendibleLocation(newCoordinates);
  };

  const onChangePriceInfo = ({ priceAmount, priceType }) => {
    if (priceAmount !== undefined) {
      setPriceInfo((currentPriceInfo) => ({
        ...currentPriceInfo,
        amount: priceAmount,
      }));
    }

    if (priceType !== undefined) {
      setPriceInfo((currentPriceInfo) => ({
        ...currentPriceInfo,
        type: Object.keys(PRICE_TYPES).find((key) => PRICE_TYPES[key] === priceType),
      }));
    }
  };

  /** @param {Array} newCategories */
  const onSetCategories = ({ newCategories }) => {
    setCategories(newCategories);
  };

  const onChangePriceAmount = (event) => {
    const formattedString = deleteNonNumericCharacters(
      replaceArgentinianCurrencySymbol(event.target.value),
    );
    const valueNumber = formattedString ? new Number(formattedString) : 0;
    // TODO: desharcodear el locale
    onChangePriceInfo({ priceAmount: valueNumber.toLocaleString(ARGENTINA_LOCALE) });
  };

  const onChangeStock = (event) => {
    const formattedString = deleteNonNumericCharacters(
      replaceArgentinianCurrencySymbol(event.target.value),
    );
    const valueNumber = formattedString ? new Number(formattedString) : 0;
    setStock(valueNumber.toLocaleString(ARGENTINA_LOCALE));
  };

  const gridConfig = {
    productos: {
      xs: [6, 6],
      showLocationColumn: true,
      showMap: locationTypes.includes(PRODUCT_LOCATION_FIXED),
    },

    servicios: {
      xs: [4, 8],
      showLocationColumn: true,
      showMap: locationTypes.includes(SERVICE_LOCATION_FIXED),
    },
  };

  const { nameFieldTitle, nameFieldPlaceholder, searchLabel } = useMemo(() => ({
    nameFieldTitle: isEditionEnabled ? null : (
      <Typography variant="h4">
        {proveedorLabels.nameOfYourVendible.replace('{vendible}', vendibleUnit)}
      </Typography>
    ),
    nameFieldPlaceholder: isEditionEnabled ? proveedorLabels.nameOfYourVendible
      : proveedorLabels['addVendible.name.text'].replace('{vendible}', vendibleUnit),

    searchLabel: !isEditionEnabled ? inputHelperLabels.required : inputHelperLabels.nonEditable,
  }), [isEditionEnabled]);

  const categoriesSection = (
    <Grid item sx={{ mt: '5%' }}>
      <Typography variant="h4">
        {proveedorLabels['addVendible.category.title'].replace('{vendible}', vendibleUnit)}
      </Typography>
      <Typography
        dangerouslySetInnerHTML={{
          __html: proveedorLabels['addVendible.category.text']
            .replace('{vendible}', vendibleUnit)
            .replace('{ejemploCategorias}', proveedorLabels[`addVendible.category.${vendibleType}.example`]),
        }}
        textAlign="justify"
        sx={{ paddingRight: '5px', width: '70%' }}
      />
      <CategoryInput
        onCategoriesSet={onSetCategories}
        defaultValues={categories}
        searcherProps={{
          searchLabel: inputHelperLabels.addAtLeastOne,
          required: true,
        }}
      />
    </Grid>
  );

  const priceSection = (
    <>
      <Typography variant="h4">
        {sharedLabels.price}
      </Typography>
      <Typography
        dangerouslySetInnerHTML={{
          __html: proveedorLabels['addVendible.price.text'].replace(/{vendible}/ig, vendibleUnit),
        }}
        textAlign="justify"
        sx={{ paddingRight: '5px', width: '70%' }}
      />
      <Select
        containerStyles={{ mt: '2%', width: '50%' }}
        label={sharedLabels.priceType}
        values={pricesTypeMock}
        defaultSelected={defaultPriceTypeSelected}
        handleOnChange={(value) => onChangePriceInfo({ priceType: value })}
      />
      {showPriceInput && (
      <TextField
        sx={{ mt: '2%' }}
        type="text"
        label={sharedLabels.price}
        onChange={onChangePriceAmount}
        value={formatNumberWithLocale(priceInfo.amount)}
        inputProps={{
          maxLength: maxLengthConstraints.PROVEEDOR['priceInfo.amount'],
        }}
        helperText={inputHelperLabels.onlyIntNumbers}
      />
      )}
    </>
  );

  return (
    <Grid item display="flex" flexDirection="row" xs={10}>
      <Grid item flexDirection="column" xs={gridConfig[vendibleType].xs[0]}>
        <Searcher
          title={nameFieldTitle}
          placeholder={nameFieldPlaceholder}
          searchLabel={searchLabel}
          searcherConfig={{
            sx: {
              width: '70%',
            },
          }}
          inputValue={nombre}
          autoFocus
          required={!isEditionEnabled}
          keyEvents={{ onKeyUp: setNombre }}
          inputProps={{
            maxLength: maxLengthConstraints.PROVEEDOR.nombre,
            readOnly: isEditionEnabled,
          }}
        />
        {
          !isEditionEnabled ? categoriesSection : priceSection
        }
        {
          shouldRenderStock && (
            <Box sx={{ mt: '5%' }}>
              <Typography variant="h4">
                { proveedorLabels['addVendible.stock'] }
              </Typography>
              <TextField
                type="number"
                label={sharedLabels.stock}
                onChange={onChangeStock}
                value={stock}
              />
            </Box>
          )
        }
      </Grid>
      <Grid item flexDirection="column" xs={gridConfig[vendibleType].xs[1]}>
        {
          !isEditionEnabled && priceSection
        }
        {gridConfig[vendibleType].showLocationColumn && (
        <>
          <Typography sx={{ mt: '5%' }}>
            {proveedorLabels['addVendible.location.text'][vendibleType]}
          </Typography>
          <CheckBoxGroup
            defaultChecked={locationTypes}
            elements={locationTypesMock}
            handleChange={setLocationTypes}
          />
          {
            gridConfig[vendibleType].showMap && (
              <>
                <Box display="flex" flexDirection="column">
                  <Typography
                    dangerouslySetInnerHTML={{
                      __html: proveedorLabels['addVendible.location.disclaimer'][vendibleType],
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
            )
          }

        </>
        )}
      </Grid>
    </Grid>
  );
}

FirstStep.defaultProps = {
  setCategories: () => {},
  locationTypes: [],
  categories: [],
  isEditionEnabled: false,
};

FirstStep.propTypes = {
  nombre: PropTypes.string.isRequired,
  setNombre: PropTypes.func.isRequired,
  setLocationTypes: PropTypes.func.isRequired,
  priceInfo: PropTypes.shape({
    type: PropTypes.string,
    amount: PropTypes.number,
  }).isRequired,
  setPriceInfo: PropTypes.func.isRequired,
  setVendibleLocation: PropTypes.func.isRequired,
  vendibleType: PropTypes.oneOf([PRODUCTS.toLowerCase(), SERVICES.toLowerCase()]).isRequired,
  locationTypes: PropTypes.arrayOf(PropTypes.string),
  categories: PropTypes.arrayOf(PropTypes.string),
  setCategories: PropTypes.func,
  vendibleLocation: PropTypes.shape({
    coordinates: PropTypes.arrayOf(PropTypes.number),
  }).isRequired,
  token: PropTypes.string.isRequired,
  stock: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(String)]).isRequired,
  setStock: PropTypes.func.isRequired,
  isEditionEnabled: PropTypes.bool,
};

export default FirstStep;
