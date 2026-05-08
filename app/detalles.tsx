import * as Location from 'expo-location';
import React, { useEffect, useRef, useState } from 'react';
import { Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { GEOJSON_SITP } from '../constants/data';

export default function DetallesScreen() {
  const webViewRef = useRef<WebView>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [rutasActivas, setRutasActivas] = useState(false);
  
  const [infoParadero, setInfoParadero] = useState({
    nombre: "Selecciona un paradero",
    detalles: "Explora los puntos en el mapa"
  });

  // --- LÓGICA DE MENSAJES HÍBRIDA ---
  useEffect(() => {
    const handleWebMessage = (event: MessageEvent) => {
      if (event.data?.tipo === "PARADERO_CLICK") actualizarInfo(event.data);
    };
    if (Platform.OS === 'web') {
      window.addEventListener("message", handleWebMessage);
      return () => window.removeEventListener("message", handleWebMessage);
    }
  }, []);

  const actualizarInfo = (data: any) => {
    setInfoParadero({
      nombre: data.nombre || "Paradero sin nombre",
      detalles: `Cenefa: ${data.cenefa || "N/A"}`
    });
  };

  const handleMobileMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.tipo === "PARADERO_CLICK") actualizarInfo(data);
    } catch (e) { console.log(e); }
  };

  // --- UBICACIÓN ---
  useEffect(() => {
    let subscription: any = null;
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      subscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.Balanced, timeInterval: 2000, distanceInterval: 5 },
        (loc) => {
          const { latitude, longitude } = loc.coords;
          if (Platform.OS === 'web') {
            const iframe = document.getElementById('map-iframe') as HTMLIFrameElement;
            iframe?.contentWindow?.postMessage({ tipo: "MI_UBICACION", lat: latitude, lng: longitude }, "*");
          } else {
            webViewRef.current?.injectJavaScript(`actualizarUbicacion(${latitude}, ${longitude}); void(0);`);
          }
        }
      );
    })();
    return () => subscription?.remove();
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
        body { margin: 0; padding: 0; overflow: hidden; background: #f8f9fa; }
        #map { height: 100vh; width: 100vw; }
        .user-dot { background: #4285F4; width: 12px; height: 12px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var map = L.map('map', { zoomControl: false }).setView([4.65, -74.08], 12);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png').addTo(map);

        var marcadorUsuario = null;
        function actualizarUbicacion(lat, lng) {
          if (!marcadorUsuario) {
            marcadorUsuario = L.marker([lat, lng], { icon: L.divIcon({ className: '', html: '<div class="user-dot"></div>' }) }).addTo(map);
            map.setView([lat, lng], 16);
          } else { marcadorUsuario.setLatLng([lat, lng]); }
        }

        window.addEventListener("message", (e) => {
          if (e.data.tipo === "MI_UBICACION") actualizarUbicacion(e.data.lat, e.data.lng);
        });

        var capaSITP;
        function toggleRutas(v) {
          if (v) {
            if (!capaSITP) {
              var iconP = L.divIcon({
                className: '',
                html: \`
                  <div style="position: relative;">
                    <div style="background-color: #0056b3; width: 20px; height: 20px; border: 2px solid white; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-family: sans-serif; font-size: 11px; font-weight: bold; box-shadow: 0 2px 5px rgba(0,0,0,0.4);">P</div>
                    <div style="position: absolute; bottom: -8px; left: 4px; width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 8px solid white;"></div>
                    <div style="position: absolute; bottom: -6px; left: 5px; width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 7px solid #0056b3;"></div>
                  </div>
                \`,
                iconSize: [20, 28], iconAnchor: [10, 28]
              });

              capaSITP = L.geoJSON(${geojsonString}, {
                pointToLayer: (f, l) => L.marker(l, { icon: iconP }),
                onEachFeature: (feature, layer) => {
                  layer.on('click', () => {
                    var d = { tipo: "PARADERO_CLICK", nombre: feature.properties.nombre, cenefa: feature.properties.cenefa };
                    if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage(JSON.stringify(d));
                    else window.parent.postMessage(d, "*");
                  });
                }
              });
            }
            capaSITP.addTo(map);
          } else if (capaSITP) map.removeLayer(capaSITP);
        }
      </script>
    </body>
    </html>
  `;

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.mapSection}>
        {Platform.OS === 'web' ? (
          <iframe id="map-iframe" srcDoc={leafletHTML} style={styles.webContainer} />
        ) : (
          <WebView 
            ref={webViewRef}
            originWhitelist={['*']}
            source={{ html: leafletHTML }}
            onMessage={handleMobileMessage}
            style={{ flex: 1 }}
          />
        )}
        
        <View style={styles.controlsOverlay}>
          {menuVisible && (
            <View style={styles.floatingMenu}>
              <TouchableOpacity style={styles.menuItem} onPress={() => {
                const n = !rutasActivas;
                setRutasActivas(n);
                if (Platform.OS === 'web') {
                  const iframe = document.getElementById('map-iframe') as any;
                  iframe.contentWindow.eval(`toggleRutas(${n})`);
                } else webViewRef.current?.injectJavaScript(`toggleRutas(${n}); void(0);`);
                setMenuVisible(false);
              }}>
                <Text style={styles.menuText}>{rutasActivas ? "Ocultar SITP" : "Ver paraderos"}</Text>
              </TouchableOpacity>
            </View>
          )}
          <TouchableOpacity style={styles.mainButton} onPress={() => setMenuVisible(!menuVisible)}>
            <Text style={styles.buttonText}>DESPLEGABLES</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.infoSection}>
        <View style={styles.handle} />
        <Text style={styles.infoTitle}>{infoParadero.nombre}</Text>
        <Text style={styles.infoSubtitle}>{infoParadero.detalles}</Text>

        <View style={styles.routeContainer}>
          <View style={styles.visualLineContainer}>
            <View style={styles.originDot} />
            <View style={styles.dottedLine} />
            <View style={styles.destinationDot} />
          </View>
          <View style={styles.inputsContainer}>
            <View style={styles.inputBox}>
              <Text style={styles.inputLabel}>Origen</Text>
              <Text style={styles.inputText}>Mi ubicación actual</Text>
            </View>
            <View style={styles.inputSeparator} />
            <View style={styles.inputBox}>
              <Text style={styles.inputLabel}>Destino</Text>
              <Text style={styles.inputTextPlaceholder}>¿A dónde vas?</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>BUSCAR RUTA</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: '#0056b3' },
  mapSection: { flex: 0.7 },
  webContainer: { width: '100%', height: '100%', border: 'none' },
  infoSection: { flex: 0.3, backgroundColor: '#fff', borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 15, alignItems: 'center', elevation: 10 },
  handle: { width: 40, height: 5, backgroundColor: '#ccc', borderRadius: 3, marginBottom: 10 },
  infoTitle: { fontSize: 16, fontWeight: 'bold', color: '#0056b3', textAlign: 'center' },
  infoSubtitle: { fontSize: 12, color: '#666', marginBottom: 10 },
  routeContainer: { flexDirection: 'row', backgroundColor: '#f8f9fa', borderRadius: 12, padding: 12, width: '100%', borderWidth: 1, borderColor: '#eee' },
  visualLineContainer: { alignItems: 'center', marginRight: 12 },
  originDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#0056b3' },
  dottedLine: { width: 1, flex: 1, backgroundColor: '#ccc', marginVertical: 2 },
  destinationDot: { width: 8, height: 8, backgroundColor: '#d90429', borderRadius: 1 },
  inputsContainer: { flex: 1 },
  inputBox: { height: 30, justifyContent: 'center' },
  inputLabel: { fontSize: 9, color: '#999', fontWeight: 'bold' },
  inputText: { fontSize: 13, color: '#333' },
  inputTextPlaceholder: { fontSize: 13, color: '#ccc' },
  inputSeparator: { height: 1, backgroundColor: '#eee', marginVertical: 4 },
  actionButton: { backgroundColor: '#0056b3', width: '100%', paddingVertical: 10, borderRadius: 10, marginTop: 12, alignItems: 'center' },
  actionButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  controlsOverlay: { position: 'absolute', bottom: 15, right: 15 },
  floatingMenu: { backgroundColor: '#fff', borderRadius: 10, width: 150, marginBottom: 8, elevation: 5 },
  menuItem: { padding: 12 },
  menuText: { fontSize: 12, color: '#333', fontWeight: '600' },
  mainButton: { backgroundColor: '#0056b3', paddingVertical: 10, paddingHorizontal: 18, borderRadius: 25 },
  buttonText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
});