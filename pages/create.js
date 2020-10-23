import { Form, Input, TextArea, Button, Image, Message, Header, Icon } from 'semantic-ui-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import catchErrors from '../utils/catchErrors';
import { useRouter } from 'next/router';

const INITIAL_PRODUCT = {
  name:"",
  price: "",
  media: "",
  description: ""
}

function CreateProduct({ state, dispatch }) {
  const [product, setProduct] = useState(INITIAL_PRODUCT);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [disable, setDisable] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if(Object.values(product).every(i => Boolean(i))){ 
      setDisable(false)
    } else {
      setDisable(true)
    }
    
  },[product])

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if(name === 'media') {
      setProduct(pre => ({
        ...pre,
        [name]: files[0]
      }))
      setMediaPreview(window.URL.createObjectURL(files[0]));
      
    } else {
      setProduct(pre => ({
        ...pre,
        [name]: value
      }))
    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError("");
      const mediaUrl = await handleImageUpload();
      
      // const config = { headers: {"Content-Type": "application/json"}};
      const body = {name: product.name, price: product.price, description: product.description, mediaUrl};
      const res = await axios.post('/api/product', body);
      setProduct(INITIAL_PRODUCT);
      setSuccess(true);
    } catch(err) {
      catchErrors(err, setError)
    } finally {
      // Whatever happened, will come to here.
      setLoading(false);
    }
  }

  const handleImageUpload = async () => {
    const data = new FormData()
    data.append('file', product.media);
    data.append('upload_preset', 'reactEcommerce');
    data.append('cloud_name', 'dhu8oyrv2');
    try {
      const res = await axios.post(process.env.CLOUDINARY_URL, data);
      const mediaUrl = res.data.url;
      return mediaUrl;
    } catch(err) {
      catchErrors(err, setError)
    }
  }

  if(!state.authorized || state.user.role === 'user') router.push('/login');

  return (
    <>{ state.authorized && state.user.role !== 'user' &&
      <>
        <Header as="h2" block>
          <Icon name="add" color="orange" />
          Create New Product
        </Header>
        <Form loading={loading} error={Boolean(error)} success={success} onSubmit={handleSubmit}>
          <Message 
            error
            header="Oops!"
            content={error}
          />
          <Message 
            success
            icon="check"
            header="Success!"
            content="Your product has been posted"
          />
          <Form.Group widths="equal">
            <Form.Field 
              control={Input}
              name="name"
              label="Name"
              placeholder="Name"
              onChange={handleChange}
              value={product.name}
            />
            <Form.Field 
              control={Input}
              name="price"
              label="Price"
              placeholder="Price"
              min="0.00"
              step="0.01"
              type="number"
              onChange={handleChange}
              value={product.price}
            />
            <Form.Field 
              control={Input}
              name="media"
              label="Media"
              type="file"
              content="Select Image"
              accept="image/*"
              onChange={handleChange}
            />
          </Form.Group>
          <Image src={mediaPreview} rounded centered size="small"/>
          <Form.Field 
            control={TextArea}
            name="description"
            label="Description"
            placeholder="Description"
            onChange={handleChange}
            value={product.description}
          />
          <Form.Field 
            control={Button}
            disabled={loading || disable}
            color="blue"
            icon="pencil alternate"
            content="Submit"
            type="submit"
          />
        </Form>
      </>
    }</>
  )
}

export default CreateProduct;
