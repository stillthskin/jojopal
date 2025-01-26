const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true }
        }
    ],
    totalAmount: { type: Number, required: true },
    status: { type: String, default: 'Pending' },
    orderDate: { type: Date, default: Date.now }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;