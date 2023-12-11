import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Searcher from '../../Shared/Components/Searcher';
import { proveedorLabels } from '../../StaticData/Proveedor';
import { sharedLabels } from '../../StaticData/Shared';

const MAX_ALLOWED_CATEGORIES = 3;

function CategoryInput({ onCategoriesSet }) {
  const [inputValue, setInputValue] = useState();
  const [enteredCategories, setEnteredCategories] = useState([]);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleAddCategory = () => {
    const inputRegex = new RegExp(inputValue, 'i');
    const isRepeatedCategory = enteredCategories.some((c) => c.match(inputRegex));
    if (inputValue && !isRepeatedCategory) {
      enteredCategories.push(inputValue);
      setEnteredCategories([...enteredCategories]);
      setInputValue('');
    }
  };

  const handleRemoveLastCategory = () => {
    enteredCategories.pop();
    setEnteredCategories([...enteredCategories]);
  };

  const handleFinish = () => {
    if (enteredCategories.length) {
      setIsConfirmed(true);
      onCategoriesSet({ newCategories: [...enteredCategories] });
    }
  };

  const handleEdit = () => {
    setIsConfirmed(false);
  };

  const handleInputChange = (value) => {
    setInputValue(value);
  };

  const isAddButtonDisabled = useMemo(
    () => isConfirmed || enteredCategories.length === MAX_ALLOWED_CATEGORIES,
    [enteredCategories, isConfirmed],
  );

  const isDeleteButtonDisabled = useMemo(
    () => isConfirmed || enteredCategories.length === 0,
    [enteredCategories, isConfirmed],
  );

  return (
    <Grid
      container
      flexDirection="column"
      sx={{ width: '50%', mt: '5%' }}
    >
      {
        !isConfirmed && (
          <Searcher
            placeholder={proveedorLabels['addVendible.category.add']}
            keyEvents={{ onKeyUp: handleInputChange }}
            inputValue={inputValue}
          />
        )
      }
      <ButtonGroup variant="contained" sx={{ justifyContent: 'space-around', mt: '5%' }}>
        <Button
          onClick={() => handleAddCategory()}
          disabled={isAddButtonDisabled}
        >
          { sharedLabels.add }

        </Button>
        {
          !isConfirmed && (
          <Button
            onClick={handleFinish}
            disabled={!enteredCategories.length}
          >
            { sharedLabels.finish }
          </Button>
          )
        }
        {
          isConfirmed && (<Button onClick={handleEdit}>{ sharedLabels.edit }</Button>)
        }
        <Button
          onClick={() => handleRemoveLastCategory()}
          disabled={isDeleteButtonDisabled}
        >
          { sharedLabels.deleteLast }

        </Button>
      </ButtonGroup>
      {
        !!enteredCategories.length && (
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mt: '5%' }}>
            {
              enteredCategories.map((category) => (
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  { category}
                </Typography>
              ))
            }
          </Breadcrumbs>
        )
      }
    </Grid>
  );
}

CategoryInput.propTypes = {
  onCategoriesSet: PropTypes.func.isRequired,
};

export default CategoryInput;
