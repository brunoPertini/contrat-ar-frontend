import PropTypes from 'prop-types';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import RootRenderer from './RootRenderer';
import EmptyTreeRenderer from './EmptyTreeRenderer';
import LeafRenderer from './LeafRenderer';
import { SearcherInput } from '../../Shared/Components';
import { sharedLabels } from '../../StaticData/Shared';
import { EMPTY_FUNCTION } from '../../Shared/Constants/System';
import { splitArrayIntoChunks } from '../../Shared/Helpers/UtilsHelper';

function processChild(childRoot, handleCategorySelected) {
  const { root, rootId, children } = childRoot;

  const isSuperCategory = !!(children.length);

  const childrenJsx = [];

  children.forEach((childrenRoot) => {
    childrenJsx.push(processChild(childrenRoot, handleCategorySelected));
  });

  return isSuperCategory ? new RootRenderer({
    rootName: root, rootId, children: childrenJsx, renderAsList: true,
  }) : new LeafRenderer({
    rootName: root,
    rootId,
    handleCategorySelected,
    renderAsList: true,
  });
}

/**
 * @typedef CategoryHierarchy
 * @type {Object}
 * Category hierarchy model
 * @property {String} root
 * @property {Number} rootId
 * @property {Array<CategoryHierarchy>} children
 */

/**
 * @typedef CategoryResponse
 * @type {Object}
 * @property {String}
 * @property {Array<CategoryHierarchy>}
 */

/**
 *
 * @param {CategoryResponse}  sourceCategories
 * @param {String} term
 * @returns {CategoryResponse} hierarchies containing a category matching the term
 */
function searchCategoriesMatchingTerm(sourceCategories, term) {
  const newCategories = {};
  const regEx = new RegExp(term, 'i');

  Object.keys(sourceCategories).forEach((vendibleName) => {
    let found = null;
    sourceCategories[vendibleName].forEach((hierarchyRoot) => {
      const queue = [hierarchyRoot];

      while (queue.length && !found) {
        const current = queue.shift();

        if (current.root.match(regEx)) {
          found = current;
        }

        current.children.forEach((child) => queue.unshift(child));
      }

      if (found) {
        if (!newCategories[vendibleName]) {
          newCategories[vendibleName] = [hierarchyRoot];
        } else {
          newCategories[vendibleName].push(hierarchyRoot);
        }
      }
    });
  });

  return newCategories;
}

const buildCategoriesToRender = ({
  sourceObject,
  handleCategorySelected,
  columnLimit,
  setFilteredCategories,
}) => {
  const firstCategoriesSections = [];

  const processHierarchy = (hierarchy) => {
    const { root, rootId, children } = hierarchy;

    const isSuperCategory = !!(children.length);

    const childrenJsx = [];

    children.forEach((childrenRoot) => {
      childrenJsx.push(processChild(childrenRoot, handleCategorySelected));
    });

    const element = isSuperCategory ? new RootRenderer({
      rootName: root, rootId, children: childrenJsx, renderAsList: true,
    })
      : new EmptyTreeRenderer({
        handleCategorySelected,
        rootName: root,
        rootId,
        renderAsList: true,
      });

    firstCategoriesSections.push(element);
  };

  Object.values(sourceObject).forEach((hierarchiesList) => {
    hierarchiesList.forEach((hierarchy) => {
      processHierarchy(hierarchy);
    });
  });

  const chunkedCategories = splitArrayIntoChunks(firstCategoriesSections, columnLimit);

  chunkedCategories.sort((a, b) => b.length - a.length);

  setFilteredCategories(chunkedCategories);
};

function CategoryModal({
  open, handleClose, categories, columnLimit, handleCategorySelected,
}) {
  const [filteredCategories, setFilteredCategories] = useState([]);

  const [searchTerm, setSearchTerm] = useState();

  useEffect(() => {
    buildCategoriesToRender({
      sourceObject: categories,
      handleCategorySelected,
      columnLimit,
      setFilteredCategories,
    });
  }, [categories, handleCategorySelected]);

  const filterCategories = () => {
    if (!searchTerm) {
      return buildCategoriesToRender({
        sourceObject: categories,
        handleCategorySelected,
        columnLimit,
        setFilteredCategories,
      });
    }
    const newFilteredCategories = searchCategoriesMatchingTerm(categories, searchTerm);

    return buildCategoriesToRender({
      sourceObject: newFilteredCategories,
      handleCategorySelected,
      columnLimit,
      setFilteredCategories,
    });
  };

  const handleKeyUp = (newValue) => {
    setSearchTerm(newValue);
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'white',
          height: '70%',
        }}
      >
        <Box display="flex" flexDirection="column" sx={{ mb: '5%' }}>
          <SearcherInput
            autoFocus
            title={sharedLabels.searchCategory}
            titleConfig={{ variant: 'h6' }}
            searcherConfig={{
              variant: 'outlined',
              sx: { width: '50%' },
            }}
            inputStyles={{ border: '2px solid black' }}
            onSearchClick={filterCategories}
            keyEvents={{
              onKeyUp: handleKeyUp,
              onEnterPressed: filterCategories,
            }}
            inputValue={searchTerm}
          />
        </Box>
        <Box display="flex" flexDirection="row">
          {
            filteredCategories.map((column) => (
              <Box display="flex" flexDirection="column">
                {
                    column.map((category) => category.render())
                }
              </Box>
            ))
          }
        </Box>
      </Box>
    </Modal>
  );
}

CategoryModal.defaultProps = {
  handleClose: EMPTY_FUNCTION,
  handleCategorySelected: EMPTY_FUNCTION,
};

CategoryModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func,
  categories: PropTypes.any.isRequired,
  columnLimit: PropTypes.number.isRequired,
  handleCategorySelected: PropTypes.func,
};

export default CategoryModal;
