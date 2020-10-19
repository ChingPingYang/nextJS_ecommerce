import Product from '../../models/Product';
import connectDB from '../../utils/connectDb';
import Order from '../../models/Order';

connectDB();

export default async (req, res) => {
   if(req.method === "GET") {
       const products = await Product.find();
       res.json(products);
   }
  
    res.json({test: 'got'});
}