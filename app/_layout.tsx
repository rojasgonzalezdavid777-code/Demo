import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#0056b3', // Color azul para el encabezado
        },
        headerTintColor: '#fff', // Texto blanco en el encabezado
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      {/* Pantalla principal (Index) */}
      <Stack.Screen 
        name="index" 
        options={{ 
          headerShown: false // Escondemos el header en la bienvenida
        }} 
      />
      
      {/* Pantalla de detalles (Mapa) */}
      <Stack.Screen 
        name="detalles" 
        options={{ 
          title: 'Visor de Ruta',
          headerBackTitle: 'Volver' 
        }} 
      />
    </Stack>
  );
}