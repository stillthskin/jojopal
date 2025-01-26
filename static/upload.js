document.addEventListener('DOMContentLoaded', () => {
    console.log('Dom Loaded Succesfuly');
   // Handle the form submission
document.getElementById('product-upload-form').addEventListener('submit', async (event) => {

    event.preventDefault(); // Prevent the default form submission

    // Create FormData object
    const formData = new FormData(event.target);

    try {
        // Send the form data to the backend
        const response = await fetch('/api/products/productpost', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            alert('Product uploaded successfully!');
            // Optionally clear the form or reset it after submission
            document.getElementById('product-form').reset();
        } else {
            alert('Failed to upload product');
        }
    } catch (error) {
        console.error('Error uploading product:', error);
        alert('Error uploading product');
    }
});


// Handle the form submission
document.getElementById('register-form').addEventListener('submit', async (event) => {

    event.preventDefault(); // Prevent the default form submission

    // Create FormData object
    const formData = new FormData(event.target);

    try {
        // Send the form data to the backend
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            alert('Product uploaded successfully!');
            // Optionally clear the form or reset it after submission
            document.getElementById('register-form').reset();
        } else {
            alert('Failed to register');
        }
    } catch (error) {
        console.error('Error Registering user:', error);
        alert('Error Registering user');
    }
});


// Handle the form submission
document.getElementById('login-form').addEventListener('submit', async (event) => {

    event.preventDefault(); // Prevent the default form submission

    // Create FormData object
    const formData = new FormData(event.target);

    try {
        // Send the form data to the backend
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            alert('Product uploaded successfully!');
            // Optionally clear the form or reset it after submission
            document.getElementById('login-form').reset();
        } else {
            alert('Failed to login');
        }
    } catch (error) {
        console.error('Error login user:', error);
        alert('Error loging user');
    }
});
   
});
