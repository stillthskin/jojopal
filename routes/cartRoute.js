const express = require('express');
const Cart = require('../models/cart');
const Product = require('../models/products');
const { protectRoute } = require('../controllers/authController')

const router = express.Router();

// Add item to the cart
router.post('/add',protectRoute, async (req, res) => {
    const { productId, quantity } = req.body;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        let cart = await Cart.findOne({ userId: req.userId });
        if (!cart) {
            cart = new Cart({ userId: req.userId, items: [] });
        }

        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
        if (itemIndex >= 0) {
            cart.items[itemIndex].quantity += quantity;
        } else {
            cart.items.push({ productId, quantity });
        }

        await cart.save();
        res.status(201).json({ message: 'Item added to cart', cart });
    } catch (error) {
        res.status(500).json({ message: 'Error adding item to cart', error });
    }
});

// Get cart items
router.get('/cartitems', async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.userId }).populate('items.productId');
        if (!cart) {
            return res.status(404).json({ message: 'Cart is empty' });
        }
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cart', error });
    }
});

module.exports = router;
