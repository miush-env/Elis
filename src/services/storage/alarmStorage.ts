import type { Alarm } from "@/types/alarm";
import { Preferences } from "@capacitor/preferences";

const STORAGE_KEY = 'alarms';

export const createAlarm = async (newAlarm: Alarm) => {
  const { value } = await Preferences.get({ key: STORAGE_KEY });
  const currentAlarms: Alarm[] = value ? JSON.parse(value) : [];

  currentAlarms.push(newAlarm);

  await Preferences.set({
    key: STORAGE_KEY,
    value: JSON.stringify(currentAlarms),
  });
};

export const getAlarms = async (): Promise<Alarm[]> => {
  const { value } = await Preferences.get({ key: STORAGE_KEY });
  return value ? JSON.parse(value) : [];
}