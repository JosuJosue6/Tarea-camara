import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, Switch, StyleSheet, ScrollView, Image } from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { agregarVehiculo } from "../controllers/VehiculoConstroller";
import { useSQLiteContext } from 'expo-sqlite';
import { insertVehicle } from "../models/VehiculoModels";

const NuevoVehiculoPantalla = ({ navigation }) => {
    const db = useSQLiteContext();
    const [placa, setPlaca] = useState("");
    const [marca, setMarca] = useState("Toyota");
    const [fecFabricacion, setFecFabricacion] = useState(new Date());
    const [color, setColor] = useState("Blanco");
    const [costo, setCosto] = useState("");
    const [activo, setActivo] = useState(true);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [image, setImage] = useState(null);

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

        let base64Image = null;
        if (image) {
            const fileInfo = await FileSystem.readAsStringAsync(image, { encoding: FileSystem.EncodingType.Base64 });
            base64Image = fileInfo;
            console.log("Image converted to Base64"); // Print the Base64 string to the console
        }

        const vehiculo = {
            placa: placa,
            marca: marca,
            fecFabricacion: fecFabricacion.toISOString().split("T")[0],
            color: color,
            costo: parseFloat(costo),
            activo: activo,
            image: base64Image
        };

        console.log("Vehicle data to be saved:", vehiculo); // Print the vehicle data to the console

        await agregarVehiculo(db, vehiculo);

        navigation.goBack();
    };

    const showDatepicker = () => setShowDatePicker(true);

    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate || fecFabricacion;
        setShowDatePicker(false);
        setFecFabricacion(currentDate);
    };

    const pickImage = async () => {
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
                <Picker
                    selectedValue={marca}
                    style={styles.picker}
                    onValueChange={(itemValue) => setMarca(itemValue)}
                >
                    <Picker.Item label="Toyota" value="Toyota" />
                    <Picker.Item label="Honda" value="Honda" />
                    <Picker.Item label="Mazda" value="Mazda" />
                    <Picker.Item label="Ford" value="Ford" />
                    <Picker.Item label="Chevrolet" value="Chevrolet" />
                    <Picker.Item label="Nissan" value="Nissan" />
                    <Picker.Item label="BMW" value="BMW" />
                    <Picker.Item label="Mercedes-Benz" value="Mercedes-Benz" />
                    <Picker.Item label="Audi" value="Audi" />
                    <Picker.Item label="Volkswagen" value="Volkswagen" />
                    <Picker.Item label="Hyundai" value="Hyundai" />
                    <Picker.Item label="Kia" value="Kia" />
                </Picker>

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
                <View style={styles.colorOptions}>
                    <Button
                        title="Blanco"
                        onPress={() => setColor("Blanco")}
                        color={color === "Blanco" ? "green" : "gray"}
                    />
                    <Button
                        title="Negro"
                        onPress={() => setColor("Negro")}
                        color={color === "Negro" ? "green" : "gray"}
                    />
                    <Button
                        title="Azul"
                        onPress={() => setColor("Azul")}
                        color={color === "Azul" ? "green" : "gray"}
                    />
                </View>

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

                <Button title="Tomar Foto" onPress={pickImage} />
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
    picker: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        backgroundColor: "#f9f9f9",
        marginBottom: 15,
    },
    selectedDate: {
        fontSize: 14,
        marginBottom: 10,
        color: "#555",
    },
    colorOptions: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 15,
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

export default NuevoVehiculoPantalla;