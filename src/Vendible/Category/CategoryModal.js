/* eslint-disable react/prop-types */
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import RootRenderer from './RootRenderer';
import EmptyTreeRenderer from './EmptyTreeRenderer';
import LeafRenderer from './LeafRenderer';

function processChild(childRoot) {
  const { root, rootId, children } = childRoot;

  const isSuperCategory = !!(children.length);

  const childrenJsx = [];

  children.forEach((childrenRoot) => {
    childrenJsx.push(processChild(childrenRoot));
  });

  return isSuperCategory ? new RootRenderer({
    rootName: root, rootId, children: childrenJsx, renderAsList: true,
  }) : new LeafRenderer({
    rootName: root,
    rootId,
    handleCategorySelected: () => {},
    renderAsList: true,
  });
}

function CategoryModal({ open, handleClose, categories }) {
  const [filteredCategories, setFilteredCategories] = useState([]);

  useEffect(() => {
    const firstCategoriesSections = [];
    Object.values(categories).forEach((hierarchiesList) => {
      hierarchiesList.forEach((hierarchy) => {
        const { root, rootId, children } = hierarchy;

        const isSuperCategory = !!(children.length);

        const childrenJsx = [];

        children.forEach((childrenRoot) => {
          childrenJsx.push(processChild(childrenRoot));
        });

        const element = isSuperCategory ? new RootRenderer({
          rootName: root, rootId, children: childrenJsx, renderAsList: true,
        })
          : new EmptyTreeRenderer({
            rootName: root,
            rootId,
            renderAsList: true,
          });

        firstCategoriesSections.push(element);
      });
    });

    setFilteredCategories(firstCategoriesSections);
  }, [categories]);

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
        }}
      >
        {filteredCategories.map((category) => category.render())}
      </Box>
    </Modal>
  );
}

export default CategoryModal;
