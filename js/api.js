const API_BASE_URL = 'https://v2.api.noroff.dev/rainy-days';

// Fetch all products
export async function fetchProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json = await response.json();
        return json.data; // Return the data array directly

    } catch (error) {
        console.error(`Error fetching products:`, error);
        throw error;
    }
}

// Fetch single product by ID
export async function fetchProductById(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch product with ID ${id}`);
        }

        const json = await response.json();
        return json.data; // Return the single product data
    } catch (error) {
        console.error(`Error fetching product by ID:`, error);
        throw error;
    }
}