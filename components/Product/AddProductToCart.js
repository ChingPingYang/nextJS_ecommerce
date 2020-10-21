import { useState, useEffect } from 'react';
import { Input } from 'semantic-ui-react';
import { useRouter } from 'next/router';
import axios from 'axios';
import catchErrors from '../../utils/catchErrors';

function AddProductToCart({productId, user}) {
  const [quantity, setQuantity] = useState(1);
  const [ loading, setLoading ] = useState(false);
  const [ success, setSuccess ] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let timeOut;
    if(success) {
      timeOut = setTimeout(() => setSuccess(false), 3000);
    }
    return () => {
      clearTimeout(timeOut);
    }
  },[success])

  const handleAddProductToCart = async () => {
    const body = { productId, quantity };
    try{
      setLoading(true);
      await axios.put('/api/cart',body);
      setSuccess(true)
    } catch(err) {
      catchErrors(err, window.alert);
    } finally {
      setLoading(false);
    }
  }

  return <Input 
    type="number"
    min="1"
    value={quantity}
    onChange={e => setQuantity(Number(e.target.value))}
    placeholder="Quantity"
    action={
      user && success ? {
        color: 'blue',
        content: "Item Added!",
        icon: "plus cart",
        disabled: true
      } :
      user ?{
      color: "orange",
      content: "Add to Cart",
      icon: "plus cart",
      loading,
      disabled: loading,
      onClick: handleAddProductToCart
    }: {
      color: "orange",
      content: "Add to Cart",
      icon: "plus cart",
      onClick: () => router.push('/signup')
    }}
  />
}

export default AddProductToCart;
