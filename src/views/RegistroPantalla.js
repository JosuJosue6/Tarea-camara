import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet,Alert } from "react-native";
import { registrarIntegrante , obtenerUsuarioPorUsername} from "../controllers/LoginController";
import { useSQLiteContext } from 'expo-sqlite';

export default function RegistroPantalla({ navigation }) {
    const db = useSQLiteContext();
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        if (!userName || !password) {
            Alert.alert("Por favor, complete todos los campos.");
            return;
        }
        try {
            const existingUser = await obtenerUsuarioPorUsername(db, userName);
            if (existingUser) {
                Alert.alert('Error', 'El nombre de usuario ya existe.');
                return;
            }
            await registrarIntegrante(db, userName, password);
            Alert.alert('Success', 'Registration successful!');
            const users =  await db.getAllAsync("SELECT * FROM users"); // Obtenemos todos los usuarios
            console.log('Usuarios registrados:', users); // Muestra los usuarios en la consola
            
            navigation.navigate("LoginPantalla");
        } catch (error) {
            console.log('Error during registration: ', error);
        }
        
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Nombre</Text>
            <TextInput
                value={userName}
                onChangeText={setUserName}
                style={styles.input}
                placeholder="Ingrese su nombre"
            />
            <Text style={styles.label}>Contraseña</Text>
            <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
                placeholder="Ingrese su contraseña"
            />
            <Button title="Registrarse" onPress={handleRegister} color="#1E90FF" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        padding: 20,
        justifyContent: "center",
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        fontWeight: "bold",
        color: "#333",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        backgroundColor: "#fff",
        fontSize: 16,
    },
});
