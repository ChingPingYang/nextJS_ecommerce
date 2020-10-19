import mongoose from 'mongoose';
import shortId from 'shortid';
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name:{
        type: String,
        required: [true, 'Name is required']
    },
    price: {
        type: Number,
        required: [true, 'Price is required']
    },
    description: {
        type: String,
        required: true
    },
    sku: {
        type: String,
        unique: true
    },
    mediaUrl: {
        type: String
    }
})

let Product;

try {
    Product = mongoose.model('products');
    console.log('111111111')
}catch(e) {
    Product = mongoose.model('products', ProductSchema);
    console.log('22222222')
}
export default Product;