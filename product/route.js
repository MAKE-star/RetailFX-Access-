const productService = require("./service");
const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authentication');


router.post('/product/create', authenticate([0]),productService.createProduct);
router.get('/products', authenticate([0,1,2]),productService.getProducts);
router.put('/product/edit/:productId', authenticate([0]), productService.updateProduct);
router.delete('/product/edit/:productId',authenticate([0]), productService.deleteProduct);
router.get('/product/search',authenticate([0,1]), productService.searchProduct);
router.get('/product-category',authenticate(), productService.getProductCategory);
router.get('/product/:productId',authenticate([0]), productService.getProduct);
router.get('/product',authenticate(),productService.searchProduct);
module.exports= router;
