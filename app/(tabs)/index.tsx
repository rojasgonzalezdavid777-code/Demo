import { Image } from 'expo-image';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <ThemedView style={styles.mainContainer}>
      
      {/* 1. Imagen de Fondo */}
      <Image
        source={require('@/assets/images/pibble.jpeg')} 
        style={StyleSheet.absoluteFillObject} // Ocupa todo el espacio disponible
        contentFit="cover"
      />

      {/* Capa de superposición (Overlay) para que el texto sea legible */}
      <View style={styles.overlay}>
        
        {/* 2. Contenido superior/medio */}
        <View style={styles.content}>
          <ThemedText type="title" style={styles.titleText}>
            Demo App
          </ThemedText>
        </View>

        {/* 3. Botón abajo */}
        <View style={styles.buttonWrapper}>
          <Link href="/explore" asChild>
            <TouchableOpacity style={styles.button} activeOpacity={0.8}>
              <ThemedText type="defaultSemiBold" style={styles.buttonText}>
                INGRESAR
              </ThemedText>
            </TouchableOpacity>
          </Link>
        </View>

      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)', // Oscurece un poco la imagen para que resalte el texto
    justifyContent: 'space-between',
    paddingVertical: 80,
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  titleText: {
    color: '#FFFFFF',
    fontSize: 42,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)', // Sombra para legibilidad
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  buttonWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 18,
    paddingHorizontal: 60,
    borderRadius: 30, // Botón más redondeado para un look moderno
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
});