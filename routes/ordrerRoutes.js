const express = require('express');
const Order = require('../models/order');
const Cart = require('../models/cart');

const router = express.Router();

// Place order
router.post('/api/orders', async (req, res) => {
    const { totalAmount, cart } = req.body;
    
    try {
        const order = new Order({
            userId: req.userId,
            items: cart.items.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.productId.price
            })),
            totalAmount
        });

        await order.save();
        res.status(201).json({ message: 'Order placed successfully', order });
    } catch (error) {
        res.status(500).json({ message: 'Error placing order', error });
    }
});

// Get all orders for a user
router.get('/api/orders', async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.userId }).populate('items.productId');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error });
    }
});

module.exports = router;
