import { useEffect, useState } from 'react';
import axios from 'axios';
import { Segment } from 'semantic-ui-react';
import CartItemList from '../components/Cart/CartItemList';
import CartSummary from '../components/Cart/CartSummary';

function Cart({ state }) {
  const [products, setProducts] = useState([]);
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

  return (
    <Segment>
      <CartItemList products={products} user={state.user} handleDeleteProductFromCart={handleDeleteProductFromCart} />
      <CartSummary products={products} />
    </Segment>
  )
}

export default Cart;
