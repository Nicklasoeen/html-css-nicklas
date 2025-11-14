import {fetchProducts} from './api.js';
import {showLoading, showError} from './utils.js';

const productsGrid = document.querySelector('.products__grid');

// render product cards
function renderProducts(products) {
    productsGrid.innerHTML = products.map(product => `
        <div class="product__card">
            <a href="product-detail.html?id=${product.id}">
                <img src="${product.image.url}" alt="${product.image.alt || product.title}"/>
            </a>
            <div class="content">
                <h3>${product.title}</h3>
                <div class="meta">
                    <p class="meta__price">${product.price} NOK</p>
                    <p class="meta__sex">${product.gender || 'Unisex'}</p>
                </div>
                <p>${product.description || 'Available now'}</p>
            </div>
        </div>
    `).join('');
}

async function loadProducts() {
    showLoading(productsGrid);

    try {
        const products = await fetchProducts();
        const featuredProducts = products.slice(0, 3);
        renderProducts(featuredProducts);
    } catch (error) {
        showError(productsGrid, 'Failed to load products. Please try again later.');
    }
}

loadProducts();