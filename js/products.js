import { fetchProducts } from './api.js';
import { showLoading, showError } from './utils.js';

const productsGrid = document.querySelector(`.products__grid`);
let allProducts = [];

// render product cards
function renderProducts (products) {
    if (products.length === 0) {
        productsGrid.innerHTML = '<p class="no-products">No products found.</p>';
        return;
    }

    productsGrid.innerHTML = products.map(product => `
        <div class="product__card">
        <a href="product-detail.html?id=${product.id}">
        <img src="${product.image.url}" alt="${product.image.alt || product.title}"/>
        </a>
        <div class="content">
        <h3>${product.title}</h3>
        <div class="meta">
            <p class="meta__price">${product.price} NOK</p>
            <p class="meta__sex">${product.gender || `Unisex`}</p>
        </div>
        <p>${product.description || `Available now`}</p>
        </div>
        </div>
    `).join('');
}

// Filter products by gender
function filterbyGender(gender) {
    if (gender === `all`) {
        renderProducts(allProducts);
        return;
    }
    
    const filtered = allProducts.filter(product => 
        product.gender && product.gender.toLowerCase() === gender.toLowerCase()
    );
    
    renderProducts(filtered);
}

// Filter by category (using tags or title keywords)
function filterByCategory(category) {
    if (category === 'all') {
        renderProducts(allProducts);
        return;
    }
    
    const filtered = allProducts.filter(product => {
        const title = product.title.toLowerCase();
        const tags = product.tags ? product.tags.map(tag => tag.toLowerCase()) : [];
        
        // Check if category matches title or tags
        if (category === 'jackets') {
            return title.includes('jacket');
        } else if (category === 'coats') {
            return title.includes('coat');
        } else if (category === 'waterproof') {
            return tags.includes('waterproof') || title.includes('waterproof') || title.includes('rain');
        }
        
        return false;
    });
    
    renderProducts(filtered);
}

// search products by price range
function filterByPrice(min, max) {
    const filtered = allProducts.filter(product => 
        product.price >= min && product.price <= max
    );
    renderProducts(filtered);
}

// search products by title
function searchByTitle(searchTerm) {
    if (!searchTerm) {
        renderProducts(allProducts);
        return;
    }
    
    const filtered = allProducts.filter(product => 
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    renderProducts(filtered);
}

// sort products
function sortProducts(sortBy) {
    let sorted = [...allProducts];

    switch (sortBy) {
        case `price-low`:
            sorted.sort((a, b) => a.price - b.price);
            break;
        case `price-high`:
            sorted.sort((a, b) => b.price - a.price);
            break;
        case `name-az`:
            sorted.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case `name-za`:
            sorted.sort((a, b) => b.title.localeCompare(a.title));
            break;
        default:
            sorted = allProducts;
            break;
    }
    
    renderProducts(sorted);
}

// Setup filter event listeners
function setupFilters() {
    // Gender filter
    const genderButtons = document.querySelectorAll(`.gender-filter [data-gender]`);
    
    genderButtons.forEach(button => {
        button.addEventListener(`click`, () => {
            genderButtons.forEach(btn => btn.classList.remove(`active`));
            button.classList.add(`active`);
            filterbyGender(button.dataset.gender);
        });
    });

    // Category filter
    const categoryButtons = document.querySelectorAll(`.category-filter [data-category]`);
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            filterByCategory(button.dataset.category);
        });
    });

    // search input
    const searchInput = document.querySelector('#search-products');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchByTitle(e.target.value);
        });
    }

    // Sort dropdown
    const sortSelect = document.querySelector('#sort-products');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            sortProducts(e.target.value);
        });
    }
}

// load and display products
async function loadProducts () {
    showLoading(productsGrid);
    try {
        allProducts = await fetchProducts();
        renderProducts(allProducts);
        setupFilters();
    } catch (error) {
        showError(productsGrid, `Failed to load products. Please try again later.`);
    }
}

loadProducts();