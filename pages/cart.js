import { useEffect, useState } from 'react';
import axios from 'axios';
import { Segment } from 'semantic-ui-react';
import CartItemList from '../components/Cart/CartItemList';
import CartSummary from '../components/Cart/CartSummary';
import catchErrors from '../utils/catchErrors';

function Cart({ state }) {
  const [products, setProducts] = useState([]);
  const [ success, setSuccess ] = useState(false);
  const [ loading, setLoading] = useState(false);
  useEffect(() => {
    async function getCart() {
      try {
        const res = await axios.get('/api/cart');
        setProducts(res.data);
      } catch(err) {
        setProducts([]);
        console.log(err)
      }
    }
    getCart();    
  },[]);

  const handleDeleteProductFromCart = async (productId) =>{
    try {
      const res = await axios.delete('/api/cart', { data: { productId }});
      console.log(res.data)
      setProducts(res.data);
    } catch(err) {
      console.log(err)
    }
  }
  const handleCheckout = async (paymentData) => {
    const body = { paymentData }
    try {
      setLoading(true);
      await axios.post('/api/checkout', body);
      setSuccess(true);
    } catch(err){
      catchErrors(err, window.alert);
    } finally {
      setLoading(false)
    }

  }

  return (
    <Segment loading={loading}>
      <CartItemList products={products} user={state.user} handleDeleteProductFromCart={handleDeleteProductFromCart} success={success}/>
      <CartSummary products={products} handleCheckout={handleCheckout} success={success}/>
    </Segment>
  )
}

export default Cart;
