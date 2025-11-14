import { getCart, saveCart, removeFromCart } from './utils.js';

const cartItemsContainer = document.querySelector('.cart__items');
const subtotalElement = document.querySelector('.subtotal');
const totalElement = document.querySelector('.total-price');
const checkoutBtn = document.querySelector('.checkout-btn');

// Render cart items
function renderCart() {
    const cart = getCart();

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <p>Your cart is empty.</p>
                <a href="shop.html" class="primary">Go to Shop</a>
            </div>
        `;
        if (subtotalElement) subtotalElement.textContent = '0 NOK';
        if (totalElement) totalElement.textContent = '0 NOK';
        if (checkoutBtn) checkoutBtn.style.display = 'none';
        return;
    }

    if (checkoutBtn) checkoutBtn.style.display = 'block';

    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item__details">
                <div class="cart-image">
                    <img src="${item.image}" alt="${item.title}" />
                </div>

                <div class="cart-item__info">
                    <div class="cart-product">
                        <p class="cart-item__name">Product name</p>
                        <p class="product-item__name">${item.title}</p>
                    </div>

                    <div class="cart-size">
                        <p class="cart-item__size">Size</p>
                        <p class="product-item__size">${item.size}</p>
                    </div>

                    <div class="cart-price">
                        <p class="cart-item__price">Price</p>
                        <p class="product-item__price">${item.price} NOK</p>
                    </div>

                    <div class="cart-item__quantity">
                        <button class="quantity-btn decrease" data-id="${item.id}" data-size="${item.size}">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn increase" data-id="${item.id}" data-size="${item.size}">+</button>
                    </div>

                    <button class="remove-btn" data-id="${item.id}" data-size="${item.size}">Remove</button>
                </div>
            </div>
        </div>
    `).join('');

    updateCartSummary();
    setupCartControls();
}

// Update cart summary (subtotal, total)
function updateCartSummary() {
    const cart = getCart();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    if (subtotalElement) subtotalElement.textContent = `${subtotal} NOK`;
    if (totalElement) totalElement.textContent = `${subtotal} NOK`;
}

// Setup event listeners for quantity buttons and remove buttons
function setupCartControls() {
    // Decrease quantity
    document.querySelectorAll('.quantity-btn.decrease').forEach(btn => {
        btn.addEventListener('click', () => {
            updateQuantity(btn.dataset.id, btn.dataset.size, -1);
        });
    });

    // Increase quantity
    document.querySelectorAll('.quantity-btn.increase').forEach(btn => {
        btn.addEventListener('click', () => {
            updateQuantity(btn.dataset.id, btn.dataset.size, 1);
        });
    });

    // Remove item
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            removeItem(btn.dataset.id, btn.dataset.size);
        });
    });
}

// Update item quantity
function updateQuantity(productId, size, change) {
    let cart = getCart();
    
    const itemIndex = cart.findIndex(item => 
        item.id === productId && item.size === size
    );

    if (itemIndex > -1) {
        cart[itemIndex].quantity += change;

        // Remove if quantity is 0 or less
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }

        saveCart(cart);
        renderCart();
        updateCartCount();
    }
}

// Remove item from cart
function removeItem(productId, size) {
    removeFromCart(productId, size);
    renderCart();
    updateCartCount();
}

// Update cart count in header
function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    const cartBadge = document.querySelector('.cart-count');
    if (cartBadge) {
        cartBadge.textContent = totalItems;
        cartBadge.style.display = totalItems > 0 ? 'block' : 'none';
    }
}

renderCart();
updateCartCount();