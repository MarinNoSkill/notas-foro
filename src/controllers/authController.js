const { connectToDb } = require('../config/dbconfig');

// Función para mostrar el formulario de inicio de sesión
const showLoginForm = (req, res) => res.render('login');

// Función para mostrar el formulario de registro
const showRegisterForm = (req, res) => {
    const errorMessage = req.query.error || null;  // Capturamos cualquier mensaje de error que venga en la query
    res.render('register', { error: errorMessage });
};

// Función para registrar un usuario
const registerUser = async (req, res) => {
    const { DocId, Nombre, Correo, Contraseña } = req.body;
    const fechaRegistro = new Date();  // Fecha actual para 'Fecha_Registro'

    try {
        // Validar que los campos no estén vacíos
        if (!DocId || !Nombre || !Correo || !Contraseña) {
            return res.redirect('/auth/register?error=Todos los campos son obligatorios');
        }

        const db = await connectToDb();
        
        // Consulta para registrar el nuevo usuario
        await db.request()
            .input('DocId', DocId)
            .input('Nombre', Nombre)
            .input('Correo', Correo)
            .input('Contraseña', Contraseña)  // Guardar la contraseña tal cual
            .input('Fecha_Registro', fechaRegistro)
            .query(`
                INSERT INTO Usuario (DocId, Nombre, Correo, Contraseña, Fecha_Registro)
                VALUES (@DocId, @Nombre, @Correo, @Contraseña, @Fecha_Registro)
            `);

        // Redirigir con mensaje de éxito
        res.redirect('/auth/login?success=Usuario registrado con éxito');
    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        res.redirect('/auth/register?error=Hubo un problema al registrar el usuario');
    }
};

// Función para iniciar sesión
const loginUser = async (req, res) => {
    const { Correo, Contraseña } = req.body;

    try {
        // Validación de los campos
        if (!Correo || !Contraseña) {
            return res.send('<script>alert("Por favor ingrese ambos campos."); window.location.href = "/auth/login";</script>');
        }

        const db = await connectToDb();
        const result = await db.request()
            .input('Correo', Correo)
            .query('SELECT * FROM Usuario WHERE Correo = @Correo');

        if (result.recordset.length === 0) {
            return res.send('<script>alert("Usuario no encontrado"); window.location.href = "/auth/login";</script>');
        }

        const user = result.recordset[0];

        // Comprobar si la contraseña ingresada es la misma que la almacenada
        if (Contraseña === user.Contraseña) {
            // Si las contraseñas coinciden, redirigir al dashboard
            res.send('<script>alert("Inicio de sesión exitoso"); window.location.href = "/dashboard";</script>');
        } else {
            // Si la contraseña es incorrecta
            res.send('<script>alert("Contraseña incorrecta"); window.location.href = "/auth/login";</script>');
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.send('<script>alert("Hubo un problema al iniciar sesión"); window.location.href = "/auth/login";</script>');
    }
};

module.exports = { showLoginForm, showRegisterForm, registerUser, loginUser };
