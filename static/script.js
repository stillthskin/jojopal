// Sample Product Data
const allProducts = [
    { name: 'Apple iPhone 13', price: 799, imageUrl: 'https://via.placeholder.com/400', category: 'electronics', additionalImages: ['https://via.placeholder.com/500'], description: 'The latest Apple iPhone with 5G capabilities and advanced camera system.' },
    { name: 'Nike Air Max 2021', price: 120, imageUrl: 'https://via.placeholder.com/300', category: 'clothing', additionalImages: ['https://via.placeholder.com/500'], description: 'Stylish and comfortable sneakers for all-day wear.' },
    { name: 'Samsung Galaxy S21', price: 999, imageUrl: 'https://via.placeholder.com/300', category: 'electronics', additionalImages: ['https://via.placeholder.com/500'], description: 'High-end smartphone with stunning display and powerful performance.' },
    { name: 'Adidas Running Shoes', price: 85, imageUrl: 'https://via.placeholder.com/300', category: 'clothing', additionalImages: ['https://via.placeholder.com/500'], description: 'Lightweight running shoes with excellent grip.' },
    { name: 'Sony 4K TV', price: 499, imageUrl: 'https://via.placeholder.com/300', category: 'home', additionalImages: ['https://via.placeholder.com/500'], description: 'Smart 4K TV with a large screen and stunning visuals.' },
    { name: 'LG Washing Machine', price: 350, imageUrl: 'https://via.placeholder.com/300', category: 'home', additionalImages: ['https://via.placeholder.com/500'], description: 'Efficient washing machine with various modes and high capacity.' }
];

// Global variables for pagination
let currentPage = 1;
const productsPerPage = 3;
let filteredProducts = allProducts;

// Cart and Product Management
let cart = [];

// Function to render products based on current page and filters
function renderProducts() {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';
    // Define the API URL
    const apiUrl = '/api/products';

    // Function to fetch and display products
    async function fetchProducts() {
        const search = '';  // Define search query (empty string or specific term)
        const category = '';  // Define category (empty string or specific category)
        const page = 1;  // Set page number (default is 1)
        const limit = 10;  // Set the number of products to fetch per page

        const url = new URL(apiUrl, window.location.origin);
        const params = {
            search: search,
            category: category,
            page: page,
            limit: limit,
        };

        // Append parameters to the URL
        Object.keys(params).forEach(key => {
            if (params[key]) {
                url.searchParams.append(key, params[key]);
            }
        });

        try {
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                displayProducts(data);
            } else {
                console.error('Error fetching products:', response.statusText);
            }
        } catch (error) {
            console.error('Request failed', error);
        }
    }

    // Function to display products in the HTML
    function displayProducts(products) {
        const productList = document.getElementById('product-list');
        productList.innerHTML = '';  // Clear any existing content

        if (products.length === 0) {
            productList.innerHTML = '<p>No products found.</p>';
            return;
        }

        const list = document.createElement('ul');
        products.forEach(product => {
            const listItem = document.createElement('li');
            listItem.textContent = `${product.name} - ${product.category}`;
            list.appendChild(listItem);
        });

        productList.appendChild(list);
    }

    // Call fetchProducts on page load
    fetchProducts();

    
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = currentPage * productsPerPage;
    
    const productsToRender = filteredProducts.slice(startIndex, endIndex);
    
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
    
    updatePagination();
}

// Function to update pagination controls
function updatePagination() {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
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
document.getElementById('category-select').addEventListener('change', (e) => {
    const selectedCategory = e.target.value;
    if (selectedCategory) {
        filteredProducts = allProducts.filter(product => product.category === selectedCategory);
    } else {
        filteredProducts = allProducts;
    }
    currentPage = 1;  // Reset to first page
    renderProducts();
});

// Search functionality
document.getElementById('search-input').addEventListener('input', (e) => {
    const searchQuery = e.target.value.toLowerCase();
    filteredProducts = allProducts.filter(product => product.name.toLowerCase().includes(searchQuery));
    currentPage = 1;  // Reset to first page
    renderProducts();
});

// Cart functionality
function addToCart(product) {
    const existingProductIndex = cart.findIndex(item => item.name === product.name);
    
    if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    updateCart();
}

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
    const cart = document.getElementById('cart');
    cart.style.display = cart.style.display === 'block' ? 'none' : 'block';
});

// Clear cart
document.getElementById('clear-cart').addEventListener('click', () => {
    cart = [];
    updateCart();
});

// View More popup
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
// JavaScript for Hamburger Menu Toggle
document.getElementById('hamburger-menu').addEventListener('click', function() {
    const navLinks = document.getElementById('nav-links');
    navLinks.classList.toggle('active'); // Toggle the visibility of the navigation links
});


// Initialize
window.onload = () => {
    renderProducts();
};

