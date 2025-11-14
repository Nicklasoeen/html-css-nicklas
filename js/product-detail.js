import { fetchProductById } from './api.js';
import { showError, addToCart } from './utils.js';

function getProductIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

function renderProduct(product) {
    document.title = `${product.title} - Rainy Days`;

    const productImage = document.querySelector('.product-detail__image img');
    if (productImage) {
        productImage.src = product.image.url;
        productImage.alt = product.image.alt || product.title;
    }

    const productTitle = document.querySelector('.product-detail__title');
    if (productTitle) {
        productTitle.textContent = product.title;
    }

    const productPrice = document.querySelector('.product-detail__price');
    if (productPrice) {
        productPrice.textContent = `${product.price} NOK`;
    }

    const productDescription = document.querySelector('.product-detail__description');
    if (productDescription) {
        productDescription.textContent = product.description || 'No description available.';
    }

    const productGender = document.querySelector('.product-detail__gender');
    if (productGender) {
        productGender.textContent = `Gender: ${product.gender || 'Unisex'}`;
    }
}

function setupSizeSelector() {
    const sizeButtons = document.querySelectorAll('.size-option');

    sizeButtons.forEach(button => {
        button.addEventListener('click', () => {
            sizeButtons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
        });
    });
}

function getSelectedSize() {
    const selectedButton = document.querySelector('.size-option.selected');
    return selectedButton ? selectedButton.dataset.size : 'M';
}

function setupAddToCartButton(product) {
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    
    if (!addToCartBtn) {
        return;
    }
    
    addToCartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const selectedSize = getSelectedSize();
        addToCart(product, selectedSize);
        showAddedToCartMessage();
        updateCartCount();
    });
}

function showAddedToCartMessage() {
    const existingMessage = document.querySelector('.cart-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    const message = document.createElement('div');
    message.className = 'cart-message';
    message.textContent = '✓ Added to cart!';
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 3000);
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    const cartBadge = document.querySelector('.cart-count');
    if (cartBadge) {
        cartBadge.textContent = totalItems;
        cartBadge.style.display = totalItems > 0 ? 'block' : 'none';
    }
}

async function loadProduct() {
    const productId = getProductIdFromUrl();

    if (!productId) {
        showError(document.querySelector('.product-detail'), 'No product ID specified in the URL.');
        return;
    }

    try {
        const product = await fetchProductById(productId);
        renderProduct(product);
        setupSizeSelector();
        setupAddToCartButton(product);
    } catch (error) {
        showError(document.querySelector('.product-detail'), 'Failed to load product details. Please try again later.');
    }
}

loadProduct();
updateCartCount();