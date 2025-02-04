let currentPage = 1;
const productsPerPage = 3;
let filteredProducts = [];

// Cart management
let cart = [];

// Toggle Navigation Menu
const hamburger = document.getElementById('hamburger-menu');
const navLinks = document.querySelector('nav-links');

console.log(hamburger);

hamburger.addEventListener('click', () => {
    alert('Ham Clicked!');
    navLinks.classList.toggle('active');
});

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}


// Render products on the page
async function renderProducts() {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';

    const searchQuery = document.getElementById('search-input').value.toLowerCase();
    const category = document.getElementById('category-select').value;
    const page = currentPage;

    const response = await fetch(`/api/products/allproducts?page=${page}&limit=${productsPerPage}&category=${category}&search=${searchQuery}`);
    const data = await response.json();

    filteredProducts = data.products;

    filteredProducts.forEach(product => {
        console.log(product.imageUr)
        console.log(product.name)
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

        card.querySelector('.view-more').addEventListener('click', () => openPopup(product));
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

// Add to cart functionality
async function addToCart(product) {
    //console.log('1'+item.name);
    console.log('2' + product._id);
    console.log('2' + product.name);
    const response = await fetch('/api/carts/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productId: product._id, quantity: 1 })
    });
    const data = await response.json();

    if (response.ok) {
        alert('Product added to cart');
        updateCart();
    } else {
        alert('Failed: ' + data.message);
    }
}

// Update cart view
async function updateCart() {
    // Get the token from the cookies (JWT should be stored here)
    //const token = getCookie('token');
 
    // Fetch cart data from the backend
    const response = await fetch('/api/carts/cartitems', {
        method: 'GET'
        // headers: {
        //     'Authorization': `Bearer ${token}`
        // }
    });

    if (!response.ok) {
        console.error('Error fetching cart');
        return;
    }

    const data = await response.json();
    const cart = data || {};  // Default to empty object if cart is null
    const cartItems = cart.items || [];  // Default to empty array if items is undefined
    
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartBadge = document.getElementById('cart-badge');
    cartItemsContainer.innerHTML = '';
    
    let total = 0;
    let itemCount = 0;
    
    // Safely render the cart items
    if (Array.isArray(cartItems)) {
        cartItems.forEach(item => {
            const listItem = document.createElement('li');
            listItem.textContent = `${item.productId.name} (x${item.quantity}) - $${(item.productId.price * item.quantity).toFixed(2)}`;
            cartItemsContainer.appendChild(listItem);
            total += item.productId.price * item.quantity;
            itemCount += item.quantity;
        });
    } else {
        console.error('Cart items are not an array or are missing:', cartItems);
    }
    
    cartTotal.textContent = total.toFixed(2);
    cartBadge.textContent = itemCount;

    // Show or hide the cart based on item count
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
// Clear cart functionality
document.getElementById('clear-cart').addEventListener('click', async () => {
    // const token = getCookie('token');  // Get the token from cookies
    // console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>Token'+token);
    // if (!token) {
    //     alert('You must be logged in to clear the cart');
    //     return;
    // }

    try {
        const response = await fetch('/api/carts/clearcart', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
                //'Authorization': `Bearer ${token}`  // Send the token in the header
            }
        });

        const data = await response.json();

        if (response.ok) {
            alert('Cart cleared successfully!');
            cart = []; // Clear the cart from the frontend as well
            updateCart(); // Refresh the cart UI
        } else {
            alert('Failed to clear the cart: ' + data.message);
        }
    } catch (error) {
        console.error('Error clearing the cart:', error);
        alert('An error occurred while clearing the cart');
    }
});



// Proceed to checkout
document.getElementById('checkout-btn').addEventListener('click', () => {
    // Store cart data and total amount in localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('totalAmount', document.getElementById('cart-total').textContent);

    // Redirect to checkout page
    window.location.href = 'checkout.html';
});

// View More Popup functionality
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

// Initialize the page
window.onload = () => {
    renderProducts();
};
