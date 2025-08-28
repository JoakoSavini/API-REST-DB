const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/products.controller');

const verifyToken = require('../middlewares/verifyToken');
const isAdminOrModerator = require('../middlewares/isAdminOrModerator');

// Todos los usuarios autenticados pueden VER productos (admin, moderador, cliente)
router.get('/', verifyToken, getProducts);                                    // Todos pueden ver
router.get('/:id', verifyToken, getProductById);                              // Todos pueden ver

// Solo ADMIN y MODERADOR pueden crear, editar y eliminar productos
router.post('/', verifyToken, isAdminOrModerator, createProduct);             // Admin y moderador
router.put('/:id', verifyToken, isAdminOrModerator, updateProduct);           // Admin y moderador  
router.delete('/:id', verifyToken, isAdminOrModerator, deleteProduct);        // Admin y moderador

module.exports = router;