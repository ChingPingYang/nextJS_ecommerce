import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
    name: {
        type: String
    }
})

let Order;
try {
    Order = mongoose.model('Order');
} catch(e){
    Order = mongoose.model('Order', OrderSchema);
}

export default Order