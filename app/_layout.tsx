import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { Platform, StyleSheet, TextInput, View } from 'react-native';

export default function Layout() {
  return (
    <Stack 
      screenOptions={{ 
        // 1. IMPORTANTE: Hacemos que el fondo de la transición sea transparente o blanco
        // pero que no bloquee el contenido absoluto.
        contentStyle: { backgroundColor: '#fff' }, 
        headerStyle: { 
          backgroundColor: '#0056b3', // Azul SITP
          ...Platform.select({
            android: { elevation: 0 }, 
            ios: { shadowColor: 'transparent' }
          })
        }, 
        headerTintColor: '#fff',
        headerTitleAlign: 'center',
        // 2. Transparencia en el header para que el mapa pueda subir si es necesario
        headerTransparent: false, 
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />

      <Stack.Screen 
        name="detalles" 
        options={{ 
          // Quitamos cualquier restricción de título para que el buscador respire
          headerTitle: () => (
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={18} color="rgba(255,255,255,0.7)" style={styles.searchIcon} />
              <TextInput 
                placeholder="Buscar paradero o ruta..." 
                placeholderTextColor="rgba(255,255,255,0.5)" 
                style={styles.searchInput} 
                selectionColor="#fff"
              />
            </View>
          ),
          // Esto ayuda a que el contenido (el mapa) use todo el espacio debajo del header
          headerShadowVisible: false,
        }} 
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)', 
    borderRadius: 8, // Ajustado para que pegue con el estilo de los iconos cuadrados del mapa
    paddingHorizontal: 15,
    height: 38,
    width: '100%', // Usamos el 100% del espacio disponible en el header
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  searchIcon: { 
    marginRight: 8 
  },
  searchInput: { 
    color: '#fff', 
    flex: 1, 
    fontSize: 14, 
    fontWeight: '500',
    paddingVertical: 0 
  },
});