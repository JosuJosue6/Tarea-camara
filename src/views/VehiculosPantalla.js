import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Button, Alert, Image, Modal } from "react-native";
import { obtenerVehiculos, eliminarVehiculo } from "../controllers/VehiculoConstroller";
import { useSQLiteContext } from 'expo-sqlite';
import { useIsFocused } from '@react-navigation/native';

const VehiculosPantalla = ({ navigation }) => {
    const isFocused = useIsFocused();
    const db = useSQLiteContext();
    const [vehiculos, setVehiculos] = useState([]); // Estado local para manejar la lista de vehículos
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    // Obtener vehículos desde la base de datos cuando se monta el componente
    const fetchVehiculos = async () => {
        try {
            const allRows = await db.getAllAsync("SELECT * FROM vehicles");
            console.log("Lista de vehículos", allRows);
            setVehiculos(allRows);
        } catch (error) {
            console.log("Error while loading vehicles:", error);
        }
    };

    useEffect(() => {
        navigation.setOptions({
            headerShown: false, // Esto elimina el encabezado con la flecha de retroceso
        });
        if (isFocused) {
            fetchVehiculos(); // Actualiza la lista solo cuando la pantalla está activa
        }
    }, [isFocused, navigation]);

    const handleSignOut = async () => {
        try {
            // Cierra la sesión de Firebase
            navigation.reset({
                index: 0, // Esto indica que la nueva pantalla será la principal
                routes: [{ name: "LoginPantalla" }], // Reemplaza "Login" con el nombre de tu pantalla de inicio de sesión
            });
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    };

    const handleDelete = (id) => {
        Alert.alert(
            "Confirmar eliminación",
            "¿Estás seguro de que deseas eliminar este vehículo?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Confirmar",
                    onPress: async () => {
                        await eliminarVehiculo(db, id); // Eliminar el vehículo desde la base de datos
                        const updatedVehiculos = await db.getAllAsync('SELECT * FROM vehicles'); // Obtener la lista de vehículos actualizada
                        setVehiculos(updatedVehiculos); // Actualizar el estado con los vehículos actualizados
                        alert("Vehículo eliminado");
                    }
                }
            ]
        );
    };

    const handleImagePress = (imageUri) => {
        setSelectedImage(imageUri);
        setModalVisible(true);
    };

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            {item.image && (
                <TouchableOpacity onPress={() => handleImagePress(`data:image/jpeg;base64,${item.image}`)}>
                    <Image source={{ uri: `data:image/jpeg;base64,${item.image}` }} style={styles.image} />
                </TouchableOpacity>
            )}
            <View style={styles.infoContainer}>
                <Text style={styles.label}>Placa:</Text>
                <Text style={styles.value}>{item.placa.toUpperCase()}</Text>

                <Text style={styles.label}>Marca:</Text>
                <Text style={styles.value}>{item.marca}</Text>

                <Text style={styles.label}>Fecha de Fabricación:</Text>
                <Text style={styles.value}>{item.fecFabricacion}</Text>

                <Text style={styles.label}>Color:</Text>
                <Text style={styles.value}>{item.color}</Text>

                <Text style={styles.label}>Costo:</Text>
                <Text style={styles.value}>{`${item.costo} $`}</Text>

                <Text style={styles.label}>Activo:</Text>
                <Text style={styles.value}>{item.activo ? "Sí" : "No"}</Text>
            </View>
            <View style={styles.buttonContainer}>
                <Button title="Editar" onPress={() => navigation.navigate("EditarVehiculoPantalla", { id: item.id })} />
                <Button title="Eliminar" onPress={() => handleDelete(item.id)} color="red" />
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={vehiculos}
                keyExtractor={(item) => item.id.toString()} // Usa el id como clave única para cada item
                renderItem={renderItem}
            />
            <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate("NuevoVehiculoPantalla")}
            >
                <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleSignOut}
            >
                <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
            </TouchableOpacity>

            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <TouchableOpacity style={styles.modalCloseButton} onPress={() => setModalVisible(false)}>
                        <Text style={styles.modalCloseButtonText}>X</Text>
                    </TouchableOpacity>
                    {selectedImage && (
                        <Image source={{ uri: selectedImage }} style={styles.modalImage} />
                    )}
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f5f5f5",
    },
    itemContainer: {
        padding: 10,
        marginVertical: 5,
        marginHorizontal: 10,
        backgroundColor: "#ffffff",
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 10,
        alignSelf: "center",
    },
    infoContainer: {
        flex: 1,
        justifyContent: "center",
        marginLeft: 10,
    },
    label: {
        fontWeight: "bold",
        fontSize: 14,
        color: "#555",
    },
    value: {
        fontSize: 14,
        color: "#333",
        marginBottom: 5,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
    },
    addButton: {
        position: "absolute",
        bottom: 20,
        right: 20,
        backgroundColor: "#2196F3",
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    addButtonText: {
        color: "#fff",
        fontSize: 30,
        fontWeight: "bold",
    },
    logoutButton: {
        position: "absolute",
        top: 35,
        right: 20,
        backgroundColor: "#d32f2f",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    logoutButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalImage: {
        width: '90%',
        height: '70%',
        borderRadius: 10,
    },
    modalCloseButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 10,
    },
    modalCloseButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
});

export default VehiculosPantalla;