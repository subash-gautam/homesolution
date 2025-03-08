package com.grishj.frontend

import android.app.Activity
import com.facebook.react.bridge.*
import com.khalti.checkout.helper.*
import com.khalti.utils.Environment

class KhaltiPaymentModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName() = "KhaltiPayment"

    @ReactMethod
    fun initiatePayment(
        publicKey: String,
        pidx: String,
        amount: Double,
        promise: Promise
    ) {
        val activity = currentActivity ?: run {
            promise.reject("NO_ACTIVITY", "No current activity")
            return
        }

        try {
            val config = KhaltiPayConfig(
                publicKey = publicKey,
                pidx = pidx,
                amount = amount,
                environment = Environment.TEST // Change to PRODUCTION for live
            )

            Khalti.init(activity, config,
                onPaymentResult = { paymentResult, khalti ->
                    when (paymentResult.status) {
                        "Completed" -> promise.resolve(paymentResult.payload?.pidx)
                        else -> promise.reject("PAYMENT_FAILED", paymentResult.toString())
                    }
                    khalti.close()
                },
                onMessage = { payload, khalti ->
                    if (payload.needsPaymentConfirmation) {
                        khalti.verify()
                    } else {
                        promise.reject("PAYMENT_ERROR", payload.message)
                    }
                }
            ).open()
        } catch (e: Exception) {
            promise.reject("INIT_ERROR", e.message)
        }
    }
}