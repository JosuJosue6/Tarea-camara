import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { autenticar, obtenerUsuarioPorUsername } from "../controllers/LoginController";
import { useSQLiteContext } from 'expo-sqlite';
import CryptoJS from "crypto-js";

// Función de hash usando crypto-js
function hash(contrasenia) {
    const hashHex = CryptoJS.SHA256(contrasenia).toString(CryptoJS.enc.Hex);
    return hashHex;
}

const LoginPantalla = ({ navigation }) => {
    const db = useSQLiteContext();
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        if (userName.length === 0 || password.length === 0) {
            Alert.alert('Attention', 'Please enter both username and password');
            return;
        }
        try {
            const user = await obtenerUsuarioPorUsername(db, userName);
            if (!user) {
                Alert.alert('Error', 'Username no existe!');
                return;
            }
            const validUser = await autenticar(db, userName, password);
            if (validUser) {
                Alert.alert('Success', 'Login successful');
                navigation.navigate("HomePantalla");
                setUserName('');
                setPassword('');
            } else {
                Alert.alert('Error', 'Incorrect password');
            }
        } catch (error) {
            console.log('Error during login: ', error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.loginBox}>
                <Text style={styles.title}>Iniciar sesión</Text>
                <Text style={styles.label}>Nombre:</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setUserName}
                    value={userName}
                    placeholder="Ingrese su nombre"
                />
                <Text style={styles.label}>Contraseña:</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setPassword}
                    value={password}
                    placeholder="Ingrese su contraseña"
                    secureTextEntry={true}
                />
                <Button title="Iniciar sesión" onPress={handleLogin} />
                <View style={{ height: 20 }} />
                <Button title="Registrarse" onPress={() => navigation.navigate("RegistroPantalla")} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
    },
    loginBox: {
        width: "80%",
        backgroundColor: "#ffffff",
        borderRadius: 10,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
        color: "#333",
    },
    label: {
        fontSize: 14,
        color: "#555",
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        backgroundColor: "#f9f9f9",
    },
});

export default LoginPantalla;
