import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Switch, ScrollView, Alert, TouchableOpacity, Image } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from 'expo-image-picker';
import { useSQLiteContext } from 'expo-sqlite';
import { obtenerVehiculoPorId, editarVehiculo } from "../controllers/VehiculoConstroller";

const EditarVehiculoPantalla = ({ navigation, route }) => {
    const db = useSQLiteContext();
    const { id } = route.params;
    const [placa, setPlaca] = useState("");
    const [marca, setMarca] = useState("");
    const [fecFabricacion, setFecFabricacion] = useState(new Date());
    const [color, setColor] = useState("");
    const [costo, setCosto] = useState("");
    const [activo, setActivo] = useState(true);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [image, setImage] = useState(null);

    useEffect(() => {
        const fetchVehiculo = async () => {
            try {
                const vehiculo = await obtenerVehiculoPorId(db, id);
                setPlaca(vehiculo.placa);
                setMarca(vehiculo.marca);
                setFecFabricacion(new Date(vehiculo.fecFabricacion));
                setColor(vehiculo.color);
                setCosto(vehiculo.costo.toString());
                setActivo(vehiculo.activo);
                setImage(vehiculo.image);
            } catch (error) {
                console.error("Error fetching vehicle:", error);
            }
        };

        fetchVehiculo();
    }, [db, id]);

    const handleGuardar = async () => {
        if (!placa || !marca || !fecFabricacion || !costo) {
            Alert.alert("Error", "Por favor completa todos los campos.");
            return;
        }
        const formatoPlaca = /^[A-Z]{3}-\d{4}$/;

        if (!formatoPlaca.test(placa)) {
            Alert.alert("Error", "El formato de la placa es INCORRECTO ejemplo: ACF-8963");
            return;
        }

        const vehiculo = {
            placa,
            marca,
            fecFabricacion: fecFabricacion.toISOString().split("T")[0],
            color,
            costo: parseFloat(costo),
            activo,
            image
        };

        try {
            await editarVehiculo(db, id, vehiculo);
            navigation.goBack();
        } catch (error) {
            Alert.alert("Error", "No se pudo actualizar el vehículo.");
        }
    };

    const showDatepicker = () => setShowDatePicker(true);

    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate || fecFabricacion;
        setShowDatePicker(false);
        setFecFabricacion(currentDate);
    };

    const pickImageFromGallery = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const takePhoto = async () => {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.form}>
                <Text style={styles.label}>Placa:</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setPlaca}
                    value={placa}
                    placeholder="Ingrese la placa"
                />

                <Text style={styles.label}>Marca:</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setMarca}
                    value={marca}
                    placeholder="Ingrese la marca"
                />

                <Text style={styles.label}>Fecha Fabricación:</Text>
                <Button title="Seleccionar fecha" onPress={showDatepicker} />
                {showDatePicker && (
                    <DateTimePicker
                        value={fecFabricacion}
                        mode="date"
                        display="default"
                        onChange={onChangeDate}
                    />
                )}
                <Text style={styles.selectedDate}>
                    Fecha seleccionada: {fecFabricacion.toISOString().split("T")[0]}
                </Text>

                <Text style={styles.label}>Color:</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setColor}
                    value={color}
                    placeholder="Ingrese el color"
                />

                <Text style={styles.label}>Costo:</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={setCosto}
                    value={costo}
                    placeholder="Ingrese el costo"
                    keyboardType="numeric"
                />

                <View style={styles.switchContainer}>
                    <Text style={styles.label}>Activo:</Text>
                    <Switch
                        value={activo}
                        onValueChange={(value) => setActivo(value)}
                        style={styles.switch}
                    />
                </View>

                <Button title="Seleccionar Imagen de Galería" onPress={pickImageFromGallery} />
                <Button title="Tomar Foto" onPress={takePhoto} />
                {image && (
                    <View style={styles.imageContainer}>
                        <Image source={{ uri: image }} style={styles.imagePreview} />
                    </View>
                )}

                <Button title="Guardar" onPress={handleGuardar} />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: "#f5f5f5",
        justifyContent: "center",
        alignItems: "center",
    },
    form: {
        backgroundColor: "#ffffff",
        padding: 20,
        borderRadius: 10,
        width: "90%",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5,
        color: "#333",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
        backgroundColor: "#f9f9f9",
    },
    selectedDate: {
        fontSize: 14,
        marginBottom: 10,
        color: "#555",
    },
    switchContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
    },
    switch: {
        marginLeft: 10,
    },
    imageContainer: {
        alignItems: "center",
        marginTop: 15,
        marginBottom: 15,
    },
    imagePreview: {
        width: 200,
        height: 200,
        borderRadius: 10,
    },
});

export default EditarVehiculoPantalla;