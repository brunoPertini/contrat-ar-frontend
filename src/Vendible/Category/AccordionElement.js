import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';

class AccordionElement {
  #root;

  #children;

  #isSuperCategory;

  #onChange;

  constructor(root, children, isSuperCategory, onChange) {
    this.#root = root;
    this.#children = children;
    this.#isSuperCategory = isSuperCategory;
    this.#onChange = onChange;
  }

  get root() {
    return this.#root;
  }

  set children(children) {
    this.#children = children;
  }

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
                this.#children
        }
      </Accordion>
    ) : <Typography>{ this.#root }</Typography>;
  }
}

export default AccordionElement;
