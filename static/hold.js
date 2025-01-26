const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/productDB', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('Error connecting to MongoDB: ', err));

// Product Schema
const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    imageUrl: String,
    category: String,
    description: String,
    additionalImages: [String]
});

const Product = mongoose.model('Product', productSchema);

// Get all products (with pagination and filtering)
app.get('/api/products', async (req, res) => {
    const { page = 1, limit = 3, category, search } = req.query;
    const query = {};

    if (category) {
        query.category = category;
    }

    if (search) {
        query.name = new RegExp(search, 'i'); // case-insensitive search
    }

    try {
        const products = await Product.find(query)
            .skip((page - 1) * limit)
            .limit(limit);
        const totalCount = await Product.countDocuments(query);
        res.json({ products, totalCount });
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// Add product to the cart (this would typically be stored on a user's session or database)
app.post('/api/cart', (req, res) => {
    const { productId, quantity } = req.body;

    // In a real application, you'd fetch the product from the database and associate it with a user
    res.status(200).send('Product added to cart');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



//FRONT END INTEGRATION

/*

async function renderProducts() {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';
    
    const searchQuery = document.getElementById('search-input').value.toLowerCase();
    const category = document.getElementById('category-select').value;
    const page = currentPage;
    
    const response = await fetch(`/api/products?page=${page}&limit=${productsPerPage}&category=${category}&search=${searchQuery}`);
    const data = await response.json();

    const productsToRender = data.products;

    productsToRender.forEach(product => {
        const card = document.createElement('div');
        card.classList.add('product-card');
        card.innerHTML = `
            <img src="${product.imageUrl}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>$${product.price}</p>
            <button class="view-more">View More</button>
            <button class="add-to-cart">Add to Cart</button>
        `;
        productList.appendChild(card);
        
        // Add "View More" functionality
        card.querySelector('.view-more').addEventListener('click', () => openPopup(product));
        
        // Add "Add to Cart" functionality
        card.querySelector('.add-to-cart').addEventListener('click', () => addToCart(product));
    });
    
    updatePagination(data.totalCount);
}

*/





//////Paggination

/*
function updatePagination(totalCount) {
    const totalPages = Math.ceil(totalCount / productsPerPage);
    const pageNumber = document.getElementById('page-number');
    const prevButton = document.getElementById('prev-page');
    const nextButton = document.getElementById('next-page');
    
    pageNumber.textContent = `Page ${currentPage}`;
    
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;
}


*/




///Cart Functionality

/*

async function addToCart(product) {
    const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId: product._id, quantity: 1 })
    });
    
    if (response.ok) {
        alert('Product added to cart');
        updateCart();
    } else {
        alert('Failed to add product to cart');
    }
}
*/






/////ALL

/**
 * <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JOJOPAL TRENDS - E-Commerce Store</title>
    <link rel="stylesheet" href="style.css">
</head>

<body>
    <header>
        <h1>JOJOPAL TRENDS</h1>
        <nav>
            <a href="#product-list">Shop</a> |
            <a href="upload.html">Upload Product</a>
            <!-- Search Bar -->
            <div id="search-bar">
                <input type="text" id="search-input" placeholder="Search Products...">
            </div>
        </nav>
    </header>

    <!-- Cart Icon and Badge -->
    <div id="cart-icon-container">
        <button id="cart-icon">
            🛒 <span id="cart-badge">0</span>
        </button>
    </div>

    <!-- Category Filter -->
    <div id="category-filter">
        <select id="category-select">
            <option value="">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="home">Home Appliances</option>
        </select>
    </div>

    <!-- Product List Section -->
    <section id="product-list">
        <h2>Our Products</h2>
        <!-- Dynamic Product Cards will be inserted here -->
    </section>

    <!-- Pagination -->
    <div id="pagination">
        <button id="prev-page">Prev</button>
        <span id="page-number">Page 1</span>
        <button id="next-page">Next</button>
    </div>

    <!-- Shopping Cart Section (Initially hidden) -->
    <section id="cart" class="hidden">
        <h2>Shopping Cart</h2>
        <ul id="cart-items"></ul>
        <p>Total: $<span id="cart-total">0.00</span></p>
        <button id="clear-cart">Clear Cart</button>
    </section>

    <!-- View More Popup -->
    <div id="view-more-popup" class="popup">
        <div class="popup-content">
            <button id="close-popup">X</button>
            <div id="popup-product-details">
                <!-- Product details will be inserted here -->
            </div>
        </div>
    </div>

    <script>
        // Global variables for pagination
        let currentPage = 1;
        const productsPerPage = 3;
        let filteredProducts = [];

        // Cart management
        let cart = [];

        // Render products on the page
        async function renderProducts() {
            const productList = document.getElementById('product-list');
            productList.innerHTML = '';
            
            const searchQuery = document.getElementById('search-input').value.toLowerCase();
            const category = document.getElementById('category-select').value;
            const page = currentPage;

            const response = await fetch(`/api/products?page=${page}&limit=${productsPerPage}&category=${category}&search=${searchQuery}`);
            const data = await response.json();

            filteredProducts = data.products;

            filteredProducts.forEach(product => {
                const card = document.createElement('div');
                card.classList.add('product-card');
                card.innerHTML = `
                    <img src="${product.imageUrl}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>$${product.price}</p>
                    <button class="view-more">View More</button>
                    <button class="add-to-cart">Add to Cart</button>
                `;
                productList.appendChild(card);

                // Add "View More" functionality
                card.querySelector('.view-more').addEventListener('click', () => openPopup(product));

                // Add "Add to Cart" functionality
                card.querySelector('.add-to-cart').addEventListener('click', () => addToCart(product));
            });

            updatePagination(data.totalCount);
        }

        // Update pagination controls
        function updatePagination(totalCount) {
            const totalPages = Math.ceil(totalCount / productsPerPage);
            const pageNumber = document.getElementById('page-number');
            const prevButton = document.getElementById('prev-page');
            const nextButton = document.getElementById('next-page');

            pageNumber.textContent = `Page ${currentPage}`;

            prevButton.disabled = currentPage === 1;
            nextButton.disabled = currentPage === totalPages;
        }

        // Pagination controls
        document.getElementById('prev-page').addEventListener('click', () => {
            if (currentPage > 1) currentPage--;
            renderProducts();
        });

        document.getElementById('next-page').addEventListener('click', () => {
            if (currentPage * productsPerPage < filteredProducts.length) currentPage++;
            renderProducts();
        });

        // Category filter
        document.getElementById('category-select').addEventListener('change', () => {
            currentPage = 1; // Reset to first page
            renderProducts();
        });

        // Search functionality
        document.getElementById('search-input').addEventListener('input', () => {
            currentPage = 1; // Reset to first page
            renderProducts();
        });

        // Cart functionality
        async function addToCart(product) {
            const response = await fetch('/api/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ productId: product._id, quantity: 1 })
            });

            if (response.ok) {
                alert('Product added to cart');
                updateCart();
            } else {
                alert('Failed to add product to cart');
            }
        }

        // Update the cart
        function updateCart() {
            const cartItems = document.getElementById('cart-items');
            const cartTotal = document.getElementById('cart-total');
            const cartBadge = document.getElementById('cart-badge');
            cartItems.innerHTML = '';

            let total = 0;
            let itemCount = 0;

            cart.forEach(item => {
                const listItem = document.createElement('li');
                listItem.textContent = `${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`;
                cartItems.appendChild(listItem);
                total += item.price * item.quantity;
                itemCount += item.quantity;
            });

            cartTotal.textContent = total.toFixed(2);
            cartBadge.textContent = itemCount;

            if (itemCount > 0) {
                document.getElementById('cart').style.display = 'block';
            } else {
                document.getElementById('cart').style.display = 'none';
            }
        }

        // Toggle cart visibility
        document.getElementById('cart-icon').addEventListener('click', () => {
            const cartSection = document.getElementById('cart');
            cartSection.style.display = cartSection.style.display === 'block' ? 'none' : 'block';
        });

        // Clear cart functionality
        document.getElementById('clear-cart').addEventListener('click', () => {
            cart = [];
            updateCart();
        });

        // View More Popup
        function openPopup(product) {
            const popup = document.getElementById('view-more-popup');
            const popupDetails = document.getElementById('popup-product-details');

            popupDetails.innerHTML = `
                <h3>${product.name}</h3>
                <img src="${product.imageUrl}" alt="${product.name}">
                <p>${product.description}</p>
                <p><strong>Price:</strong> $${product.price}</p>
            `;

            popup.style.display = 'flex';
        }

        document.getElementById('close-popup').addEventListener('click', () => {
            document.getElementById('view-more-popup').style.display = 'none';
        });

        // Initialize
        window.onload = () => {
            renderProducts();
        };
    </script>
</body>

</html>

 * 
 * 
 * 
 * 
 * 
 */