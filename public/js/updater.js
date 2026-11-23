/* MonetaX Engine - Service Worker & Dual-Mode In-App Auto-Updater */

/**
 * Service Worker & In-App Auto-Update Engine
 */
let swRegistration = null;

async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      swRegistration = await navigator.serviceWorker.register('/sw.js');
      swRegistration.addEventListener('updatefound', () => {
        const newWorker = swRegistration.installing;
        if (!newWorker) return;
        newWorker.addEventListener('statechange', () => {
          if (
            newWorker.state === 'installed' &&
            navigator.serviceWorker.controller
          ) {
            showUpdateAvailablePrompt(APP_VERSION);
          }
        });
      });
    } catch (err) {
      // Service worker optional
    }
  }
}

let pendingUpdateVersion = null;
let pendingApkDownloadUrl =
  'https://github.com/LEESC88/ledger/releases/latest/download/MonetaX.apk';
let isForceUpdateRequired = false;
let lastAutoUpdateCheckAt = 0;
const AUTO_UPDATE_CHECK_COOLDOWN_MS = 15 * 60 * 1000;

function compareSemver(a, b) {
  const pa = String(a || '')
    .replace(/^v/i, '')
    .split('.')
    .map((n) => parseInt(n, 10) || 0);
  const pb = String(b || '')
    .replace(/^v/i, '')
    .split('.')
    .map((n) => parseInt(n, 10) || 0);
  const len = Math.max(pa.length, pb.length, 3);
  for (let i = 0; i < len; i++) {
    const x = pa[i] || 0;
    const y = pb[i] || 0;
    if (x > y) return 1;
    if (x < y) return -1;
  }
  return 0;
}

function openInAppUpdateModal(forceMode = isForceUpdateRequired) {
  elements.updateDownloadProgressArea?.classList.add('hidden');
  elements.inAppUpdateModal?.classList.toggle(
    'is-force-update',
    Boolean(forceMode),
  );
  if (elements.startInAppUpdateBtn) {
    elements.startInAppUpdateBtn.disabled = false;
  }
  if (elements.cancelInAppUpdateBtn) {
    elements.cancelInAppUpdateBtn.disabled = false;
  }
  elements.inAppUpdateModal?.classList.remove('hidden');
  pushModalHistoryState();
}

function closeInAppUpdateModal(fromPopState = false) {
  if (isForceUpdateRequired) return;
  elements.inAppUpdateModal?.classList.add('hidden');
  popModalHistoryIfCleared(fromPopState === true);
}

function showUpdateAvailablePrompt(
  versionLabel,
  apkUrl,
  notes,
  isForced = false,
) {
  pendingUpdateVersion = versionLabel;
  if (apkUrl) pendingApkDownloadUrl = apkUrl;
  isForceUpdateRequired = Boolean(isForced);

  if (elements.inAppUpdateVersionBadge) {
    elements.inAppUpdateVersionBadge.textContent = `v${versionLabel}`;
  }
  if (elements.inAppUpdateNotes) {
    elements.inAppUpdateNotes.textContent =
      notes ||
      (state.lang === 'zh'
        ? `发现新版本 v${versionLabel}，支持应用内极速下载与自动安装。`
        : `New version v${versionLabel} is ready with in-app fast download and auto-install.`);
  }

  if (elements.updateBannerText) {
    elements.updateBannerText.textContent =
      state.lang === 'zh'
        ? `目前有最新版本 (v${versionLabel})，点击前往更新。`
        : `Latest version available (v${versionLabel}). Tap Go Update.`;
  }
  elements.updateBannerDismissBtn?.classList.toggle(
    'hidden',
    isForceUpdateRequired,
  );
  elements.updateNotificationBanner?.classList.remove('hidden');
  if (elements.updateStatusText) {
    elements.updateStatusText.textContent = `v${versionLabel} ready!`;
  }
  if (elements.checkUpdateBtnText) {
    elements.checkUpdateBtnText.textContent = `Update v${versionLabel}`;
  }

  if (isForceUpdateRequired) {
    openInAppUpdateModal(true);
  }
}

/**
 * Native Android Download Progress Callbacks
 */
window.__onNativeDownloadProgress = function (
  percent,
  currentBytes,
  totalBytes,
) {
  const pct = Math.min(Math.max(Number(percent) || 0, 0), 100);
  if (elements.updateProgressBarFill) {
    elements.updateProgressBarFill.style.width = pct + '%';
  }
  if (elements.updateProgressPercent) {
    elements.updateProgressPercent.textContent = pct + '%';
  }
  if (elements.updateProgressBytes) {
    const curMb = (Number(currentBytes || 0) / (1024 * 1024)).toFixed(1);
    const totMb =
      totalBytes > 0 ? (Number(totalBytes) / (1024 * 1024)).toFixed(1) : '?';
    elements.updateProgressBytes.textContent = `${curMb} MB / ${totMb} MB`;
  }
  if (pct >= 100 && elements.updateProgressStatusText) {
    elements.updateProgressStatusText.textContent = t('installing_update');
  }
};

window.__onNativeDownloadError = function (errorMsg) {
  showToast(`${t('download_error')}: ${errorMsg}`, true);
  if (elements.updateProgressStatusText) {
    elements.updateProgressStatusText.textContent = `${t('download_error')}: ${errorMsg}`;
  }
  if (elements.startInAppUpdateBtn)
    elements.startInAppUpdateBtn.disabled = false;
  if (elements.cancelInAppUpdateBtn)
    elements.cancelInAppUpdateBtn.disabled = false;
};

/**
 * Execute in-app auto-update
 */
async function applyAppUpdate() {
  // If running inside Android container with NativeUpdater interface
  if (
    window.NativeUpdater &&
    typeof window.NativeUpdater.downloadAndInstall === 'function'
  ) {
    elements.updateDownloadProgressArea?.classList.remove('hidden');
    if (elements.startInAppUpdateBtn) {
      elements.startInAppUpdateBtn.disabled = true;
    }
    if (elements.cancelInAppUpdateBtn) {
      elements.cancelInAppUpdateBtn.disabled = true;
    }
    if (elements.updateProgressBarFill)
      elements.updateProgressBarFill.style.width = '0%';
    if (elements.updateProgressPercent)
      elements.updateProgressPercent.textContent = '0%';
    if (elements.updateProgressBytes)
      elements.updateProgressBytes.textContent = '0 MB / ...';
    if (elements.updateProgressStatusText) {
      elements.updateProgressStatusText.textContent = t('downloading_package');
    }
    window.NativeUpdater.downloadAndInstall(pendingApkDownloadUrl);
    return;
  }

  // Web Browser Fallback
  if (swRegistration && swRegistration.waiting) {
    showToast('Applying latest update...');
    swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
    if ('caches' in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    }
    setTimeout(() => {
      window.location.reload();
    }, 450);
    return;
  }

  // Standalone web download
  window.open(pendingApkDownloadUrl, '_system');
}

async function fetchGithubReleaseMeta() {
  try {
    const relRes = await fetch(
      'https://api.github.com/repos/LEESC88/ledger/releases/latest',
      { headers: { Accept: 'application/vnd.github.v3+json' } },
    );
    if (!relRes.ok) return null;
    const relData = await relRes.json();
    const tagVer = (relData.tag_name || '').replace(/^v/i, '');
    if (!tagVer) return null;
    const apkAsset = (relData.assets || []).find(
      (a) => a.name && a.name.endsWith('.apk'),
    );
    return {
      version: tagVer,
      apkUrl: apkAsset?.browser_download_url || '',
      notes: relData.body || '',
    };
  } catch (e) {
    return null;
  }
}

async function fetchVersionJsonMeta(isNativeApp) {
  const sources = [
    `https://raw.githubusercontent.com/LEESC88/ledger/master/public/version.json?t=${Date.now()}`,
    `https://cdn.jsdelivr.net/gh/LEESC88/ledger@master/public/version.json?t=${Date.now()}`,
  ];
  if (!isNativeApp) sources.push(`/version.json?t=${Date.now()}`);
  for (const url of sources) {
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (res.ok) return await res.json();
    } catch (e) {}
  }
  return null;
}

async function checkForAppUpdates(isManual = false) {
  lastAutoUpdateCheckAt = Date.now();
  if (elements.appVersionBadge) {
    elements.appVersionBadge.textContent = `v${APP_VERSION}`;
  }

  if (isManual) {
    if (elements.checkUpdateBtn) elements.checkUpdateBtn.disabled = true;
    if (elements.checkUpdateIcon)
      elements.checkUpdateIcon.classList.add('sync-spinner-icon');
    if (elements.checkUpdateBtnText)
      elements.checkUpdateBtnText.textContent =
        state.lang === 'zh' ? '检查中...' : 'Checking...';
  }

  try {
    if (swRegistration) {
      await swRegistration.update().catch(() => {});
    }

    const isNativeApp = !!(window.NativeUpdater || window.Capacitor);
    const [relSettled, jsonSettled] = await Promise.allSettled([
      fetchGithubReleaseMeta(),
      fetchVersionJsonMeta(isNativeApp),
    ]);
    const relMeta = relSettled.status === 'fulfilled' ? relSettled.value : null;
    const jsonMeta =
      jsonSettled.status === 'fulfilled' ? jsonSettled.value : null;

    if (relMeta || jsonMeta) {
      const relVer = relMeta?.version || '';
      const jsonVer = jsonMeta?.version || '';
      let remoteVersion = relVer || jsonVer || APP_VERSION;
      if (relVer && jsonVer) {
        remoteVersion = compareSemver(jsonVer, relVer) > 0 ? jsonVer : relVer;
      }

      const apkUrl =
        relMeta?.apkUrl || jsonMeta?.apkUrl || pendingApkDownloadUrl;
      const rawNotes = jsonMeta?.notes || relMeta?.notes || '';
      const notes = rawNotes
        .replace(/\[(?:FORCE|MIN:\s*[^\]]+)\]/gi, '')
        .trim();

      const minMatch = (relMeta?.notes || '').match(
        /\[MIN:\s*([0-9]+(?:\.[0-9]+)*)\]/i,
      );
      const minSupported =
        jsonMeta?.minSupportedVersion || (minMatch ? minMatch[1] : '');

      const combinedNotes = `${relMeta?.notes || ''} ${rawNotes}`;
      const isForced =
        Boolean(jsonMeta?.forceUpdate) ||
        (Boolean(minSupported) &&
          compareSemver(APP_VERSION, minSupported) < 0) ||
        /\[FORCE\]/i.test(combinedNotes);

      const hasNewerVersion = compareSemver(remoteVersion, APP_VERSION) > 0;
      const hasSwUpdate = Boolean(swRegistration && swRegistration.waiting);

      if (hasNewerVersion || hasSwUpdate) {
        showUpdateAvailablePrompt(remoteVersion, apkUrl, notes, isForced);
        if (isManual) {
          openInAppUpdateModal(isForced);
        }
        return;
      }
    }

    if (isManual) {
      if (elements.updateStatusText) {
        elements.updateStatusText.textContent = `${t('up_to_date')} (v${APP_VERSION})`;
      }
      showToast(`${t('up_to_date')} (v${APP_VERSION})`);
    }
  } catch (err) {
    if (isManual) {
      showToast('Could not reach update server.', true);
    }
  } finally {
    if (isManual) {
      if (elements.checkUpdateBtn) elements.checkUpdateBtn.disabled = false;
      if (elements.checkUpdateIcon)
        elements.checkUpdateIcon.classList.remove('sync-spinner-icon');
      if (
        elements.checkUpdateBtnText &&
        (!pendingUpdateVersion ||
          compareSemver(pendingUpdateVersion, APP_VERSION) <= 0)
      ) {
        elements.checkUpdateBtnText.textContent = t('btn_check_update');
      }
    }
  }
}
