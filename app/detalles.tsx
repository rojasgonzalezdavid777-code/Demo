import React, { useRef, useState } from 'react';
import { Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { GEOJSON_SITP } from '../constants/data';

export default function DetallesScreen() {
  const webViewRef = useRef<WebView>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [rutasActivas, setRutasActivas] = useState(false);

  const geojsonString = JSON.stringify(GEOJSON_SITP);

  const leafletHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        body { margin: 0; padding: 0; overflow: hidden; background: #e5e7eb; }
        #map { height: 100vh; width: 100vw; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var bounds = L.latLngBounds(L.latLng(4.45, -74.22), L.latLng(4.82, -73.95));
        var map = L.map('map', {
          maxBounds: bounds, 
          maxBoundsViscosity: 1.0, 
          minZoom: 11
        }).setView([4.65, -74.08], 12);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          bounds: bounds
        }).addTo(map);

        var capaSITP;
        var marcadorBusqueda; // Para resaltar el resultado de búsqueda
        var datos = ${geojsonString};

        function toggleRutas(visible) {
          if (visible) {
            if (!capaSITP) {
              capaSITP = L.geoJSON(datos, {
                pointToLayer: (feature, latlng) => L.circleMarker(latlng, {
                  radius: 6, fillColor: "#0056b3", color: "#fff", weight: 2, fillOpacity: 0.9
                })
              });
            }
            capaSITP.addTo(map);
            if (capaSITP.getBounds().isValid()) {
                map.fitBounds(capaSITP.getBounds(), { padding: [20, 20] });
            }
          } else {
            if (capaSITP) map.removeLayer(capaSITP);
            map.setView([4.65, -74.08], 12);
          }
        }

        // NUEVA FUNCIÓN PARA ENFOCAR DESDE BÚSQUEDA
        function enfocarParadero(lat, lng, nombre) {
          if (marcadorBusqueda) map.removeLayer(marcadorBusqueda);
          
          marcadorBusqueda = L.marker([lat, lng]).addTo(map)
            .bindPopup("<b>" + nombre + "</b>")
            .openPopup();
          
          map.setView([lat, lng], 17); // Zoom detallado
        }
        
        window.addEventListener("message", (event) => {
          if (event.data.tipo === "GESTIONAR_RUTAS") toggleRutas(event.data.valor);
          if (event.data.tipo === "BUSCAR_PUNTO") enfocarParadero(event.data.lat, event.data.lng, event.data.nombre);
        });
      </script>
    </body>
    </html>
  `;

  // ESTA FUNCIÓN DEBES LLAMARLA CUANDO EL USUARIO SELECCIONE UN RESULTADO EN TU BARRA
  const alSeleccionarEnTuBusqueda = (item: any) => {
    // Asumiendo que tu GeoJSON tiene [longitud, latitud]
    const [lng, lat] = item.geometry.coordinates;
    const nombre = item.properties.nombre || item.properties.cenefa;

    if (Platform.OS === 'web') {
      const iframe = document.getElementsByTagName('iframe')[0];
      iframe?.contentWindow?.postMessage({ 
        tipo: "BUSCAR_PUNTO", 
        lat: lat, 
        lng: lng, 
        nombre: nombre 
      }, "*");
    } else {
      webViewRef.current?.injectJavaScript(`enfocarParadero(${lat}, ${lng}, "${nombre}"); void(0);`);
    }
  };

  const gestionarAccionRutas = () => {
    const nuevoEstado = !rutasActivas;
    setRutasActivas(nuevoEstado);
    if (Platform.OS === 'web') {
      const iframe = document.getElementsByTagName('iframe')[0];
      iframe?.contentWindow?.postMessage({ tipo: "GESTIONAR_RUTAS", valor: nuevoEstado }, "*");
    } else {
      webViewRef.current?.injectJavaScript(`toggleRutas(${nuevoEstado}); void(0);`);
    }
    setMenuVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      {/* Aquí va tu barra de búsqueda actual. 
          Cuando el usuario toque un resultado, debes ejecutar:
          onPress={() => alSeleccionarEnTuBusqueda(item)}
      */}

      <View style={styles.topHalf}>
        {Platform.OS === 'web' ? (
          <iframe srcDoc={leafletHTML} style={{ width: '100%', height: '100%', border: 'none' }} title="Mapa SITP" />
        ) : (
          <WebView ref={webViewRef} originWhitelist={['*']} source={{ html: leafletHTML }} style={styles.mapElement} />
        )}
      </View>

      <View style={styles.controlsArea}>
        {menuVisible && (
          <View style={styles.floatingMenu}>
            <TouchableOpacity style={styles.menuItem} onPress={gestionarAccionRutas}>
              <Text style={styles.menuText}>
                {rutasActivas ? "No ver rutas de SITP" : "Ver rutas de SITP"}
              </Text>
            </TouchableOpacity>
            <View style={styles.separator} />
            <TouchableOpacity style={styles.menuItem} onPress={() => setMenuVisible(false)}>
              <Text style={styles.menuText}>Atrás</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity style={styles.smallRightButton} onPress={() => setMenuVisible(!menuVisible)}>
          <Text style={styles.buttonText}>DESPLEGABLES</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.bottomSpace} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: '#fff' },
  topHalf: { flex: 0.5, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  mapElement: { width: '100%', height: '100%' },
  controlsArea: { padding: 12, alignItems: 'flex-end', position: 'relative' },
  floatingMenu: {
    position: 'absolute', bottom: 60, right: 12, backgroundColor: '#fff',
    borderRadius: 8, width: 200, elevation: 5, borderWidth: 1, borderColor: '#eee', zIndex: 100
  },
  menuItem: { padding: 15 },
  separator: { height: 1, backgroundColor: '#eee' },
  menuText: { fontSize: 14, color: '#333', fontWeight: '500' },
  smallRightButton: { backgroundColor: '#0056b3', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
  buttonText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  bottomSpace: { flex: 0.4 }
});