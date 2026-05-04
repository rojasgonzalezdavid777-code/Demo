import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform, TouchableOpacity } from 'react-native';

export default function DetallesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      
      {/* Mitad superior: MAPA REAL */}
      <View style={styles.topHalf}>
        {Platform.OS === 'web' ? (
          <iframe
            // URL de OpenStreetMap (Funciona siempre en web sin API Key)
            src="https://www.openstreetmap.org/export/embed.html?bbox=-74.20,4.55,-73.95,4.75&layer=mapnik"
            width="100%"
            height="100%"
            style={{ border: 0 }}
          />
        ) : (
          <View style={styles.placeholderMobile}><Text>Mapa Móvil</Text></View>
        )}
      </View>

      {/* Mitad inferior */}
      <View style={styles.bottomHalf}>
        
        {/* BOTÓN CHIQUITICO en la esquina superior derecha */}
        <TouchableOpacity 
          style={styles.miniButton}
          onPress={() => alert('Configuración abierta')}
        >
          <Text style={styles.miniButtonText}>boton</Text>
        </TouchableOpacity>

        {/* El resto de tu contenido */}
        <View style={styles.content}>
           <Text style={styles.mainTitle}>Información de Ruta</Text>
           <Text style={styles.subtitle}>Bogotá, Colombia</Text>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topHalf: {
    flex: 0.5,
    backgroundColor: '#eee',
  },
  bottomHalf: {
    flex: 0.5,
    padding: 10,
  },
  miniButton: {
    backgroundColor: '#deff9a',
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 4,
    alignSelf: 'flex-end', // Mantiene el botón a la derecha
  },
  miniButtonText: {
    fontSize: 9,
    color: '#000',
    fontWeight: '700',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  placeholderMobile: {
    flex: 1,
    backgroundColor: '#0056b3',
    justifyContent: 'center',
    alignItems: 'center',
  }
});