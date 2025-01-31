document.addEventListener('DOMContentLoaded', () => {
    console.log('Dom Loaded Successfully');

    // Check if the 'product-upload-form' exists before attaching event listener
    const productUploadForm = document.getElementById('product-upload-form');
    if (productUploadForm) {
        productUploadForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent the default form submission

            const formData = new FormData(event.target);

            try {
                const response = await fetch('/api/products/productpost', {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    alert('Product uploaded successfully!');
                    document.getElementById('product-upload-form').reset();
                } else {
                    alert('Failed to upload product');
                }
            } catch (error) {
                console.error('Error uploading product:', error);
                alert('Error uploading product' + error.message);
            }
        });
    }

    // Check if the 'register-form' exists before attaching event listener
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (event) => {
            console.log('At reg');
            event.preventDefault(); // Prevent the default form submission
            const password = document.getElementById('password').value;
            const password1 = document.getElementById('password1').value;
            if (password !== password1) {
                alert('Passwords do not match!');
                return; // Stop further processing if passwords don't match
            }


            const formData = new FormData(event.target);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });

            try {
                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formObject),
                });

                if (response.ok) {
                    alert('User registered successfully!');
                    document.getElementById('register-form').reset();
                } else {
                    alert('Failed to register');
                }
            } catch (error) {
                console.error('Error registering user:', error);
                alert('Error registering user' + error.message);
            }
        });
    }

    // Check if the 'login-form' exists before attaching event listener
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Prevent the default form submission
       
            const formData = new FormData(event.target);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });
            console.log('At login!');

            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formObject),
                });

                if (response.ok) {
                    alert('Logged in successfully!');
                    document.getElementById('login-form').reset();
                } else {
                    alert('Failed to log in');
                }
            } catch (error) {
                console.error('Error logging in user:', error);
                alert('Error logging in user' + error.message);
            }
        });
    }
});
