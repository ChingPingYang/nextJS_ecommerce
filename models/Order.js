import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const OrderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    products: [
        {
            product: { type: Schema.Types.ObjectId, ref: 'products'},
            quantity: { type: Number, default: 1}
        }
    ],
    email: {
        type: String,
        required: true
    },
    total: {
        type: Number,
        required: true
    }
}, { timestamps: true })

let Order;
try {
    Order = mongoose.model('Order');
} catch(e){
    Order = mongoose.model('Order', OrderSchema);
}

export default Order