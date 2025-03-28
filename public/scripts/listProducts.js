document.getElementById('load-products-button').addEventListener('click', async () => {

    const response = await fetch('/api/products');

    const products = await response.json();

    const table = document.getElementById('products-table');
    table.innerHTML = '';

    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.sku}</td>
            <td>${product.price}</td>
        `;
        table.appendChild(row);
    });

});