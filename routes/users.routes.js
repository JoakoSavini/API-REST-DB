const express = require('express');
const router = express.Router();
const {
    getUsuarios,
    getUsuarioById,
    createUsuario,
    updateUsuario,
    deleteUsuario,
    updateUserRole,
} = require('../controllers/users.controller');

const verifyToken = require('../middlewares/verifyToken');
const isAdmin = require('../middlewares/isAdmin');

// SOLO ADMIN y MODERADOR pueden ver usuarios (cliente NO puede ver usuarios)
const canViewUsers = (req, res, next) => {
    const userRole = req.user.user.rol;
    
    if (userRole !== 'admin' && userRole !== 'moderador') {
        return res.status(403).json({ 
            message: 'Acceso denegado: los clientes no pueden ver usuarios' 
        });
    }
    next();
};

// Rutas con validación de roles específica
router.get('/', verifyToken, canViewUsers, getUsuarios);              // Solo admin y moderador
router.get('/:id', verifyToken, canViewUsers, getUsuarioById);        // Solo admin y moderador
router.post('/', verifyToken, isAdmin, createUsuario);                // Solo admin puede crear
router.put('/:id', verifyToken, isAdmin, updateUsuario);              // Solo admin puede editar
router.put('/:id/rol', verifyToken, isAdmin, updateUserRole);         // Solo admin puede cambiar rol
router.delete('/:id', verifyToken, isAdmin, deleteUsuario);           // Solo admin puede eliminar

module.exports = router;