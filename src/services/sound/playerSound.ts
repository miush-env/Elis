import { BackgroundMode } from "@anuradev/capacitor-background-mode";

const music = new Audio("/musica.mp3");
music.loop = true;

export const startMusic = async () => {
  try {
    await BackgroundMode.enable({
      title: "¡Alarma Sonando!",
      text: "La alarma continuará sonando hasta que presiones Apagar o Aplazar.",
      hidden: false,
      silent: true,
    });
  } catch (e) {
    console.warn("Error al activar BackgroundMode:", e);
  }

  try {
    music.currentTime = 0;
    await music.play();
  } catch (e) {
    console.error("Error al reproducir audio:", e);
  }
};

export const stopMusic = async () => {
  try {
    music.pause();
    music.currentTime = 0;
    await BackgroundMode.disable();
  } catch (e) {
    console.warn("Error al desactivar BackgroundMode:", e);
  }
};
