import AccordionDetails from '@mui/material/AccordionDetails';
import Link from '@mui/material/Link';
import CategoryRenderer from './CategoryRenderer';

class LeafRenderer extends CategoryRenderer {
  constructor({
    rootName,
    onChange,
    isExpanded,
    handleCategorySelected,
  }) {
    super({
      rootName,
      onChange,
      isExpanded,
    });
    this.root = (
      <AccordionDetails>
        <Link
          onClick={() => handleCategorySelected(rootName)}
          variant="caption"
          sx={{
            cursor: 'pointer',
          }}
        >
          { rootName }
        </Link>
      </AccordionDetails>
    );
  }
}

export default LeafRenderer;
