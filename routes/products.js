var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

// Route to list all products
router.get('/', function(req, res) {
  const dataPath = path.join(__dirname, '../products.json');
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to load products' });
    }

    const products = JSON.parse(data);
    const productList = Object.keys(products).map(id => {
      return { id, ...products[id] };
    });

    res.json(productList);
  });
});


// Ensure :qt is parsed as an integer
router.get('/instock/:qt', (req, res) => {
  const qt = parseInt(req.params.qt, 10);
  const dataPath = path.join(__dirname, '../products.json');

  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return res.status(500).send('Internal Server Error');
    }

    try {
      const products = JSON.parse(data);
      const productInStock = Object.entries(products).find(([id, product]) => product.stock >= qt);

      if (productInStock) {
        const [id, product] = productInStock;
        res.json({ id, ...product });
      } else {
        res.status(404).json({ error: 'No product found with the specified stock.' });
      }
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      res.status(500).send('Internal Server Error');
    }
  });
});

// Route to get details of a specific product by ID
router.get('/:id', function(req, res) {
  const dataPath = path.join(__dirname, '../products.json');
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to load products' });
    }

    const products = JSON.parse(data);
    const product = products[req.params.id];

    if (product) {
      res.json({ id: req.params.id, ...product });
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  });
});

// Route to calculate total price for a product
router.get('/:id/:qt', (req, res) => {
  const { id, qt } = req.params;
  const dataPath = path.join(__dirname, '../products.json');

  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      res.status(500).send('Internal Server Error');
      return;
    }

    const products = JSON.parse(data);
    const product = products[id];

    if (!product) {
      return res.status(404).json({ error: `Product with ID ${id} not found.` });
    }

    const unitPrice = product.price;
    const totalPrice = unitPrice * parseInt(qt, 10);

    res.json({
      id,
      qt: parseInt(qt, 10),
      unit_price: unitPrice,
      total_price: totalPrice,
    });
  });
});

module.exports = router;
