import UserAccountOptions from '../../Shared/Components/UserAccountOptions';
import { systemConstants } from '../../Shared/Constants';
import Cliente from '../Components';

function ClienteContainer() {
  const menuOptions = [{
    component: UserAccountOptions,
    props: { userInfo: { name: 'Bruno' } },
  }];

  const services = [
    {
      title: 'Veterinario',
      text: 'jkdfjkdjfkdjfkdjflkjlkjlkjlkjlkjlkjkljlkjkljkljkljlkjkljlkjlkjlkjlkj',
      image: {
        src: 'https://images.unsplash.com/photo-1544197807-bb503430e22d?ixlib=rb-4.0.3&dpr=1&auto=format&fit=crop&q=60&w=400&h=400',
      },
    },
    {
      title: 'Relojero',
      text: 'gfdlkjgdflkgjdflkgjdflkgjdfgfgfdgggdgd',
      image: {
        src: 'https://images.unsplash.com/photo-1541480601022-2308c0f02487?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8Mnx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=60&h=400',
      },
    },
  ];

  const products = [
    {
      title: 'Libro y cafecito',
      text: 'gffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
      image: {
        src: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8Nnx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
      },
    },
    {
      title: 'Libro negro',
      text: 'dfggfffffffffffffffffffffffffffffff',
      image: {
        src: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80',
      },
    },
    {
      title: 'Bocha de libros',
      text: 'fdkjdshkdjshfkdsjfhkjsdhfkjsdhfkjdshfkjdshfkjdshfkdsj',
      image: {
        src: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGJvb2t8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
      },
    },
    {
      title: 'Libro en ventanita',
      text: 'fgdfsgfdsgsfdsdflkjgshdfkjhgdfkjhjhkkkkkkkkkkjhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhkdffdggfdgdf',
      image: {
        src: 'https://images.unsplash.com/photo-1495640388908-05fa85288e61?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGJvb2t8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60',
      },
    },
  ];

  // eslint-disable-next-line max-len
  const dispatchHandleSearch = ({ searchType }) => Promise.resolve((searchType === systemConstants.PRODUCTS) ? products : services);

  return <Cliente menuOptions={menuOptions} dispatchHandleSearch={dispatchHandleSearch} />;
}

export default ClienteContainer;
