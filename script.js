function addProduct() {
    const productName = document.getElementById('productName').value;
    const productDescription = document.getElementById('productDescription').value;
    const productImageInput = document.getElementById('productImage');
    const productImage = productImageInput.files[0]; // Get the selected image file
    
    // Check if a file is selected
    if (!productImage) {
        alert("Please select an image file.");
        return; // Exit the function if no file is selected
    }

    // Update the UI with the added product in the "Miscellaneous" section
    updateMiscellaneous(productName, productDescription, productImage);

    // Save the product to local storage
    saveProductLocally(productName, productDescription, productImage);

    // Optional: You can clear the input fields after adding the product
    document.getElementById('productName').value = "";
    document.getElementById('productDescription').value = "";
    productImageInput.value = ""; // Clear the file input
}

// Function to save product to local storage
function saveProductLocally(name, description, imageFile) {
    // Retrieve existing products from local storage or initialize an empty array
    let products = JSON.parse(localStorage.getItem('products')) || [];

    // Create a URL for the image file using FileReader
    const reader = new FileReader();
    reader.onload = function(e) {
        const imageDataUrl = e.target.result;

        // Create a new product object
        const newProduct = {
            name: name,
            description: description,
            image: imageDataUrl
        };

        // Add the new product to the products array
        products.push(newProduct);

        // Save the updated products array back to local storage
        localStorage.setItem('products', JSON.stringify(products));
    };

    // Read the image file as a data URL
    reader.readAsDataURL(imageFile);
}


function updateMiscellaneous(name, description, image) {
    // Create a new product container
    const productContainer = document.createElement('div');
    productContainer.classList.add('product');

    // Create elements for name and description
    const nameElement = document.createElement('p');
    nameElement.textContent = 'Name: ${name}';
    productContainer.appendChild(nameElement);

    const descriptionElement = document.createElement('p');
    descriptionElement.textContent = 'Description: ${description}';
    productContainer.appendChild(descriptionElement);

    // Create an image element
    if (image) {
        const imageElement = document.createElement('img');
        imageElement.src = URL.createObjectURL(image);
        imageElement.alt = 'Product Image';
        // Set dimensions for the image
        imageElement.style.maxWidth = '300px';
        imageElement.style.maxHeight = '300px';
        productContainer.appendChild(imageElement);
    }

    // Append the new product container to the "Miscellaneous" section
    document.getElementById('miscellaneous').appendChild(productContainer);
}

// Get references to the logout button and registration form
const logoutButton = document.getElementById('logoutButton');
const registrationForm = document.getElementById('registrationForm');

// Add event listener to the logout button
logoutButton.addEventListener('click', function() {
    // Toggle the visibility of the registration form
    registrationForm.style.display = registrationForm.style.display === 'none' ? 'block' : 'none';
});



// adding

document.addEventListener('DOMContentLoaded', () => {
    const productForm = document.getElementById('product-form');
    const productList = document.getElementById('product-list');
    let cartCount = 0;

    // Function to load products from local storage
    const loadProducts = () => {
        return JSON.parse(localStorage.getItem('products')) || [];
    };

    // Function to save products to local storage
    const saveProducts = (products) => {
        localStorage.setItem('products', JSON.stringify(products));
    };

    // Function to render products
    const renderProducts = (products) => {
        productList.innerHTML = '';
        products.forEach((product, index) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <strong>Name:</strong> ${product.name}<br>
                <strong>Description:</strong> ${product.description}<br>
                <strong>Price:</strong> Rs ${product.price}<br>
                <img src="${product.image}" alt="${product.name}" width="100">
            `;
            productList.appendChild(listItem);
        });
    };

    // Initial load of products
    const products = loadProducts();
    renderProducts(products);

    // Event listener for adding new product
    productForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const productName = document.getElementById('productName').value.trim();
        const productDescription = document.getElementById('productDescription').value.trim();
        const productPrice = document.getElementById('productPrice').value.trim();
        const productImage = document.getElementById('productImage').files[0];

        if (!productName || !productDescription || !productPrice || !productImage) {
            alert('Please fill in all fields.');
            return;
        }

        if (productImage.type !== 'image/jpeg') {
            alert('Please select a JPEG image.');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            const imageDataUrl = e.target.result;

            // Add new product to the list
            const newProduct = {
                name: productName,
                description: productDescription,
                price: productPrice,
                image: imageDataUrl
            };

            products.push(newProduct);
            saveProducts(products);
            renderProducts(products);

            // Clear the form fields
            document.getElementById('productName').value = '';
            document.getElementById('productDescription').value = '';
            document.getElementById('productPrice').value = '';
            document.getElementById('productImage').value = '';

            // Increment cart count and update buttons
            cartCount++;
            document.querySelectorAll('.btn-add-to-cart').forEach(button => {
                button.innerHTML = 'Add to Cart (${cartCount})';
            });
        };
        reader.readAsDataURL(productImage);
    });
});