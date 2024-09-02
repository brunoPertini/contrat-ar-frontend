import Link from '@mui/material/Link';
import Checkbox from '@mui/material/Checkbox';
import { labels } from '../StaticData/LocationMap';
import { sharedLabels } from '../StaticData/Shared';
import { PRICE_TYPES } from '../Shared/Constants/System';
import { formatNumberWithLocale, getLocaleCurrencySymbol } from '../Shared/Helpers/PricesHelper';

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
  enum: (attribute, attributeValue) => {
    const enumAttributes = {
      plan: () => sharedLabels.plansNames[attributeValue],
      tipoPrecio: () => PRICE_TYPES[attributeValue],
      category: () => <span dangerouslySetInnerHTML={{ __html: `${attributeValue.name}<br>(id: ${attributeValue.id})` }} />,
      precio: () => `${getLocaleCurrencySymbol('es-AR')}${formatNumberWithLocale(attributeValue)}`,
      stock: () => `${formatNumberWithLocale(attributeValue)}`,
    };

    return enumAttributes[attribute]();
  },
};
