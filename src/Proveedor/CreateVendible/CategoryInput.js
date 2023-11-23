/* eslint-disable no-unused-vars */
import { useMemo, useState } from 'react';
import {
  Breadcrumbs, Button, ButtonGroup, Grid, Typography,
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Searcher from '../../Shared/Components/Searcher';
import { proveedorLabels } from '../../StaticData/Proveedor';

const MAX_ALLOWED_CATEGORIES = 3;

function CategoryInput() {
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
          Agregar

        </Button>
        {
          !isConfirmed && (<Button onClick={handleFinish}>Terminar</Button>)
        }
        {
          isConfirmed && (<Button onClick={handleEdit}>Editar</Button>)
        }
        <Button
          onClick={() => handleRemoveLastCategory()}
          disabled={isDeleteButtonDisabled}
        >
          Borrar Última

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

export default CategoryInput;
