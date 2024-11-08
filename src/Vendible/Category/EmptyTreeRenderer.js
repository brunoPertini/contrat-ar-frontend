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
      <ul>
        <li>
          <Link
            variant="caption"
            sx={{
              cursor: 'pointer',
              color: '#f5c242',
            }}
            onClick={() => handleCategorySelected(rootId, rootName)}
          >
            { rootName }
          </Link>
        </li>
      </ul>
    )
      : (
        <AccordionSummary onClick={() => handleCategorySelected(rootId, rootName)}>
          <Link
            sx={{
              cursor: 'pointer',
              color: '#f5c242',
            }}
          >
            { rootName }
          </Link>
        </AccordionSummary>
      );
  }
}

export default EmptyTreeRenderer;
