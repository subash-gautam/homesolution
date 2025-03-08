package com.grishj.frontend

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

class KhaltiPackage : ReactPackage {
    override fun createViewManagers(reactContext: ReactApplicationContext) =
        mutableListOf<ViewManager<*, *>>()

    override fun createNativeModules(reactContext: ReactApplicationContext) =
        mutableListOf(NativeModule(KhaltiPaymentModule(reactContext)))
}