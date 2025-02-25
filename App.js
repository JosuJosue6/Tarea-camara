import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import 'react-native-gesture-handler';
import LoginPantalla from "./src/views/LoginPantalla";
import RegistroPantalla from "./src/views/RegistroPantalla";
import VehiculosPantalla from "./src/views/VehiculosPantalla";
import NuevoVehiculoPantalla from "./src/views/NuevoVehiculoPantalla";
import EditarVehiculoPantalla from "./src/views/EditarVehiculoPantalla";
import HomePantalla from "./src/views/HomePantalla";

import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
import { initializeDatabase, syncLocalDataWithAWS } from './src/util/BaseDatos';
import NetInfo from '@react-native-community/netinfo';

const Stack = createStackNavigator();

const App = () => {
  const db = useSQLiteContext();

  useEffect(() => {
    const initDB = async () => {
      await initializeDatabase(db);
      await syncLocalDataWithAWS(db);
    };
    initDB();

    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        syncLocalDataWithAWS(db);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [db]);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginPantalla">
        <Stack.Screen name="LoginPantalla" component={LoginPantalla} />
        <Stack.Screen name="HomePantalla" component={HomePantalla} />
        <Stack.Screen name="RegistroPantalla" component={RegistroPantalla} />
        <Stack.Screen name="VehiculosPantalla" component={VehiculosPantalla} />
        <Stack.Screen name="NuevoVehiculoPantalla" component={NuevoVehiculoPantalla} />
        <Stack.Screen name="EditarVehiculoPantalla" component={EditarVehiculoPantalla} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const AppWrapper = () => (
  <SQLiteProvider databaseName="auth.db" onInit={initializeDatabase}>
    <App />
  </SQLiteProvider>
);

export default AppWrapper;