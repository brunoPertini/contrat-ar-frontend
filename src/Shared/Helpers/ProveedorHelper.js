import { sharedLabels } from '../../StaticData/Shared';
import {
  PRICE_TYPES, SERVICE_LOCATION_AT_HOME,
  SERVICE_LOCATION_FIXED, PRODUCT_LOCATION_AT_HOME, PRODUCT_LOCATION_FIXED,
} from '../Constants/System';
import { escapeRegExpChars } from '../Utils/InputUtils';

/**
 *
 * @param {{sourceVendibles: Array<T>, term: String}}
 */
export function filterVendiblesByTerm({ sourceVendibles, term }) {
  const regEx = new RegExp(escapeRegExpChars(term), 'i');
  return sourceVendibles.filter((v) => regEx.test(v.vendibleNombre));
}

/**
   *
   * @param {{vendibles: Array<T>, categoryName: String}}
   */
export function filterVendiblesByCategory({ vendibles, categoryName }) {
  return vendibles.filter((vendible) => vendible.categoryNames.includes(categoryName));
}

/**
 *
 * @param {Array<String>} categories
 * @returns {{name: String, parent: Object }} The category hierarchy composed by those in array
 */
export function buildCategoryObject(categories) {
  let category = {};
  const roots = [];
  let i = 0;

  for (i; i < categories.length; i++) {
    roots.push({ name: categories[i] });
  }

  i = 0;

  for (i; i < roots.length; i++) {
    if (i === 0) {
      category = { ...category, ...roots[i] };
    }

    if (i === 1) {
      category = { ...category, parent: { ...roots[i] } };
    }

    if (i === 2) {
      category = {
        ...category,
        parent: {
          ...category.parent,
          parent: {
            ...roots[i],
          },
        },
      };
    }
  }

  return category;
}

/**
 *
 * @param {"FIXED" | "VARIABLE" | "VARIABLE_WITH_AMOUNT"} priceTypeValue
 * @returns {String} Price type in a readable way
 */
export function buildPriceType(priceTypeValue) {
  return PRICE_TYPES[priceTypeValue];
}

export function buildLocationTypesArray(vendibleInfo, vendibleType) {
  const locationTypes = [];

  const actions = {
    servicios: () => {
      if (vendibleInfo.offersDelivery) {
        locationTypes.push(SERVICE_LOCATION_AT_HOME);
      }

      if (vendibleInfo.offersInCustomAddress) {
        locationTypes.push(SERVICE_LOCATION_FIXED);
      }
    },

    productos: () => {
      if (vendibleInfo.offersDelivery) {
        locationTypes.push(PRODUCT_LOCATION_AT_HOME);
      }

      if (vendibleInfo.offersInCustomAddress) {
        locationTypes.push(PRODUCT_LOCATION_FIXED);
      }
    },
  };

  actions[vendibleType]();

  return locationTypes;
}

/**
 *
 * @param {Object} vendibleInfo
 * @param {String} vendibleType
 * @returns The vendible info parsed for being shown at page
 */
export function buildVendibleInfo(vendibleInfo, vendibleType) {
  const locationTypes = buildLocationTypesArray(vendibleInfo, vendibleType);

  const { stock, imagenUrl, descripcion } = vendibleInfo;

  return {
    priceInfo: {
      type: vendibleInfo.tipoPrecio,
      amount: vendibleInfo.precio,
    },
    vendibleLocation: vendibleInfo.location,
    categories: vendibleInfo.categoryNames,
    locationTypes,
    nombre: vendibleInfo.vendibleNombre,
    stock,
    imagenUrl,
    descripcion,
  };
}

export const postStateLabelResolver = {
  IN_REVIEW: sharedLabels.inReview,
  ACTIVE: sharedLabels.activeF,
  INACTIVE: sharedLabels.inactiveF,
  PAUSED: sharedLabels.pausedF,
  REJECTED: sharedLabels.rejectedF,
};
