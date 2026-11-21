import { registerPlugin } from "@capacitor/core";

const AlarmSound = registerPlugin<{
  start: () => Promise<void>;
  stop: () => Promise<void>;
}>("AlarmSound");

// Fallback web (para pruebas en navegador de PC)
let webAudio: HTMLAudioElement | null = null;

export const startMusic = async () => {
  try {
    await AlarmSound.start();
  } catch (e) {
    console.warn("AlarmSound nativo no disponible (ejecutando en web?):", e);
    try {
      if (!webAudio) {
        webAudio = new Audio("/musica.mp3");
        webAudio.loop = true;
      }
      webAudio.currentTime = 0;
      await webAudio.play();
    } catch (err) {
      console.error("Error al reproducir audio web:", err);
    }
  }
};

export const stopMusic = async () => {
  try {
    await AlarmSound.stop();
  } catch (e) {
    console.warn("Error al detener AlarmSound nativo:", e);
  }

  if (webAudio) {
    webAudio.pause();
    webAudio.currentTime = 0;
  }
};
