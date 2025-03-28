var express = require('express');
var router = express.Router();
const Database = require('better-sqlite3');

const db = new Database('./db/products.db', {
  verbose: console.log,
  fileMustExist: true,
});

router.get('/', function (req, res) {
  try {
    const products = db
      .prepare('SELECT id, title, price, introduction, isliked, featuredImage, slug FROM products')
      .all();

    res.render('index', { title: 'VardagStil - Home', products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Failed to load products');
  }
});
router.get('/search', function (req, res) {
  try {
    const searchQuery = req.query.query;
    console.log('Search Query:', searchQuery);

    if (!searchQuery) {
      return res.render('search-results', { title: 'Search Results', results: [], searchQuery: '' });
    }

    const results = db
      .prepare(`
        SELECT id, title, price, introduction, isliked, featuredImage, slug, full_description 
        FROM products 
        WHERE title LIKE ? OR introduction LIKE ? OR slug LIKE ?
      `)
      .all(`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`);

    console.log('Search Results:', results);

    res.render('search-results', { title: 'Search Results', results, searchQuery });
  } catch (error) {
    console.error('Error during search:', error);
    res.status(500).send('Failed to perform search');
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

router.get('/favorites', function (req, res) {
  try {
    const favoriteProducts = db.prepare('SELECT * FROM products WHERE isliked = 1').all();
    res.render('favorites', { title: 'beast', products: favoriteProducts });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).send('opps');
  }
});



module.exports = router;
