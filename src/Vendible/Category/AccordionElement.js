import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccordionDetails from '@mui/material/AccordionDetails';
import Link from '@mui/material/Link';

class AccordionElement {
  #rootName;

  #root;

  #children;

  #isSuperCategory;

  #onChange;

  #isExpanded;

  constructor(rootName, children, isSuperCategory, onChange, isExpanded, handleCategorySelected) {
    this.#root = isSuperCategory ? (
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>{ rootName }</Typography>
      </AccordionSummary>
    ) : (
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
    this.#children = children;
    this.#isSuperCategory = isSuperCategory;
    this.#onChange = onChange;
    this.#rootName = rootName;
    this.key = `accordeon_${rootName}`;
    this.#isExpanded = isExpanded;
  }

  get root() {
    return this.#root;
  }

  get rootName() {
    return this.#rootName;
  }

  get isSuperCategory() {
    return this.#isSuperCategory;
  }

  set children(children) {
    this.#children = children;
  }

  /** @returns {Array<AccordionElement>} */
  get children() {
    return this.#children;
  }

  set isExpanded(value) {
    this.#isExpanded = value;
  }

  render() {
    return (
      <Accordion
        expanded={this.#isExpanded}
        onChange={this.#onChange()}
        TransitionProps={{ unmountOnExit: true }}
        key={this.key}
      >
        {
                this.#root
        }
        {
                this.#children?.length ? this.children.map((c) => c.render()) : null
        }
      </Accordion>
    );
  }
}

export default AccordionElement;
