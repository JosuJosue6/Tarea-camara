
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';


// Function to check if a user exists
export const getUserByUsername = async (db, username) => {
    console.log('SELECT DB USERNAME')
    return await db.getFirstAsync('SELECT * FROM users WHERE username = ?', [username]);
};

// Function to insert a new user
export const insertUser = async (db, username, password) => {
    console.log('INSERT DB',[username, password])
    await db.runAsync('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);
};

// Function to validate login credentials
export const validateLogin = async (db, username, password) => {
    console.log('SELECT DB username  password ',[username, password])
    return await db.getFirstAsync('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
};
export const getAllUsers = async (db) => {
    try {
        const users = await db.allAsync('SELECT DB users');
        return users;
    } catch (error) {
        console.log('Error al obtener todos los usuarios:', error);
        return [];
    }
};
