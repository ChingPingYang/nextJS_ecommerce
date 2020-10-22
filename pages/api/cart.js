import Cart from '../../models/Cart';
import Product from '../../models/Product';
import { authorizeToken } from '../../utils/auth';
import connectDB from '../../utils/connectDb';

connectDB();

export default (req, res) => {
    switch(req.method) {
        case "GET":
            return handleGet(req, res);
        case "PUT":
            return handlePut(req, res);
        case "DELETE":
            return handleDelete(req, res);
        default: 
            return res.status(405).json({errmsg: `Method ${req.method} not allowed`})
    }
}

const handleGet = async (req, res) => {
    const response = authorizeToken(req);
    if(!response.userId) return res.status(403).json({errmsg: response})
    try {
        const cart = await Cart.findOne({ user: response.userId}).populate('products.product');
        return res.status(200).json(cart.products);
    } catch(err) {
        console.log(err)
        return res.status(500).json({ errmsg: "Server error... try later"});
    }
}

const handlePut = async (req, res) => {
    const response = authorizeToken(req);
    if(!response.userId) return res.status(403).json({errmsg: response});
    const { productId, quantity } = req.body;
    try {
        // 1) Get the cart first
        const cart = await Cart.findOne({user: response.userId});
        // 2) Check if products already exist
        const isExist = cart.products.filter(product => String(product.product) === productId);
        // 3) if exist add on product, otherwise unshift the product
        if(isExist.length !== 0) {
            cart.products.map(product => String(product.product) === productId && (product.quantity += quantity));
        } else {
            cart.products.unshift({product: productId, quantity});
        }
        // 4) save product
        await cart.save();
        return res.status(200).json({ msg: 'Product added to cart!'});
    } catch(err) {
        return res.status(500).json({ errmsg: 'Something went wrong'});
    }

}

const handleDelete = async (req, res) => {
    const response = authorizeToken(req);
    if(!response.userId) return res.status(403).json({errmsg: response})
    try {
        // Needs to populate products too... for geting products' info
        const cart = await Cart.findOne({ user: response.userId}).populate('products.product');
        const { productId } = req.body;
        // Find return products excluding the product
        const productIndex = cart.products.map(p => p.product.toString()).indexOf(productId);
        
        cart.products.splice(productIndex, 1);
        await cart.save();
        return res.status(200).json(cart.products);
        
    } catch(err) {
        console.log(err)
        return res.status(500).json({ errmsg: "Server error... try later"});
    }
}