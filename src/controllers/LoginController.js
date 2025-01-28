import CryptoJS from "crypto-js";
import { useSQLiteContext } from 'expo-sqlite';
import { getUserByUsername, validateLogin, insertUser, getAllUsers } from '../models/IntegrantesModels';

// Función de hash usando crypto-js
function hash(contrasenia) {
    const hashHex = CryptoJS.SHA256(contrasenia).toString(CryptoJS.enc.Hex);
    return hashHex;
}

// Función para autenticar al usuario
export const autenticar = async (db,nombre, contrasenia) => {
    const hashedPassword = hash(contrasenia);

    try {
        // Validar las credenciales en la base de datos
        const isValid = await validateLogin(db, nombre, hashedPassword); // Pasamos el `db` desde el contexto
        return isValid;
    } catch (error) {
        console.log('Error al autenticar usuario:', error);
        return false;
    }
};

// Función para registrar un nuevo integrante
// Función para registrar un nuevo integrante
export const registrarIntegrante = async (db, nombre, contrasenia) => {
    const hashedPassword = hash(contrasenia);

    try {
        // Insertar el nuevo usuario en la base de datos
        await insertUser(db, nombre, hashedPassword); // Pasamos el `db` desde el contexto
        console.log('Usuario registrado con éxito');

        // Obtener todos los usuarios registrados
        const users = await getAllUsers(db); // Obtenemos todos los usuarios
        console.log('Usuarios registrados:', users); // Muestra los usuarios en la consola
    } catch (error) {
        console.log('Error al registrar usuario:', error);
    }
};

export const obtenerUsuarioPorUsername = async (db, username) => {
    try {
        // Ejecutar la consulta SQL para obtener el usuario por su nombre de usuario
        const user = await db.getFirstAsync('SELECT * FROM users WHERE username = ?', [username]);
        return user;
    } catch (error) {
        console.error("Error al obtener el usuario:", error);
        throw error; // Lanzar el error para manejarlo en el lugar donde se llama la función
    }
};