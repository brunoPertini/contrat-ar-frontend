import AccordionDetails from '@mui/material/AccordionDetails';
import Link from '@mui/material/Link';
import CategoryRenderer from './CategoryRenderer';

class LeafRenderer extends CategoryRenderer {
  constructor({
    rootName,
    rootId,
    onChange,
    isExpanded,
    handleCategorySelected,
  }) {
    super({
      rootName,
      rootId,
      onChange,
      isExpanded,
    });
    this.root = (
      <AccordionDetails>
        <Link
          onClick={() => handleCategorySelected(rootId, rootName)}
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
