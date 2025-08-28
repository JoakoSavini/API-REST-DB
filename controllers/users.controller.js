const { Usuario } = require('../models');
const bcrypt = require('bcryptjs');

// Obtener todos los usuarios
const getUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll();
        res.json({ status: 200, data: usuarios });
    } catch (error) {
        res.status(500).json({ status: 500, message: 'Error al obtener usuarios', error: error.message });
    }
};

// Obtener usuario por ID
const getUsuarioById = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id);
        if (!usuario) {
            return res.status(404).json({ status: 404, message: 'Usuario no encontrado' });
        }
        res.json({ status: 200, data: usuario });
    } catch (error) {
        res.status(500).json({ status: 500, message: 'Error al obtener usuario', error: error.message });
    }
};

//crear nuevo usuario
const createUsuario = async (req, res) => {
    const { nombre, email, edad, password, rol } = req.body; // <-- agregar password y rol
    try {
        if (!nombre || !email || !edad || !password) {
            return res.status(400).json({ status: 400, message: 'Faltan campos obligatorios' });
        }

        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        const nuevoUsuario = await Usuario.create({
            nombre,
            email,
            edad,
            password: hashedPassword, // <-- guardar hash
            rol: rol || 'cliente'
        });

        res.status(201).json({ status: 201, data: nuevoUsuario, message: 'Usuario creado exitosamente' });
    } catch (error) {
        console.error("❌ Error al crear usuario:", error);
        res.status(500).json({ status: 500, message: 'Error al crear usuario', error: error.message });
    }
};

// Editar rol de usuario (solo admin)
const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { rol } = req.body;

        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).json({ status: 404, message: 'Usuario no encontrado' });
        }

        if (!['admin', 'moderador', 'cliente'].includes(rol)) {
            return res.status(400).json({ status: 400, message: 'Rol inválido' });
        }

        usuario.rol = rol;
        await usuario.save();

        res.status(200).json({ status: 200, message: 'Rol actualizado exitosamente', data: usuario });
    } catch (error) {
        res.status(500).json({ status: 500, message: 'Error al actualizar rol', error: error.message });
    }
};

// Eliminar usuario
const deleteUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id);
        if (!usuario) {
            return res.status(404).json({ status: 404, message: 'Usuario no encontrado' });
        }

        await usuario.destroy();

        res.status(200).json({ status: 200, message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ status: 500, message: 'Error al eliminar usuario', error: error.message });
    }
};


// Actualizar usuario
const updateUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, email, edad, password, rol } = req.body;

        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).json({ status: 404, message: 'Usuario no encontrado' });
        }

        usuario.nombre = nombre || usuario.nombre;
        usuario.email = email || usuario.email;
        usuario.edad = edad || usuario.edad;
        usuario.rol = rol || usuario.rol;

        if (password) {
            usuario.password = await bcrypt.hash(password, 10);
        }

        await usuario.save();

        res.status(200).json({ status: 200, message: 'Usuario actualizado exitosamente', data: usuario });
    } catch (error) {
        console.error("❌ Error al actualizar usuario:", error);
        res.status(500).json({ status: 500, message: 'Error al actualizar usuario', error: error.message });
    }
};

module.exports = {
    getUsuarios,
    getUsuarioById,
    createUsuario,
    updateUsuario,
    deleteUsuario,
    updateUserRole, // <-- nuevo
};

