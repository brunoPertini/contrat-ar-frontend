import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';

class AccordionElement {
  #rootName;

  #root;

  #children;

  #isSuperCategory;

  #onChange;

  constructor(rootName, root, children, isSuperCategory, onChange) {
    this.#root = root;
    this.#children = children;
    this.#isSuperCategory = isSuperCategory;
    this.#onChange = onChange;
    this.#rootName = rootName;
  }

  get root() {
    return this.#root;
  }

  get rootName() {
    return this.#rootName;
  }

  set children(children) {
    this.#children = children;
  }

  /** @returns {Array<AccordionElement>} */
  get children() {
    return this.#children;
  }

  render() {
    return this.#isSuperCategory ? (
      <Accordion onChange={this.#onChange()}>
        {
                this.#root
        }
        {
                this.#children?.length ? this.children.map((c) => c.render()) : null
        }
      </Accordion>
    ) : <Typography>{ this.#root }</Typography>;
  }
}

export default AccordionElement;
