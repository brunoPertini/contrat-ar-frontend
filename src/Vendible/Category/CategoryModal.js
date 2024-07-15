/* eslint-disable react/prop-types */
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { useEffect, useMemo, useState } from 'react';
import RootRenderer from './RootRenderer';
import EmptyTreeRenderer from './EmptyTreeRenderer';
import LeafRenderer from './LeafRenderer';
import { SearcherInput } from '../../Shared/Components';

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

/**
 *
 * @param {Array<any>} array
 * @returns
 */
function splitArrayIntoChunks(array, chunkSize) {
  const result = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize);
    result.push(chunk);
  }
  return result;
}

function CategoryModal({ open, handleClose, categories }) {
  const [filteredCategories, setFilteredCategories] = useState([]);

  const COLUMN_LIMIT = useMemo(() => (Math.ceil(Object.keys(categories).length) / 4), [categories]);

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

    const chunkedCategories = splitArrayIntoChunks(firstCategoriesSections, COLUMN_LIMIT);

    chunkedCategories.sort((a, b) => b.length - a.length);

    setFilteredCategories(chunkedCategories);
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
          height: '70%',
        }}
      >
        <Box display="flex" flexDirection="column" sx={{ mb: '5%' }}>
          <SearcherInput
            title="Buscar categoria"
            titleConfig={{ variant: 'h6' }}
            searcherConfig={{
              variant: 'outlined',
              sx: { width: '50%' },
            }}
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

export default CategoryModal;
