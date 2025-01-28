import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, Button } from 'react-native';

const HomePantalla = ({ navigation }) => {
    useEffect(() => {
        navigation.setOptions({
            headerShown: false, // Oculta el encabezado con la flecha de retroceso
        });
    }, [navigation]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bienvenido a NOAJ Vehículos</Text>
            <Image
                source={require('../../assets/iconApp/logo.png')} 
                style={styles.image}
            />
            <Text style={styles.description}>
                Esta aplicación te permite gestionar tus vehículos de manera eficiente. Puedes agregar, editar y eliminar vehículos, así como ver detalles importantes de cada uno.
            </Text>
            <Button
                title="Comenzar"
                onPress={() => navigation.navigate('VehiculosPantalla')}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    image: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 20,
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        color: '#333',
    },
});

export default HomePantalla;