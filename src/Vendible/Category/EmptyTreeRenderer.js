import AccordionSummary from '@mui/material/AccordionSummary';
import Link from '@mui/material/Link';
import CategoryRenderer from './CategoryRenderer';

class EmptyTreeRenderer extends CategoryRenderer {
  constructor({
    rootName,
    rootId,
    isExpanded,
    handleCategorySelected,
  }) {
    super({
      rootName,
      rootId,
      isExpanded,
    });
    this.root = (
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
