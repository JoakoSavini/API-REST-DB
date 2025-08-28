const isAdminOrModerator = (req, res, next) => {
    const userRole = req.user.user.rol;
    
    if (userRole !== 'admin' && userRole !== 'moderador') {
        return res.status(403).json({ 
            message: 'Acceso denegado: se requiere rol admin o moderador para gestionar productos' 
        });
    }
    next();
};

module.exports = isAdminOrModerator;