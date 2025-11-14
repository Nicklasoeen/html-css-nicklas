// Show loading spinner
export function showLoading(container) {
    container.innerHTML = '<div class="loading">Loading products...</div>';
}

// Show error message
export function showError(container, message) {
    container.innerHTML = `<div class="error">Error: ${message}</div>`;
}

// Get cart from local storage
export function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

// Save cart to local storage
export function saveCart(cart) {
    localStorage.setItem(`cart`, JSON.stringify(cart));
}

// Add product to cart
export function addToCart(product, size = `M`, color = `Black`) {
    const cart = getCart();

    const cartItem = {
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image.url,
        size,
        color,
        quantity: 1
    };

    // Check if product already exists in cart
    const existIndex = cart.findIndex(
    item => item.id === product.id && item.size === size && item.color === color
  );

  if (existIndex !== -1) {
    cart[existIndex].quantity += 1;
  } else {
    cart.push(cartItem);
  }
  saveCart(cart);
  return cart;
}

// Remove item from cart
export function removeFromCart(productId, size) {
    let cart = getCart();
    
    // Find and remove the item
    cart = cart.filter(item => !(item.id === productId && item.size === size));
    
    saveCart(cart);
}