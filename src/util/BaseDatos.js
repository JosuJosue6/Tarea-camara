import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';

// Initialize the database and create the table if it doesn't exist
export const initializeDatabase = async (db) => {
    try {
        await db.execAsync(`
            PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE,
                password TEXT
            );
            CREATE TABLE IF NOT EXISTS vehicles (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                placa TEXT UNIQUE,
                marca TEXT,
                fecFabricacion TEXT,
                color TEXT,
                costo REAL,
                activo BOOLEAN,
                image TEXT
            );
        `);

        // Check if the 'image' column exists, if not, add it
        const tableInfo = await db.getAllAsync("PRAGMA table_info(vehicles)");
        const imageColumnExists = tableInfo.some(column => column.name === 'image');
        if (!imageColumnExists) {
            await db.execAsync("ALTER TABLE vehicles ADD COLUMN image TEXT");
            console.log('Column "image" added to vehicles table');
        }

        console.log('Database initialized!');
    } catch (error) {
        console.log('Error while initializing the database: ', error);
    }
};