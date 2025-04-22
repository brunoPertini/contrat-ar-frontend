import Link from '@mui/material/Link';
import Checkbox from '@mui/material/Checkbox';
import { labels } from '../StaticData/LocationMap';
import { sharedLabels } from '../StaticData/Shared';
import { PRICE_TYPES } from '../Shared/Constants/System';
import { formatNumberWithLocale, getLocaleCurrencySymbol } from '../Shared/Helpers/PricesHelper';
import { postStateLabelResolver } from '../Shared/Helpers/ProveedorHelper';
import { Select } from '../Shared/Components';
import { adminLabels } from '../StaticData/Admin';
import { getPlanLabel } from '../Shared/Helpers/PlanesHelper';

// TODO: train a IA to translate these values?
const changeRequestEntityTranslator = {
  proveedor_vendible: adminLabels['changeRequest.entity.translators'].proveedor_vendible,
  suscripcion: adminLabels['changeRequest.entity.translators'].suscripcion,
};

// TODO: train a IA to translate these values?
const changeRequestAttributeTranslator = {
  state: (value) => `${sharedLabels.state}:${postStateLabelResolver[value]}`,
  plan: (value) => `${sharedLabels.plan}:${getPlanLabel(value)}`,
};

export const ATTRIBUTES_RENDERERS = {
  text: (attribute) => attribute,
  image: (attribute) => (
    <Link
      sx={{ cursor: 'pointer' }}
      onClick={() => window.open(attribute, '_blank')}
    >
      { attribute }
      ,
    </Link>
  ),
  map: (onLinkClick) => (onLinkClick ? (
    <Link
      sx={{ cursor: 'pointer' }}
      onClick={() => onLinkClick()}
    >
      { labels.openMapInModal }
    </Link>
  ) : <span>-</span>),
  link: (label, onClick) => (
    <Link
      sx={{ cursor: 'pointer' }}
      onClick={() => onClick()}
    >
      { label }
    </Link>
  ),
  boolean: (attribute) => (
    <Checkbox
      checked={attribute}
    />
  ),
  enum: (attribute, attributeValue, additionalProps) => {
    const enumAttributes = {
      plan: () => sharedLabels.plansNames[attributeValue],
      tipoPrecio: () => PRICE_TYPES[attributeValue],
      category: () => (
        <span dangerouslySetInnerHTML={{ __html: `${attributeValue.name}<br>(id: ${attributeValue.id})` }} />
      ),
      precio: () => `${getLocaleCurrencySymbol('es-AR')}${formatNumberWithLocale(attributeValue)}`,
      stock: () => `${formatNumberWithLocale(attributeValue)}`,
      wasApplied: () => (attributeValue ? sharedLabels.yes : sharedLabels.no),
      attributes: () => {
        const [attributeKey, attributeInnerValue] = attributeValue.split('=');
        return (attributeKey in changeRequestAttributeTranslator)
          ? changeRequestAttributeTranslator[attributeKey](attributeInnerValue.replace(/'/g, '')) : attributeValue;
      },
      sourceTableIdNames: () => attributeValue.join(','),
      sourceTableIds: () => attributeValue.join(','),
      sourceTable: () => changeRequestEntityTranslator[attributeValue] || attributeValue,
      state: () => {
        const statesValues = [...Object.values(postStateLabelResolver)];

        const {
          onChange, selectedValue, proveedorId, selectedProveedorId,
        } = additionalProps.state;

        const getStateKey = (stateValue) => Object.keys(postStateLabelResolver)
          .find((s) => postStateLabelResolver[s] === stateValue);

        // If this post proveedorId matches with the selected one, have to show that value.
        // Otherwise, show the original value
        const isValueSet = proveedorId === selectedProveedorId;

        return (
          <Select
            defaultSelected={statesValues
              .findIndex((s) => postStateLabelResolver[isValueSet
                ? selectedValue : attributeValue] === s)}
            label={sharedLabels.postState}
            values={statesValues}
            handleOnChange={(value) => onChange('state', getStateKey(value))}
          />
        );
      },
    };

    return enumAttributes[attribute]();
  },
};
