package com.ejemplo.myapp;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "AlarmSound")
public class AlarmSoundPlugin extends Plugin {

    @PluginMethod
    public void start(PluginCall call) {
        AlarmSoundService.startAlarm(getContext());
        call.resolve();
    }

    @PluginMethod
    public void stop(PluginCall call) {
        AlarmSoundService.stopAlarm(getContext());
        call.resolve();
    }
}
