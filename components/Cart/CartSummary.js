import { useEffect, useState } from 'react';
import { Segment , Divider, Button } from 'semantic-ui-react';
import getTotalPrice from '../../utils/calculateCartTotal';

function CartSummary({ products }) {
  const [cartAmount, setCartAmount] = useState(0);
  const [stripeAmount, setStripeAmount] = useState(0);
  

  useEffect(() => {
    const {cartTotal , stripeTotal} = getTotalPrice(products);
    setCartAmount(cartTotal)
    setStripeAmount(stripeTotal);

  },[ products ]);
  return (
    <>
      <Divider/>
        <Segment clearing size="large" >
            <strong>Sub total:</strong> ${cartAmount}
            <Button icon="cart" color="teal" floated="right" content="Checkout" disabled={products.length === 0} />
        </Segment>
    </>
    )
}

export default CartSummary;
