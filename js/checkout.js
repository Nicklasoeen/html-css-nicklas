import { getCart, saveCart } from './utils.js';

const summaryItemsContainer = document.querySelector(`.summary-items`);
const subtotalElement = document.querySelector(`.subtotal`);
const totalElement = document.querySelector(`.total-price`);
const checkoutForm = document.querySelector(`#checkout-form`);
const deliveryDateElement = document.querySelector(`.delivery-date`);

// get cart and show products
function renderOrderSummary() {
    const cart = getCart();

    if (cart.length === 0) {
        window.location.href = 'cart.html';
        return;
    }

    if (cart.length > 0) {
        summaryItemsContainer.innerHTML = cart.map(item => `
        <div class="summary-item">
        <img src="${item.image}" alt="${item.title}" />
        <div class="item-details">
        <p class="product-name">${item.title}</p>
        <p>Size: ${item.size}</p>
        <p>Quantity: ${item.quantity}</p>
        <p class="product-price">${item.price * item.quantity} NOK</p>
    </div>
</div>`
        ).join('');
    }
}

// calculate total price
function updateSummaryTotals() {
    const cart = getCart();
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    if (subtotalElement) {
        subtotalElement.textContent = `${subtotal} NOK`;
    }

    if (totalElement) {
        const total = subtotal + 0; // can add shipping cost here
        totalElement.textContent = `${total} NOK`;
    }
    
}

// set delivery date (7 days from now)
function setEstimatedDeliveryDate() {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 7);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = currentDate.toLocaleDateString(undefined, options);

    if (deliveryDateElement) {
        deliveryDateElement.textContent = formattedDate;
    }
}

// check if form is filled out correctly
function validateForm(formData) {
    const errors = [];

    if (!formData.fullname || formData.fullname.length < 2) {
        errors.push('Full name must be at least 2 characters long.');
    }

    if (!formData.email || !formData.email.includes('@')) {
        errors.push('Please enter a valid email address.');
    }

    if (!formData.street) {
        errors.push('Please enter a street address.');
    }

    if (!formData.city) {
        errors.push('Please enter a city.');
    }

    if (!formData.postal){
        errors.push('Please enter a valid postal code.');
    }

    if (!formData.country) {
        errors.push('Please enter a country.');
    }

    // check card details if card is selected
    const selectedPayment = document.querySelector('input[name="payment"]:checked')?.value;

    if (selectedPayment === 'card') {
        if (!formData.cardnumber || formData.cardnumber.length < 13) {
            errors.push('Please enter a valid card number.');
        }

        if (!formData.expiry || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiry)) {
            errors.push('Please enter a valid expiry date (MM/YY).');
        }

        if (!formData.cvv || formData.cvv.length < 3) {
            errors.push('Please enter a valid CVV.');
        }
    }
        return errors;
}

// what happens when form is submitted
function handleFormSubmit(e) {
    e.preventDefault();

    const formData = {
        fullname: document.querySelector('#fullname').value,
        email: document.querySelector('#email').value,
        street: document.querySelector('#street').value,
        city: document.querySelector('#city').value,
        postal: document.querySelector('#postal').value,
        country: document.querySelector('#country').value,
        cardnumber: document.querySelector('#cardnumber')?.value || '',
        expiry: document.querySelector('#expiry')?.value || '',
        cvv: document.querySelector('#cvv')?.value || ''
    };

    const errors = validateForm(formData);

    if (errors.length > 0) {
        alert('Please fix the following errors:\n' + errors.join('\n'));
        return;
    }

    // save order to localStorage
    const cart = getCart();
    const orderDetails = {
        cart: cart,
        formData: formData,
        orderDate: new Date().toISOString(),
        orderTotal: cart.reduce((sum, item) => sum + item.price * item.quantity, 0) + 50 // inkludert frakt
    };

    localStorage.setItem('latestOrder', JSON.stringify(orderDetails));

    // empty cart
    saveCart([]);

    // go to confirmation page
    window.location.href = 'confirmation.html';
}

// add spaces in card number
function formatCardNumber(input) {
    let value = input.value.replace(/\s/g, '');
    let formatted = value.match(/.{1,4}/g)?.join(' ');
    input.value = formatted || value;
}

// add slash in expiry date
function formatExpiryDate(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length > 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    input.value = value;
}

// format card inputs while typing
function setupInputFormatters() {
    const cardNumberInput = document.querySelector('#cardnumber');
    const expiryInput = document.querySelector('#expiry');
    const cvvInput = document.querySelector('#cvv');

    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', () => formatCardNumber(cardNumberInput));
    }

    if (expiryInput) {
        expiryInput.addEventListener('input', () => formatExpiryDate(expiryInput));
    }

    if (cvvInput) {
        cvvInput.addEventListener('input', () => {
            cvvInput.value = cvvInput.value.replace(/\D/g, '').slice(0, 4);
        });
    }
}

// show/hide card fields based on payment method
function setupPaymentMethodToggle() {
    const cardFields = document.querySelector('.card-fields');
    const paymentOptions = document.querySelectorAll('input[name="payment"]');

    paymentOptions.forEach(option => {
        option.addEventListener('change', (e) => {
            if (e.target.value === 'card') {
                cardFields.style.display = 'grid';
            } else {
                cardFields.style.display = 'none';
            }
        });
    });
}

// start everything when page loads
renderOrderSummary();
updateSummaryTotals();
setEstimatedDeliveryDate();
setupInputFormatters();
setupPaymentMethodToggle();

if (checkoutForm) {
    checkoutForm.addEventListener('submit', handleFormSubmit);
}