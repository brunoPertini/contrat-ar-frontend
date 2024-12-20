/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import { vendibleCategoryShape } from '../../Shared/PropTypes/Vendibles';
import { vendiblesLabels } from '../../StaticData/Vendibles';
import RootRenderer from './RootRenderer';
import EmptyTreeRenderer from './EmptyTreeRenderer';
import LeafRenderer from './LeafRenderer';
import { sharedLabels } from '../../StaticData/Shared';
import CategoryModal from './CategoryModal';
import { flexColumn } from '../../Shared/Constants/Styles';

/**
 * @param {AccordionElement} categoryTree
 * @param {Number} categoryId
 * @returns { AccordionElement} */
function searchCategoryInTree(categoryTree, categoryId) {
  let found = null;
  const queue = [categoryTree];

  while (queue.length && !found) {
    const current = queue.at(0);
    queue.shift();
    if (current.rootId === categoryId) {
      found = current;
    }

    current.children.forEach((child) => queue.unshift(child));
  }

  return found;
}

function CategoryAccordion({
  categories, vendibleType, onCategorySelected, showTitle,
}) {
  const [categoriesSubSection, setCategoriesSubSection] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCategorySelected = (categoryId, categoryName) => {
    onCategorySelected(categoryId, categoryName);
    setIsModalOpen(false);
  };

  const handleAccordionClick = ({ rootId, children }) => (
    _,
    expanded,
  ) => {
    setCategoriesSubSection((
      currentCategories,
    ) => {
      const updatedCategories = [...currentCategories];
      let toUpdateElement = null;

      for (let i = 0; !toUpdateElement; i++) {
        toUpdateElement = searchCategoryInTree(updatedCategories[i], rootId);
      }

      if (expanded) {
        children.forEach(({ root: childRoot, rootId: childRootId, children: newChildren }) => {
          const onChangeChildren = () => handleAccordionClick({
            rootId: childRootId,
            children: newChildren,
          });

          const isSuperCategory = !!(newChildren.length);

          const toInsertElement = isSuperCategory ? new RootRenderer({
            rootName: childRoot,
            rootId: childRootId,
            onChange: onChangeChildren,
            isExpanded: false,
            children: [],
          }) : new LeafRenderer({
            rootName: childRoot,
            rootId: childRootId,
            onChange: onChangeChildren,
            isExpanded: false,
            handleCategorySelected,
          });

          toUpdateElement.children.push(toInsertElement);

          toUpdateElement.isExpanded = true;
        });
      } else {
        toUpdateElement.isExpanded = false;
        toUpdateElement.children = [];
      }
      return updatedCategories;
    });
  };

  const FIRST_CATEGORIES_LIMIT = useMemo(() => (Math.ceil(
    Object.keys(categories).length / 4,
  )), [categories]);

  useEffect(() => {
    const firstCategoriesSections = [];
    const allHierarchies = Object.values(categories);
    allHierarchies.splice(FIRST_CATEGORIES_LIMIT, allHierarchies.length);

    allHierarchies.forEach((hierarchiesList) => {
      hierarchiesList.forEach((hierarchy) => {
        const { root, rootId, children } = hierarchy;

        const isSuperCategory = !!(children?.length);

        const childrenJsx = [];

        const onChange = () => handleAccordionClick({ rootId, children });

        const accordionElement = isSuperCategory ? new RootRenderer({
          rootName: root, rootId, onChange, isExpanded: false, children: childrenJsx,
        })
          : new EmptyTreeRenderer({
            rootName: root,
            rootId,
            isExpanded: true,
            handleCategorySelected,
          });

        firstCategoriesSections.push(accordionElement);
      });
    });

    setCategoriesSubSection(firstCategoriesSections);
  }, [categories]);

  if (!isEmpty(categoriesSubSection)) {
    const categoriesTitle = vendiblesLabels.categoryOfVendible.replace('{vendibleType}', vendibleType);

    return (
      <Box {...flexColumn}>
        {isModalOpen && (
          <CategoryModal
            open={isModalOpen}
            categories={categories}
            handleClose={() => setIsModalOpen(false)}
            columnLimit={FIRST_CATEGORIES_LIMIT}
            handleCategorySelected={handleCategorySelected}
          />
        )}
        <div>
          {showTitle && (
          <Typography variant="h4">
            {categoriesTitle}
          </Typography>
          )}
          {categoriesSubSection.map((accordionElement) => accordionElement.render())}
        </div>
        <Link
          sx={{
            display: 'inline-block',
            mt: 2,
            textAlign: 'center',
            color: '#1976d2',
            border: '1px solid #1976d2',
            borderRadius: '16px',
            padding: '8px 16px',
            '&:hover': {
              bgcolor: '#e3f2fd',
              textDecoration: 'none',
            },
          }}
          onClick={() => setIsModalOpen(true)}
        >
          {sharedLabels.seeMore}
        </Link>
      </Box>
    );
  }
  return null;
}

CategoryAccordion.defaultProps = {
  showTitle: true,
  categories: {},
  vendibleType: undefined,
};

CategoryAccordion.propTypes = {
  vendibleType: PropTypes.oneOf(['servicios', 'productos']),
  categories: PropTypes.objectOf(PropTypes.arrayOf(vendibleCategoryShape)),
  onCategorySelected: PropTypes.func.isRequired,
  showTitle: PropTypes.bool,
};

export default CategoryAccordion;
