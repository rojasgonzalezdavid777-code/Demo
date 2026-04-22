import { Image } from 'expo-image';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <ThemedView style={styles.mainContainer}>
      
      {/* 1. Imagen arriba (Pibble) */}
      <ThemedView style={styles.imageContainer}>
        <Image
          source={require('@/assets/images/pibble.jpeg')} 
          style={styles.mainImage}
          contentFit="cover"
        />
      </ThemedView>

      {/* 2. Texto en el medio */}
      <ThemedView style={styles.textContainer}>
        <ThemedText type="title" style={styles.textCenter}>
          Demo App
        </ThemedText>
      </ThemedView>

      {/* 3. Botón ingresar abajo */}
      <ThemedView style={styles.buttonContainer}>
        <Link href="/explore" asChild>
          <TouchableOpacity style={styles.button}>
            <ThemedText type="defaultSemiBold" style={styles.buttonText}>
              INGRESAR
            </ThemedText>
          </TouchableOpacity>
        </Link>
      </ThemedView>

    </ThemedView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 60, 
  },
  imageContainer: {
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  mainImage: {
    width: 250,
    height: 250,
    borderRadius: 20, // Bordes redondeados para que se vea mejor el perrito
  },
  textContainer: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  textCenter: {
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 16,
    paddingHorizontal: 80,
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1.2,
  },
});