# Rainy Days

An e-commerce website for rain jackets and outdoor wear, built with vanilla HTML, CSS, and JavaScript.

## Features

- Product catalog with filtering by gender, category, and price range
- Product search and sorting (by price and name)
- Shopping cart with quantity management and localStorage persistence
- Product detail pages with size selection
- Multi-step checkout flow with form validation
- Multiple payment methods (Card, Apple Pay, Klarna)
- Order confirmation page
- Responsive fixed header with cart badge

## Prerequisites

- A modern web browser
- A local development server (e.g. [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) for VS Code)

## Getting Started

### Running the project

Since this is a static site using ES6 modules, it must be served over HTTP. Open the project with a local development server:

1. Open the project folder in VS Code
2. Use the Live Server extension to launch `index.html`

Or serve it with any static file server:

```bash
npx serve .
```

## Technologies

- HTML
- CSS
- JavaScript (ES6 Modules)
- Fetch API
- localStorage API

## API

Product data is fetched from the [Noroff API](https://v2.api.noroff.dev/rainy-days).

## Author

Nicklas
