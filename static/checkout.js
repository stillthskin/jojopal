const name = document.getElementById('name').value;
const email = document.getElementById('email').value;
const address = document.getElementById('address').value;



window.onload = () => {
    const cart = JSON.parse(localStorage.getItem('cart'));
    const totalAmount = localStorage.getItem('totalAmount');

    if (cart && totalAmount) {
        const checkoutItems = document.getElementById('checkout-items');
        const checkoutTotal = document.getElementById('checkout-total');

        checkoutTotal.textContent = totalAmount;

        cart.forEach(item => {
            const listItem = document.createElement('li');
            listItem.textContent = `${item.name} (x${item.quantity}) - $${(item.price * item.quantity).toFixed(2)}`;
            checkoutItems.appendChild(listItem);
        });
    } else {
        alert('No items found in cart');
        window.location.href = 'index.html'; // Redirect to homepage if no cart data
    }

    // Place order functionality
    document.getElementById('place-order-btn').addEventListener('click', async () => {
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cart: cart,
                totalAmount: totalAmount
            })
        });

        if (response.ok) {
            alert('Order placed successfully!');
            localStorage.removeItem('cart');
            localStorage.removeItem('totalAmount');
            window.location.href = 'index.html'; // Redirect to homepage
        } else {
            alert('Failed to place order');
        }
    });
};




// Handle checkout form submission
document.getElementById('checkout-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;

    // Create order object
    const order = {
        name,
        email,
        address,
        items: cart,
        total: document.getElementById('cart-total').textContent
    };

    const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(order)
    });

    if (response.ok) {
        alert('Order placed successfully!');
        cart = [];  // Clear the cart after order
        updateCart();
        document.getElementById('checkout').style.display = 'none';
    } else {
        alert('Failed to place order.');
    }
});




////STRIPE PAY

const stripe = Stripe('your-publishable-key');  // Replace with your Stripe public key
const elements = stripe.elements();
const cardElement = elements.create('card');
cardElement.mount('#card-element');  // Add a div with id "card-element" for card input

// Handle form submission
const form = document.getElementById('checkout-form');
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const { token, error } = await stripe.createToken(cardElement);
    if (error) {
        // Handle error (e.g., display error message)
    } else {
        // Send token to server for processing payment
        fetch('/process-payment', {
            method: 'POST',
            body: JSON.stringify({ token: token.id, amount: totalAmount }),
            headers: { 'Content-Type': 'application/json' },
        }).then(response => response.json())
          .then(data => {
              if (data.success) {
                  alert('Payment Successful!');
              } else {
                  alert('Payment Failed!');
              }
          });
    }
});

////MPESA PAY

document.getElementById('place-order-btn').addEventListener('click', function(event) {
    event.preventDefault();
    
    const orderDetails = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        address: document.getElementById('address').value,
        total: document.getElementById('checkout-total').textContent
    };

    // Send order data to the server (backend)
    fetch('/initiate-mpesa-payment', {
        method: 'POST',
        body: JSON.stringify(orderDetails),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json())
      .then(data => {
          if (data.status === 'success') {
              alert('M-Pesa payment initiated. Please follow instructions.');
          } else {
              alert('Payment initiation failed.');
          }
      });
});

