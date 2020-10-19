import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const CartSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    products: [
        {
            product: { type: Schema.Types.ObjectId, ref: 'products'},
            quantity: { type: Number, default: 1}
        }
    ]
})

let Cart;
try {
    Cart = mongoose.model('carts');
} catch(err) {
    Cart = mongoose.model('carts', CartSchema);
}

export default Cart;