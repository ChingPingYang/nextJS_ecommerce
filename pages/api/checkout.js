import Stripe from 'stripe';
import uuidv4 from 'uuid/v4';
import Cart from '../../models/Cart';
import Order from '../../models/Order';
import {getTotalPrice} from '../../utils/calculateCartTotal';
import connectDB from '../../utils/connectDb';
import { authorizeToken } from '../../utils/auth';

connectDB();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

export default (req, res) => {
    switch(req.method) {
        case "POST":
            return handlePost(req, res);
        default: 
            return res.status(405).json({errmsg: `Method ${req.method} not allowed`})
    }
}

const handlePost = async (req, res) => {
    const { paymentData } = req.body;
    // 1) Verify and get userId
    const response = authorizeToken(req);
    if(!response.userId) return res.status(403).json({errmsg: response});
    try {
        // 2) Find Cart based on id 
        const cart = await Cart.findOne({ user: response.userId }).populate('products.product');
        if(!cart) return res.status(403).json({errmsg: "No cart matched..."});
        // 3) Get total price
        const { cartTotal , stripeTotal } = getTotalPrice(cart.products);
        // 4) Get email from paymentData, see if email linked with existing Strinpe customer
        const prevCustomer = await stripe.customers.list({
            email: paymentData.email,
            limit: 1
        })
        const isExist = prevCustomer.data.length > 0;
        // 5) If not existing, create them base on the email
        let newCustomer;
        if(!isExist) {
            newCustomer = await stripe.customers.create({
                email: paymentData.email,
                source: paymentData.id
            })
        }
        const customer = (isExist && prevCustomer.data[0].id) || newCustomer.id;
        // 6) Create charge with total, send receipt email
        await stripe.charges.create({
            currency: "cad",
            amount: stripeTotal,
            receipt_email: paymentData.email,
            customer,
            description: `Checkout | ${paymentData.email} | ${paymentData.id}`
        }, {
            idempotency_key: uuidv4()
        })
        // 7) Add order data to database
        await new Order({
            user: response.userId,
            email: paymentData.email,
            total: cartTotal,
            products: cart.products
        }).save();
        // 8) Clear porducts in cart
        cart.products = [];
        await cart.save();
        // 9) Send back response
        return res.status(200).json({msg: 'Checkout successful'});
    }catch(err) {
        // console.log(err);
        return res.status(500).json({errmsg: 'server error'});
    }

}