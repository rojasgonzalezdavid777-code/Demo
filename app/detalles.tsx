import * as Location from 'expo-location';
import React, { useEffect, useRef, useState } from 'react';
import { Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { GEOJSON_SITP } from '../constants/data';

export default function DetallesScreen() {
  const webViewRef = useRef<WebView>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [rutasActivas, setRutasActivas] = useState(false);

  // --- UBICACIÓN EN TIEMPO REAL Y ENFOQUE ---
  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 1500, 
          distanceInterval: 1, 
        },
        (loc) => {
          const { latitude, longitude } = loc.coords;
          const data = { tipo: "MI_UBICACION", lat: latitude, lng: longitude };
          
          if (Platform.OS === 'web') {
            const iframe = document.getElementById('map-iframe') as HTMLIFrameElement;
            iframe?.contentWindow?.postMessage(data, "*");
          } else {
            webViewRef.current?.injectJavaScript(`actualizarUbicacion(${latitude}, ${longitude}); void(0);`);
          }
        }
      );
    })();

    return () => { subscription?.remove(); };
  }, []);

  const geojsonString = JSON.stringify(GEOJSON_SITP);

  const leafletHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        body { margin: 0; padding: 0; overflow: hidden; }
        #map { height: 100vh; width: 100vw; background: #f8f9fa; }
        
        .google-dot {
          background: #4285F4;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        .google-pulse {
          width: 30px;
          height: 30px;
          background: rgba(66, 133, 244, 0.25);
          border-radius: 50%;
          position: absolute;
          left: -12px;
          top: -12px;
          animation: pulse 2s infinite ease-out;
        }

        @keyframes pulse {
          0% { transform: scale(0.6); opacity: 1; }
          100% { transform: scale(3.5); opacity: 0; }
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        // Estilo Voyager para que se vea como Google Maps
        var map = L.map('map', { zoomControl: false }).setView([4.65, -74.08], 12);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png').addTo(map);

        var marcadorUsuario = null;
        var primeraVez = true;

        function actualizarUbicacion(lat, lng) {
          var pos = [lat, lng];
          if (!marcadorUsuario) {
            var icono = L.divIcon({
              className: '',
              html: '<div style="position:relative;"><div class="google-pulse"></div><div class="google-dot"></div></div>',
              iconSize: [12, 12],
              iconAnchor: [6, 6]
            });
            marcadorUsuario = L.marker(pos, { icon: icono }).addTo(map);
          } else {
            marcadorUsuario.setLatLng(pos);
          }

          if (primeraVez) {
            map.setView(pos, 17);
            primeraVez = false;
          }
        }

        window.addEventListener("message", (e) => {
          if (e.data.tipo === "MI_UBICACION") actualizarUbicacion(e.data.lat, e.data.lng);
          if (e.data.tipo === "GESTIONAR_RUTAS") toggleRutas(e.data.valor);
        });

        var capaSITP;
        function toggleRutas(v) {
          if (v) {
            if (!capaSITP) {
              capaSITP = L.geoJSON(${geojsonString}, {
                pointToLayer: (f, l) => L.circleMarker(l, {
                  radius: 5, fillColor: "#1A73E8", color: "#fff", weight: 1, fillOpacity: 1
                })
              });
            }
            capaSITP.addTo(map);
          } else if (capaSITP) {
            map.removeLayer(capaSITP);
          }
        }
      </script>
    </body>
    </html>
  `;

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.topHalf}>
        {Platform.OS === 'web' ? (
          <iframe 
            id="map-iframe" 
            srcDoc={leafletHTML} 
            style={{ width: '100%', height: '100%', border: 'none' }} 
          />
        ) : (
          <WebView 
            ref={webViewRef}
            originWhitelist={['*']}
            source={{ html: leafletHTML }}
            style={styles.mapElement}
          />
        )}
      </View>

      <View style={styles.controlsArea}>
        {menuVisible && (
          <View style={styles.floatingMenu}>
            <TouchableOpacity style={styles.menuItem} onPress={() => {
              const n = !rutasActivas;
              setRutasActivas(n);
              if (Platform.OS === 'web') {
                (document.getElementById('map-iframe') as any)?.contentWindow?.postMessage({ tipo: "GESTIONAR_RUTAS", valor: n }, "*");
              } else {
                webViewRef.current?.injectJavaScript(`toggleRutas(${n}); void(0);`);
              }
              setMenuVisible(false);
            }}>
              <Text style={styles.menuText}>{rutasActivas ? "No ver rutas de SITP" : "Ver rutas de SITP"}</Text>
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
  topHalf: { flex: 0.5 },
  mapElement: { flex: 1 },
  controlsArea: { padding: 12, alignItems: 'flex-end' },
  floatingMenu: {
    position: 'absolute', bottom: 60, right: 12, backgroundColor: '#fff',
    borderRadius: 12, width: 200, elevation: 8, shadowOpacity: 0.2,
    borderWidth: 1, borderColor: '#eee', zIndex: 100
  },
  menuItem: { padding: 15 },
  separator: { height: 1, backgroundColor: '#eee' },
  menuText: { fontSize: 14, color: '#3c4043', fontWeight: '500' },
  smallRightButton: { backgroundColor: '#1A73E8', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20 },
  buttonText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  bottomSpace: { flex: 0.4 }
});