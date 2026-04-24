import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
// Importamos los estilos desde la carpeta styles
import { globalStyles } from './styles/styles';

export default function App() {
  return (
    <View style={globalStyles.container}>
      
      {/* Parte superior: Textos e Imagen */}
      <View style={globalStyles.header}>
        <Text style={globalStyles.title}>Hola!!!</Text>
        <Text style={globalStyles.subtitle}>David Rojas</Text>
        <Text style={globalStyles.date}>24/04/2026</Text>

        {/* Imagen del SITP */}
        <Image 
          source={require('../assets/images/foto_sitp.png')} 
          style={globalStyles.image}
          resizeMode="cover"
        />
      </View>

      {/* Botón de Ingreso */}
      <TouchableOpacity 
        style={globalStyles.button}
        activeOpacity={0.8}
      >
        <Text style={globalStyles.buttonText}>INGRESAR</Text>
      </TouchableOpacity>

    </View>
  );
}