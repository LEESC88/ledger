package com.leesc88.ledger;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import org.json.JSONObject;

public class MainActivity extends BridgeActivity {

    private static volatile String pendingOAuthPayload = null;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        handleIncomingOAuthIntent(getIntent());
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        handleIncomingOAuthIntent(intent);
    }

    @Override
    public void onResume() {
        super.onResume();
        flushPendingOAuthPayload();
    }

    private void handleIncomingOAuthIntent(Intent intent) {
        if (intent == null) return;
        Uri data = intent.getData();
        if (data != null && "com.leesc88.ledger".equals(data.getScheme())) {
            String query = data.getEncodedQuery();
            String fragment = data.getEncodedFragment();
            String payload = (fragment != null && !fragment.isEmpty()) ? fragment : query;
            if (payload != null && !payload.isEmpty()) {
                deliverOAuthPayload(payload);
            }
        }
    }

    private void deliverOAuthPayload(String payload) {
        if (payload == null || payload.isEmpty()) return;
        pendingOAuthPayload = payload;
        flushPendingOAuthPayload();
    }

    private void flushPendingOAuthPayload() {
        final String payload = pendingOAuthPayload;
        if (payload == null || payload.isEmpty()) return;

        runOnUiThread(() -> {
            if (getBridge() != null && getBridge().getWebView() != null) {
                String escaped = JSONObject.quote(payload);
                String js =
                    "if (window.__handleNativeOAuthCallback) { " +
                    "window.__handleNativeOAuthCallback(" + escaped + "); " +
                    "} else { " +
                    "window.location.hash = " + escaped + "; " +
                    "}";
                getBridge().getWebView().evaluateJavascript(js, value -> {
                    pendingOAuthPayload = null;
                });
            }
        });
    }
}
