import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';
import { StyleSheet, TextInput, View } from 'react-native';

export default function Layout() {
  return (
    <Stack screenOptions={{ headerStyle: { backgroundColor: '#0056b3' }, headerTintColor: '#fff' }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen 
        name="detalles" 
        options={{ 
          headerTitle: () => (
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={18} color="#fff" style={styles.searchIcon} />
              <TextInput 
                placeholder="Buscar ruta..." 
                placeholderTextColor="#ccc" 
                style={styles.searchInput} 
              />
            </View>
          ),
          headerTitleAlign: 'center'
        }} 
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    paddingHorizontal: 12,
    height: 38,
    width: '100%',
  },
  searchIcon: { marginRight: 10, minWidth: 20 },
  searchInput: { color: '#fff', flex: 1, fontSize: 15, paddingVertical: 0 },
});