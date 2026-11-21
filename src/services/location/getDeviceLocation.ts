import { Geolocation } from "@capacitor/geolocation";

export const getDeviceLocation = async () => {
    // 1. Revisamos si ya tenemos permiso
    const check = await Geolocation.checkPermissions();

    if (check.location !== "granted") {
      // 2. Solo si no lo tiene, lo solicitamos
      const request = await Geolocation.requestPermissions();
      if (request.location !== "granted") {
        throw new Error("Permiso de ubicación denegado por el usuario");
      }
    }

    // 3. Obtenemos las coordenadas actuales (GPS / Red)
    const position = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 10000,
    });

    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };
  };