var express = require('express');
var router = express.Router();
const Database = require('better-sqlite3');

const db = new Database('./db/products.db', {
  verbose: console.log,
  fileMustExist: true,
});

router.get('/products/:slug', (req, res) => {
  const slug = req.params.slug;
  console.log('Requested slug:', slug);

  const getProduct = db.prepare('SELECT * FROM products WHERE slug = ?');
  const product = getProduct.get(slug);

  if (!product) {
    return res.status(404).send('Product not found');
  }

  const selectRelatedProducts = db.prepare(`
    SELECT id, title, introduction, price, featuredImage, slug
    FROM products
    WHERE slug != ?
    ORDER BY RANDOM() 
    LIMIT 3
  `);

  const relatedProducts = selectRelatedProducts.all(slug);

  console.log('Related Products:', relatedProducts);

  res.render('products-detail', {
    title: product.title,
    product,
    relatedProducts
  });
});

router.get('/favorites', function (req, res) {
  try {
    const favoriteProducts = db.prepare('SELECT * FROM products WHERE isliked = 1').all();
    res.render('favorites', { title: 'beast', products: favoriteProducts });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).send('opps');
  }
});

router.post('/toggle-favorite/:id', function (req, res) {
  try {
    const productId = req.params.id;

    const product = db.prepare('SELECT isliked FROM products WHERE id = ?').get(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const newIsLiked = product.isliked ? 0 : 1;
    db.prepare('UPDATE products SET isliked = ? WHERE id = ?').run(newIsLiked, productId);

    res.json({ success: true, isLiked: newIsLiked });
  } catch (error) {
    console.error('Error toggling favorite:', error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

module.exports = router;
