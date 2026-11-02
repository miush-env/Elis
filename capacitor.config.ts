import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ejemplo.myapp',
  appName: 'Mi App',
  webDir: 'dist',
  server: {
      url: 'http://192.168.1.44:5173', // Reemplaza por tu IP del paso 1
      cleartext: true, // Necesario en Android para permitir conexiones HTTP no encriptadas
    },
};

export default config;
