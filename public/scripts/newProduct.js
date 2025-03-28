document.getElementById('new-product-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const image = document.getElementById('image').value;
    const brand = document.getElementById('brand').value;
    const sku = document.getElementById('sku').value;
    const price = document.getElementById('price').value;

    try {
        const response = await fetch('/api/products2', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, description, image, brand, sku, price }),
        });

        if (response.ok) {
            alert('Produkten har lagts till!');

            window.location.href = '/admin';
        } else {
            const error = await response.json();
            alert(`Ohh nej: ${error.error || 'Ett fel uppstod!'}`);
        }
    } catch (err) {
        console.error('Error adding product:', err);
        alert('Ett tekniskt fel uppstod!');
    }
});
