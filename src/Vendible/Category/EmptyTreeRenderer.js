/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import AccordionSummary from '@mui/material/AccordionSummary';
import Link from '@mui/material/Link';
import CategoryRenderer from './CategoryRenderer';

class EmptyTreeRenderer extends CategoryRenderer {
  constructor({
    rootName,
    rootId,
    isExpanded,
    handleCategorySelected,
    renderAsList,
  }) {
    super({
      rootName,
      rootId,
      isExpanded,
      renderAsList,
    });
    this.root = this.renderAsList ? (
      <li onClick={() => handleCategorySelected(rootId, rootName)}>
        { rootName }
      </li>
    )
      : (
        <AccordionSummary onClick={() => handleCategorySelected(rootId, rootName)}>
          <Link
            sx={{
              cursor: 'pointer',
            }}
          >
            { rootName }
          </Link>
        </AccordionSummary>
      );
  }
}

export default EmptyTreeRenderer;
