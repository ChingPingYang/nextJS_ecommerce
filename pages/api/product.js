import Product from '../../models/Product';
import shortId from 'shortid';
import connectDB from '../../utils/connectDb';

// Need to connect to db, cuz next is serverless.
connectDB();

export default (req, res) => {
    switch(req.method) {
        case "POST":
            return handlePost(req, res);
        case "DELETE":
            return handleDelete(req, res);
        default:
            return res.status(405).json({errmsg: `Method ${req.method} not allowed`})
    }
}

const handlePost = async (req, res) => {
    const { name, price, description, mediaUrl } = req.body;
    if(!name || !price || !description || !mediaUrl) return res.status(500).json({msg:"Need to provid every field"});
    try {
        const newProduct = new Product({name, price, description, mediaUrl, sku: shortId.generate()});
        await newProduct.save();
        return res.status(200).json(newProduct);
    } catch(err) {
        console.log(err)
        return res.status(500).json(err);
    }
}

const handleDelete = async (req, res) => {
    const { _id } = req.query;
    try {
        await Product.findOneAndDelete({_id});
        return res.status(200).json({msg: 'good job'});
    } catch(err) {
        return res.status(500).json({errmsg: 'server error'});
    }
}
