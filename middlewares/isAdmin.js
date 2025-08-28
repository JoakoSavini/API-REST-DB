const isModerator = (req, res, next) => {
    const userRole = req.user.user.rol;
    
    if (userRole !== 'moderador' && userRole !== 'admin') {
        return res.status(403).json({ 
            message: 'Acceso denegado: se requiere rol moderador o admin' 
        });
    }
    next();
};

module.exports = isModerator;