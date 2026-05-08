import { useRouter } from 'expo-router'; // 1. Importamos el router
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { globalStyles } from './styles/styles';

export default function App() {
  const router = useRouter(); // 2. Inicializamos el router

  return (
    <View style={globalStyles.container}>
      
      <View style={globalStyles.header}>
        <Text style={globalStyles.title}>Bienvenido!!!</Text>
        <Text style={globalStyles.subtitle}>Da click para ingresar</Text>
        

        <Image 
          source={require('../assets/images/rutasbog.png')} 
          style={globalStyles.image}
          resizeMode="cover"
        />
      </View>

      <TouchableOpacity 
        style={globalStyles.button}
        activeOpacity={0.8}
        // 3. Agregamos la función de navegación al presionar
        onPress={() => router.push('/detalles')} 
      >
        <Text style={globalStyles.buttonText}>INGRESAR</Text>
      </TouchableOpacity>

    </View>
  );
}