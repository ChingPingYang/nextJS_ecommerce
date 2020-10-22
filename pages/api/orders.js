import {authorizeToken} from '../../utils/auth';
import connectDB from '../../utils/connectDb';
import Order from '../../models/Order';
import Product from '../../models/Product';
//**** Need to impor Product model for populating it ****

connectDB();

export default (req, res) => {
    switch(req.method) {
        case "GET":
            return handleGet(req,res);
        default:
            return res.status(405).json({errmsg: `Method ${req.method} not allowed`})
    }
}

const handleGet = async (req, res) => {
    const response = authorizeToken(req);
    if(!response.userId) return res.status(403).json({errmsg: response});
    try {
        const orders = await Order.find({ user: response.userId}).sort({ createdAt: 'desc'}).populate('products.product');
        return res.status(200).json(orders);
    }catch(err) {
        console.log('HERE',err)
        return res.status(500).json({ errmsg: "Server error... try later"});
    }
}