package com.ejemplo.myapp;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.res.AssetFileDescriptor;
import android.media.AudioAttributes;
import android.media.MediaPlayer;
import android.os.Build;
import android.os.IBinder;
import androidx.core.app.NotificationCompat;

public class AlarmSoundService extends Service {
    private static final String CHANNEL_ID = "alarm_sound_service_channel";
    private static final int DEFAULT_NOTIFICATION_ID = 9991;
    private static MediaPlayer mediaPlayer;
    private static AlarmSoundService instance;

    public static synchronized void playAudioDirect(Context context) {
        if (mediaPlayer != null && mediaPlayer.isPlaying()) {
            return;
        }
        try {
            stopAudioDirect();
            mediaPlayer = new MediaPlayer();
            AudioAttributes audioAttributes = new AudioAttributes.Builder()
                .setUsage(AudioAttributes.USAGE_ALARM)
                .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
                .build();
            mediaPlayer.setAudioAttributes(audioAttributes);

            int resId = context.getResources().getIdentifier("musica", "raw", context.getPackageName());
            if (resId != 0) {
                AssetFileDescriptor afd = context.getResources().openRawResourceFd(resId);
                mediaPlayer.setDataSource(afd.getFileDescriptor(), afd.getStartOffset(), afd.getLength());
                afd.close();
            }
            mediaPlayer.setLooping(true);
            mediaPlayer.prepare();
            mediaPlayer.start();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static synchronized void stopAudioDirect() {
        if (mediaPlayer != null) {
            try {
                if (mediaPlayer.isPlaying()) {
                    mediaPlayer.stop();
                }
                mediaPlayer.release();
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                mediaPlayer = null;
            }
        }
    }

    public static void startAlarm(Context context) {
        Intent intent = new Intent(context, AlarmSoundService.class);
        intent.setAction("START");
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                context.startForegroundService(intent);
            } else {
                context.startService(intent);
            }
        } catch (Exception e) {
            e.printStackTrace();
            playAudioDirect(context);
        }
    }

    public static void stopAlarm(Context context) {
        stopAudioDirect();
        if (instance != null) {
            try {
                instance.stopForeground(true);
                instance.stopSelf();
            } catch (Exception e) {
                e.printStackTrace();
            }
            return;
        }
        try {
            Intent intent = new Intent(context, AlarmSoundService.class);
            intent.setAction("STOP");
            context.stopService(intent);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onCreate() {
        super.onCreate();
        instance = this;
        createNotificationChannel();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        instance = this;
        if (intent != null && "STOP".equals(intent.getAction())) {
            stopAudioDirect();
            stopForeground(true);
            stopSelf();
            return START_NOT_STICKY;
        }

        Notification notification = null;
        int notificationId = DEFAULT_NOTIFICATION_ID;
        if (intent != null) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                notification = intent.getParcelableExtra("notification", Notification.class);
            } else {
                notification = intent.getParcelableExtra("notification");
            }
            notificationId = intent.getIntExtra("notification_id", DEFAULT_NOTIFICATION_ID);
        }

        if (notification == null) {
            notification = createFallbackNotification();
        }

        // Marcar flags indispensables para que no se pueda eliminar ni deslizar
        notification.flags |= Notification.FLAG_ONGOING_EVENT | Notification.FLAG_NO_CLEAR;

        startForeground(notificationId, notification);
        playAudioDirect(this);

        return START_STICKY;
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(
                CHANNEL_ID,
                "Servicio de Alarma Activa",
                NotificationManager.IMPORTANCE_HIGH
            );
            channel.setDescription("Mantiene la alarma sonando de forma ininterrumpida");
            NotificationManager manager = getSystemService(NotificationManager.class);
            if (manager != null) {
                manager.createNotificationChannel(channel);
            }
        }
    }

    private Notification createFallbackNotification() {
        return new NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("¡Alarma Sonando!")
            .setContentText("Presiona para abrir la app o apagarla.")
            .setSmallIcon(android.R.drawable.ic_lock_idle_alarm)
            .setOngoing(true)
            .setAutoCancel(false)
            .setPriority(NotificationCompat.PRIORITY_MAX)
            .setCategory(NotificationCompat.CATEGORY_ALARM)
            .build();
    }

    @Override
    public void onDestroy() {
        stopAudioDirect();
        if (instance == this) {
            instance = null;
        }
        super.onDestroy();
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}
