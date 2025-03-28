const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const Database = require('better-sqlite3');
const indexRouter = require('./routes/index');
const detailRouter = require('./routes/detail');
const { title } = require('process');
const app = express();


const db = new Database('./db/products2.db', {
  verbose: console.log,
  fileMustExist: true,
});

const createTable = db.prepare(`
  CREATE TABLE IF NOT EXISTS products2 (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    sku TEXT NOT NULL,
    price TEXT NOT NULL
  )
`);
createTable.run();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use('/', indexRouter);
app.use('/', detailRouter);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index', { title: 'VardagStil' });
});
app.get('/login', function (req, res) {
  res.render('login', { title: 'Loggain' });
});
app.get('/singup', function (req, res) {
  res.render('singup', { title: 'singup' });
});
app.get('/forgotpassword', function (req, res) {
  res.render('forgotpassword', { title: 'forgotpassword' });
});

app.post('/api/products2', (req, res) => {
  const { name, sku, price } = req.body;

  if (!name || !sku || !price) {
    return res.status(400).send('All fields are required');
  }

  const addProduct = db.prepare(`
    INSERT INTO products2 (name, sku, price)
    VALUES (?, ?, ?)
  `);

  try {
    addProduct.run(name, sku, price);
    console.log('Product added successfully');
    
    res.redirect('/admin');
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).send('Failed to add product');
  }
});


app.get('/api/products2', (req, res) => {
  try {
    const products = db.prepare('SELECT * FROM products2').all();
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.get('/admin', (req, res) => {
  try {
    const products = db.prepare('SELECT * FROM products2').all();
    res.render('admin', { products });
  } catch (error) {
    console.error('Error fetching admin products:', error);
    res.status(500).send('Failed to load admin page');
  }
});

app.get('/admin/products/new', (req, res) => {
  res.render('newProduct');
});

app.use((req, res, next) => {
  console.log(`404 Error: ${req.url} not found`);
  res.status(404).render('error', { message: 'Page not found', error: {} });
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
