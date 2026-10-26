package com.leesc88.ledger;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.net.ServerSocket;
import java.net.Socket;
import java.nio.charset.StandardCharsets;
import org.json.JSONObject;

public class MainActivity extends BridgeActivity {

    private static ServerSocket oauthServerSocket;
    private static volatile String pendingOAuthPayload = null;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        startOAuthLoopbackBridge();
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

    private synchronized void startOAuthLoopbackBridge() {
        if (oauthServerSocket != null && !oauthServerSocket.isClosed()) {
            return;
        }
        Thread serverThread = new Thread(() -> {
            try {
                oauthServerSocket = new ServerSocket();
                oauthServerSocket.setReuseAddress(true);
                oauthServerSocket.bind(new InetSocketAddress("127.0.0.1", 3000));

                while (!oauthServerSocket.isClosed()) {
                    try (Socket client = oauthServerSocket.accept()) {
                        client.setSoTimeout(5000);
                        BufferedReader reader = new BufferedReader(
                            new InputStreamReader(client.getInputStream(), StandardCharsets.UTF_8)
                        );
                        String requestLine = reader.readLine();
                        if (requestLine == null) continue;

                        String[] parts = requestLine.split(" ");
                        String path = parts.length > 1 ? parts[1] : "/";

                        OutputStream out = client.getOutputStream();

                        if (path.startsWith("/__oauth_callback__?")) {
                            String query = path.substring("/__oauth_callback__?".length());
                            deliverOAuthPayload(query);

                            // Bring MainActivity to front automatically
                            try {
                                Intent bringToFront = new Intent(getApplicationContext(), MainActivity.class);
                                bringToFront.addFlags(
                                    Intent.FLAG_ACTIVITY_NEW_TASK |
                                    Intent.FLAG_ACTIVITY_SINGLE_TOP |
                                    Intent.FLAG_ACTIVITY_CLEAR_TOP
                                );
                                startActivity(bringToFront);
                            } catch (Exception ignored) {}

                            byte[] body = "{\"ok\":true}".getBytes(StandardCharsets.UTF_8);
                            String headers =
                                "HTTP/1.1 200 OK\r\n" +
                                "Content-Type: application/json; charset=utf-8\r\n" +
                                "Access-Control-Allow-Origin: *\r\n" +
                                "Cache-Control: no-store\r\n" +
                                "Content-Length: " + body.length + "\r\n" +
                                "Connection: close\r\n\r\n";
                            out.write(headers.getBytes(StandardCharsets.UTF_8));
                            out.write(body);
                            out.flush();
                        } else {
                            String html =
                                "<!DOCTYPE html><html><head><meta charset=\"utf-8\">" +
                                "<meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">" +
                                "<title>LEDGER Sign-In</title>" +
                                "<style>" +
                                "body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#F8FAFC;color:#0F172A;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;padding:24px;box-sizing:border-box;text-align:center;}" +
                                ".card{background:#FFFFFF;border:1px solid #CBD5E1;border-radius:16px;padding:32px 24px;max-width:380px;width:100%;box-shadow:0 10px 25px rgba(15,23,42,0.08);}" +
                                "h2{margin:0 0 10px;font-size:20px;font-weight:800;color:#0F172A;}" +
                                "p{margin:0 0 24px;font-size:14px;color:#334155;line-height:1.5;}" +
                                ".btn{display:inline-block;background:#4F46E5;color:#FFFFFF;font-weight:700;font-size:15px;padding:14px 24px;border-radius:10px;text-decoration:none;width:100%;box-sizing:border-box;}" +
                                "</style></head><body>" +
                                "<div class=\"card\">" +
                                "<h2>✅ Google Sign-In Complete</h2>" +
                                "<p>Syncing your session back to the LEDGER mobile app...</p>" +
                                "<a id=\"openAppBtn\" class=\"btn\" href=\"intent://oauth#Intent;scheme=com.leesc88.ledger;package=com.leesc88.ledger;end\">Return to LEDGER App</a>" +
                                "</div>" +
                                "<script>" +
                                "(function(){" +
                                "var h=window.location.hash?window.location.hash.substring(1):'';" +
                                "var s=window.location.search?window.location.search.substring(1):'';" +
                                "var p=h||s;" +
                                "var intentUrl='intent://oauth'+(p?'?'+p:'')+'#Intent;scheme=com.leesc88.ledger;package=com.leesc88.ledger;end';" +
                                "var btn=document.getElementById('openAppBtn');" +
                                "if(btn)btn.href=intentUrl;" +
                                "if(p){" +
                                "fetch('/__oauth_callback__?'+p).finally(function(){window.location.replace(intentUrl);});" +
                                "}else{" +
                                "window.location.replace(intentUrl);" +
                                "}" +
                                "})();" +
                                "</script></body></html>";

                            byte[] body = html.getBytes(StandardCharsets.UTF_8);
                            String headers =
                                "HTTP/1.1 200 OK\r\n" +
                                "Content-Type: text/html; charset=utf-8\r\n" +
                                "Cache-Control: no-store\r\n" +
                                "Content-Length: " + body.length + "\r\n" +
                                "Connection: close\r\n\r\n";
                            out.write(headers.getBytes(StandardCharsets.UTF_8));
                            out.write(body);
                            out.flush();
                        }
                    } catch (Exception ignored) {}
                }
            } catch (Exception ignored) {}
        });
        serverThread.setDaemon(true);
        serverThread.start();
    }
}
