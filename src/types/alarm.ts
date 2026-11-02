// src/types/alarm.ts
export interface Alarm {
  id: number;
  name: string;
  time: {
    hour: number;
    minute: number;
  };
  days: string[];
  isEnable: boolean;
}