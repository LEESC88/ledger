package com.leesc88.ledger;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import androidx.core.content.FileProvider;
import com.getcapacitor.BridgeActivity;
import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import org.json.JSONObject;

public class MainActivity extends BridgeActivity {

    private static volatile String pendingOAuthPayload = null;
    private final ExecutorService downloadExecutor = Executors.newSingleThreadExecutor();

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        cleanupOldUpdateApk();
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
        registerNativeUpdaterInterface();
        flushPendingOAuthPayload();
    }

    /**
     * Delete any leftover installation APK from cache to prevent wasting user disk storage
     */
    private void cleanupOldUpdateApk() {
        try {
            File apkFile = new File(getCacheDir(), "update.apk");
            if (apkFile.exists()) {
                apkFile.delete();
            }
        } catch (Exception ignored) {}
    }

    /**
     * Bridge JavaScript with Native Android In-App APK Downloader & Installer
     */
    private void registerNativeUpdaterInterface() {
        runOnUiThread(() -> {
            if (getBridge() != null && getBridge().getWebView() != null) {
                getBridge().getWebView().addJavascriptInterface(new NativeUpdaterInterface(), "NativeUpdater");
            }
        });
    }

    public class NativeUpdaterInterface {

        @JavascriptInterface
        public void downloadAndInstall(String apkUrl) {
            if (apkUrl == null || apkUrl.trim().isEmpty()) {
                notifyDownloadError("Invalid download URL");
                return;
            }

            // Check Unknown Sources installation permission on Android 8.0+
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                if (!getPackageManager().canRequestPackageInstalls()) {
                    try {
                        Intent settingsIntent = new Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES);
                        settingsIntent.setData(Uri.parse("package:" + getPackageName()));
                        settingsIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                        startActivity(settingsIntent);
                    } catch (Exception e) {
                        // Fall through
                    }
                }
            }

            downloadExecutor.execute(() -> {
                HttpURLConnection conn = null;
                InputStream input = null;
                OutputStream output = null;
                File targetFile = new File(getCacheDir(), "update.apk");

                try {
                    if (targetFile.exists()) {
                        targetFile.delete();
                    }

                    String currentUrl = apkUrl;
                    int redirects = 0;

                    // Follow HTTP redirects (GitHub Releases redirect to AWS S3 CDN)
                    while (redirects < 6) {
                        URL url = new URL(currentUrl);
                        conn = (HttpURLConnection) url.openConnection();
                        conn.setConnectTimeout(15000);
                        conn.setReadTimeout(30000);
                        conn.setInstanceFollowRedirects(false);
                        conn.setRequestProperty("User-Agent", "LEDGER-Android-Client/1.3.5");

                        int responseCode = conn.getResponseCode();
                        if (responseCode == HttpURLConnection.HTTP_MOVED_PERM
                                || responseCode == HttpURLConnection.HTTP_MOVED_TEMP
                                || responseCode == 307
                                || responseCode == 308) {
                            String newUrl = conn.getHeaderField("Location");
                            if (newUrl == null || newUrl.isEmpty()) {
                                throw new Exception("HTTP redirect without Location header");
                            }
                            conn.disconnect();
                            currentUrl = newUrl;
                            redirects++;
                        } else if (responseCode == HttpURLConnection.HTTP_OK) {
                            break;
                        } else {
                            throw new Exception("Server returned HTTP " + responseCode);
                        }
                    }

                    long fileLength = conn.getContentLengthLong();
                    input = new BufferedInputStream(conn.getInputStream(), 16384);
                    output = new FileOutputStream(targetFile);

                    byte[] data = new byte[16384];
                    long total = 0;
                    int count;
                    int lastReportedPercent = -1;

                    while ((count = input.read(data)) != -1) {
                        total += count;
                        output.write(data, 0, count);

                        if (fileLength > 0) {
                            int percent = (int) ((total * 100) / fileLength);
                            if (percent != lastReportedPercent) {
                                lastReportedPercent = percent;
                                notifyDownloadProgress(percent, total, fileLength);
                            }
                        } else {
                            notifyDownloadProgress(50, total, total);
                        }
                    }

                    output.flush();
                    output.close();
                    output = null;

                    input.close();
                    input = null;

                    notifyDownloadProgress(100, total, total);
                    triggerPackageInstallation(targetFile);

                } catch (Exception e) {
                    notifyDownloadError(e.getMessage() != null ? e.getMessage() : "Download failed");
                } finally {
                    try {
                        if (output != null) output.close();
                        if (input != null) input.close();
                        if (conn != null) conn.disconnect();
                    } catch (Exception ignored) {}
                }
            });
        }
    }

    private void notifyDownloadProgress(int percent, long currentBytes, long totalBytes) {
        runOnUiThread(() -> {
            if (getBridge() != null && getBridge().getWebView() != null) {
                String js = String.format(
                    "if (window.__onNativeDownloadProgress) { window.__onNativeDownloadProgress(%d, %d, %d); }",
                    percent, currentBytes, totalBytes
                );
                getBridge().getWebView().evaluateJavascript(js, null);
            }
        });
    }

    private void notifyDownloadError(String errorMessage) {
        runOnUiThread(() -> {
            if (getBridge() != null && getBridge().getWebView() != null) {
                String escaped = JSONObject.quote(errorMessage);
                String js = "if (window.__onNativeDownloadError) { window.__onNativeDownloadError(" + escaped + "); }";
                getBridge().getWebView().evaluateJavascript(js, null);
            }
        });
    }

    private void triggerPackageInstallation(File apkFile) {
        runOnUiThread(() -> {
            try {
                Context context = MainActivity.this;
                Uri apkUri = FileProvider.getUriForFile(
                    context,
                    getPackageName() + ".fileprovider",
                    apkFile
                );

                Intent installIntent = new Intent(Intent.ACTION_VIEW);
                installIntent.setDataAndType(apkUri, "application/vnd.android.package-archive");
                installIntent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                installIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                startActivity(installIntent);
            } catch (Exception e) {
                notifyDownloadError("Cannot launch package installer: " + e.getMessage());
            }
        });
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
