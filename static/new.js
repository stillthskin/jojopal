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
