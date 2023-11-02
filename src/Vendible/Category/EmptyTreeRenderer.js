import AccordionSummary from '@mui/material/AccordionSummary';
import Link from '@mui/material/Link';
import CategoryRenderer from './CategoryRenderer';

class EmptyTreeRenderer extends CategoryRenderer {
  constructor({
    rootName,
    isExpanded,
    handleCategorySelected,
  }) {
    super({
      rootName,
      isExpanded,
    });
    this.root = (
      <AccordionSummary onClick={() => handleCategorySelected(rootName)}>
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
