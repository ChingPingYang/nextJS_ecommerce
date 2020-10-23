import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import { Segment , Divider, Button } from 'semantic-ui-react';
import {getTotalPrice} from '../../utils/calculateCartTotal';

function CartSummary({ products, handleCheckout, success }) {
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
            <StripeCheckout
              name="React Reserve"
              amount={stripeAmount}
              image={products.length > 0 ? products[0].product.mediaUrl : ""}
              currency="CAD"
              shippingAddress={true}
              billingAddress={true}
              zipCode={true}
              stripeKey="pk_test_51Hep32IAHJ8dwKiM0M98eBNZ1DRT8fivCIQICImeoRkv1P1NrRzpHreT08yCyJaVzSPyZslrCaG1UFvrI6CwhgsR008vtrfxsH"
              token={handleCheckout}
              triggerEvent="onClick"
            >
              <Button icon="cart" color="teal" floated="right" content="Checkout" disabled={products.length === 0 || success} />
            </StripeCheckout>
        </Segment>
    </>
    )
}

export default CartSummary;
