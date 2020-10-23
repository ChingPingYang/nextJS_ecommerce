import { Header, Button, Modal } from 'semantic-ui-react';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

function ProductAttributes({ description, _id, user }) {
  const [ modal, setModal ] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    const payload = { params: {_id}};
    try {
      const res = await axios.delete('/api/product', payload)
      router.push('/');
    } catch(err) {
      console.log('err');
    }
  }

  return (
    <>
      <Header as="h3">About this product</Header>
      <p>{description}</p>
      {(user?.role === 'admin' || user?.role === 'root') && 
        <>
          <Button icon="trash alternate outline" color="red" content="Delete Product" onClick={() => setModal(true)}/>
          <Modal open={modal} dimmer="blurring">
            <Modal.Header>Confirm Delete</Modal.Header>
            <Modal.Content>
              <p>Are you sure you want to delete this product?</p>
            </Modal.Content>
            <Modal.Actions>
              <Button content="Cancel" onClick={() => setModal(false)}/>
              <Button 
                negative
                icon="trash"
                labelPosition="right"
                content="Delete"
                onClick={handleDelete}
              />
            </Modal.Actions>
          </Modal>
        </>
      }
    </>
  )
}

export default ProductAttributes;
