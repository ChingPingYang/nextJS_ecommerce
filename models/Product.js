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
    },
    deleted: {
        type: Boolean,
        default: false
    }
})

let Product;

try {
    Product = mongoose.model('products');
}catch(e) {
    Product = mongoose.model('products', ProductSchema);
}
export default Product;