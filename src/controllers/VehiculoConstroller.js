import { insertVehicle, getAllVehicles, updateVehicle, deleteVehicle,getVehicleById  } from "../models/VehiculoModels";

// Agregar un vehículo
export const agregarVehiculo = async (db, vehiculo) => {
    try {
        await insertVehicle(db, vehiculo.placa, vehiculo.marca, vehiculo.fecFabricacion, vehiculo.color, vehiculo.costo, vehiculo.activo, vehiculo.image);
        console.log('Nuevo vehículo agregado');
    } catch (error) {
        console.log('Error al agregar vehículo:', error);
    }
};

// Obtener todos los vehículos
export const obtenerVehiculos = async (db) => {
    try {
        const vehiculos = await getAllVehicles(db);
        console.log('Vehículos obtenidos Controller:', vehiculos);
        return vehiculos;
    } catch (error) {
        console.log('Error al obtener vehículos Controller:', error);
    }
};

// Editar un vehículo
export const editarVehiculo = async (db, id, vehiculo) => {
    const { placa, marca, fecFabricacion, color, costo, activo, image } = vehiculo;
    try {
        await updateVehicle(db, id, { placa, marca, fecFabricacion, color, costo, activo, imagePath: image });
        console.log('Vehículo actualizado');
    } catch (error) {
        console.error('Error al actualizar vehículo:', error);
        throw error;
    }
};

// Eliminar un vehículo
export const eliminarVehiculo = async (db, id) => {
    try {
        await deleteVehicle(db, id);
        console.log('Vehículo eliminado');
    } catch (error) {
        console.log('Error al eliminar vehículo:', error);
    }
};
export const obtenerVehiculoPorId = async (db, id) => {
    try {
        const vehicle = await getVehicleById(db, id); // Llamamos al modelo
        if (vehicle) {
            console.log('Vehículo encontrado:', vehicle);
        } else {
            console.log('No se encontró el vehículo con el ID:', id);
        }
        return vehicle;
    } catch (error) {
        console.log('Error al obtener el vehículo por ID:', error);
        throw error; // Re-throw si necesitas manejarlo más arriba
    }
};