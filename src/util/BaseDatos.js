import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
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

// Function to pick an image and save it to the database
export const pickImageAndSaveToDatabase = async (db) => {
    launchImageLibrary({}, async (response) => {
        if (response.didCancel) {
            console.log('User cancelled image picker');
        } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
        } else {
            const base64Image = response.assets[0].base64;
            const vehicle = {
                placa: 'ABC-1234',
                marca: 'Toyota',
                fecFabricacion: '2022-01-01',
                color: 'Blanco',
                costo: 20000,
                activo: true,
                image: base64Image
            };

            try {
                const state = await NetInfo.fetch();
                if (state.isConnected) {
                    // Save to AWS
                    await axios.post('https://3b7f-104-199-173-152.ngrok-free.app/vehiculos', vehicle);
                    console.log('Image saved to AWS');
                } else {
                    // Save to local database
                    await db.execAsync(`INSERT INTO vehicles (placa, marca, fecFabricacion, color, costo, activo, image) VALUES (?, ?, ?, ?, ?, ?, ?)`, 
                        [vehicle.placa, vehicle.marca, vehicle.fecFabricacion, vehicle.color, vehicle.costo, vehicle.activo, vehicle.image]);
                    console.log('Image saved to local database');
                }
            } catch (error) {
                console.log('Error saving image:', error);
            }
        }
    });
};

// Function to sync local data with AWS
export const syncLocalDataWithAWS = async (db) => {
    try {
        const state = await NetInfo.fetch();
        if (state.isConnected) {
            const localVehicles = await db.getAllAsync("SELECT * FROM vehicles");
            for (const vehicle of localVehicles) {
                await axios.post('https://3b7f-104-199-173-152.ngrok-free.app/vehiculos', vehicle);
                await db.execAsync("DELETE FROM vehicles WHERE id = ?", [vehicle.id]);
            }
            console.log('Local data synced with AWS');
        }
    } catch (error) {
        console.log('Error syncing data with AWS:', error);
    }
};