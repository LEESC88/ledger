/* MonetaX Engine - Monthly Budgets, Top-Ups, Charts, CSV Export & Archiving */

/**
 * Monthly Budget Tracker Helpers & UI Rendering
 */
function getBudgetStorageKey(month) {
  const userKey = state.user?.id || 'guest';
  return `ledger_budget_${userKey}_${month || 'default'}`;
}

async function loadBudget(month) {
  const targetMonth = month === 'all' ? 'default' : month || 'default';
  const cacheKey = getBudgetStorageKey(targetMonth);
  const defaultKey = getBudgetStorageKey('default');

  const cached =
    localStorage.getItem(cacheKey) || localStorage.getItem(defaultKey);
  if (cached && !isNaN(Number(cached))) {
    state.monthlyBudget = Number(cached);
  } else {
    state.monthlyBudget = 3000;
  }
  renderBudgetTracker();

  const userId = state.user?.id;
  if (!userId) return;

  try {
    if (supabaseClient) {
      let { data, error } = await supabaseClient
        .from('budgets')
        .select('amount')
        .eq('user_id', userId)
        .eq('month', targetMonth)
        .maybeSingle();

      // If no specific budget set for this new month yet, inherit user's default base budget from cloud
      if ((!data || data.amount === null) && targetMonth !== 'default') {
        const fallbackRes = await supabaseClient
          .from('budgets')
          .select('amount')
          .eq('user_id', userId)
          .eq('month', 'default')
          .maybeSingle();
        if (!fallbackRes.error && fallbackRes.data) {
          data = fallbackRes.data;
          error = null;
        }
      }

      if (
        !error &&
        data &&
        data.amount !== null &&
        !isNaN(Number(data.amount))
      ) {
        state.monthlyBudget = Number(data.amount);
        localStorage.setItem(cacheKey, state.monthlyBudget);
        localStorage.setItem(defaultKey, state.monthlyBudget);
        renderBudgetTracker();
        return;
      }
    }

    const res = await fetch(
      `/api/budgets?month=${encodeURIComponent(targetMonth)}`,
      {
        headers: getAuthHeaders(),
      },
    );
    if (res.ok) {
      const data = await res.json();
      if (data && data.amount !== null && !isNaN(Number(data.amount))) {
        state.monthlyBudget = Number(data.amount);
        localStorage.setItem(cacheKey, state.monthlyBudget);
        renderBudgetTracker();
      }
    }
  } catch (err) {
    // Uses cached budget when offline
  }
}

async function persistBudget(amount, month) {
  const targetMonth = month === 'all' ? 'default' : month || 'default';
  const cacheKey = getBudgetStorageKey(targetMonth);

  state.monthlyBudget = Number(amount);
  localStorage.setItem(cacheKey, state.monthlyBudget);
  localStorage.setItem(getBudgetStorageKey('default'), state.monthlyBudget);
  renderBudgetTracker();

  const userId = state.user?.id;
  if (!userId) return;

  try {
    if (supabaseClient) {
      const rowsToUpsert = [
        { user_id: userId, month: targetMonth, amount: state.monthlyBudget },
      ];
      if (targetMonth !== 'default') {
        rowsToUpsert.push({
          user_id: userId,
          month: 'default',
          amount: state.monthlyBudget,
        });
      }
      const { error } = await supabaseClient
        .from('budgets')
        .upsert(rowsToUpsert, { onConflict: 'user_id,month' });
      if (!error) return;
    }

    await fetch('/api/budgets', {
      method: 'POST',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({
        month: targetMonth,
        amount: state.monthlyBudget,
      }),
    });
  } catch (err) {
    console.error('Failed to persist budget:', err);
  }
}

function renderBudgetTracker() {
  if (!elements.budgetTrackerBanner) return;

  const totalExpense = Number(state.summary?.totalExpense || 0);
  const baseBudget = Number(state.monthlyBudget || 3000);
  const targetMonth =
    state.currentMonth === 'all' ? getCurrentMonthKey() : state.currentMonth;
  const topUps = getBudgetTopUpTotal(targetMonth);
  const lockedFunds = getLockedSinkingFundAmount(targetMonth);
  const effectiveBudget = Math.max(0, baseBudget + topUps - lockedFunds);
  const sym = state.currency || 'RM';

  // Update Formula Row if topups or locked funds exist
  if (elements.budgetFormulaRow && elements.budgetFormulaText) {
    if (topUps > 0 || lockedFunds > 0) {
      elements.budgetFormulaRow.classList.remove('hidden');
      const effLabel = state.lang === 'zh' ? '有效日常' : 'Effective Daily';
      elements.budgetFormulaText.textContent =
        `${t('budget_base_label')}: ${sym} ${formatNumber(baseBudget)} ` +
        (topUps > 0
          ? `+ ${t('budget_topup_label')}: ${sym} ${formatNumber(topUps)} `
          : '') +
        (lockedFunds > 0
          ? `- ${t('budget_locked_label')}: ${sym} ${formatNumber(lockedFunds)} `
          : '') +
        `= ${effLabel}: ${sym} ${formatNumber(effectiveBudget)}`;
    } else {
      elements.budgetFormulaRow.classList.add('hidden');
    }
  }

  // Update Striped Locked Bar in Track
  if (elements.budgetLockedBar) {
    const totalCapacity = baseBudget + topUps;
    const lockedPct =
      totalCapacity > 0
        ? Math.min(100, Math.round((lockedFunds / totalCapacity) * 100))
        : 0;
    elements.budgetLockedBar.style.width = `${lockedPct}%`;
  }

  // Proactive near-limit / erosion alert
  if (lockedFunds > 0 && totalExpense > effectiveBudget) {
    const eroded = totalExpense - effectiveBudget;
    if (!state._hasAlertedErosion) {
      state._hasAlertedErosion = true;
      showToast(
        state.lang === 'zh'
          ? `注意：日常消费已超标透支 ${sym} ${formatNumber(eroded)}，侵蚀了专款储备！`
          : `Alert: Daily spending exceeded by ${sym} ${formatNumber(eroded)}, eroding sinking funds!`,
        true,
      );
    }
  }

  const budgetLimit = effectiveBudget;
  const percentage =
    budgetLimit > 0 ? Math.round((totalExpense / budgetLimit) * 100) : 0;
  const barWidth = Math.min(Math.max(percentage, 0), 100);

  if (elements.budgetPeriodLabel) {
    elements.budgetPeriodLabel.textContent =
      state.currentMonth === 'all' ? t('all_records') : state.currentMonth;
  }
  if (elements.budgetSpentVal) {
    elements.budgetSpentVal.textContent = `${sym} ${formatNumber(totalExpense)}`;
  }
  if (elements.budgetLimitVal) {
    elements.budgetLimitVal.textContent = `${sym} ${formatNumber(budgetLimit)}`;
  }
  if (elements.budgetPctVal) {
    elements.budgetPctVal.textContent = `${percentage}%`;
  }

  if (elements.budgetProgressBar) {
    elements.budgetProgressBar.style.width = `${barWidth}%`;
    elements.budgetProgressBar.classList.remove(
      'progress-normal',
      'progress-warning',
      'progress-danger',
    );
  }

  elements.budgetPctVal?.classList.remove('text-warning', 'text-danger');
  elements.budgetRemainingLabel?.classList.remove(
    'text-warning',
    'text-danger',
  );

  if (percentage >= 100) {
    elements.budgetProgressBar?.classList.add('progress-danger');
    elements.budgetPctVal?.classList.add('text-danger');
    elements.budgetRemainingLabel?.classList.add('text-danger');
    const overspend = totalExpense - budgetLimit;
    if (elements.budgetRemainingLabel) {
      elements.budgetRemainingLabel.textContent = `${t('exceeded_by')}: ${sym} ${formatNumber(overspend)}`;
    }
  } else if (percentage >= 85) {
    elements.budgetProgressBar?.classList.add('progress-warning');
    elements.budgetPctVal?.classList.add('text-warning');
    elements.budgetRemainingLabel?.classList.add('text-warning');
    const remaining = budgetLimit - totalExpense;
    if (elements.budgetRemainingLabel) {
      elements.budgetRemainingLabel.textContent = `${t('remaining')}: ${sym} ${formatNumber(remaining)}`;
    }
  } else {
    elements.budgetProgressBar?.classList.add('progress-normal');
    const remaining = budgetLimit - totalExpense;
    if (elements.budgetRemainingLabel) {
      elements.budgetRemainingLabel.textContent = `${t('remaining')}: ${sym} ${formatNumber(remaining)}`;
    }
  }

  if (typeof renderBudgetFundsSection === 'function') {
    renderBudgetFundsSection(targetMonth, totalExpense, budgetLimit);
  }
}

function openBudgetModal() {
  if (!elements.budgetModal) return;
  const targetLabel =
    state.currentMonth === 'all' ? t('all_records') : state.currentMonth;
  if (elements.budgetModalMonthText)
    elements.budgetModalMonthText.textContent = targetLabel;
  if (elements.budgetInputAmount)
    elements.budgetInputAmount.value = state.monthlyBudget || 3000;
  elements.budgetModal.classList.remove('hidden');
  pushModalHistoryState();
  elements.budgetInputAmount?.focus();
}

function closeBudgetModal(fromPopState = false) {
  elements.budgetModal?.classList.add('hidden');
  popModalHistoryIfCleared(fromPopState === true);
}

function handleSaveBudget() {
  const val = parseFloat(elements.budgetInputAmount?.value);
  if (isNaN(val) || val <= 0) {
    return showToast(
      state.lang === 'zh'
        ? '请输入大于 0 的有效预算金额'
        : 'Please enter a valid budget amount',
      true,
    );
  }
  persistBudget(val, state.currentMonth);
  closeBudgetModal();
  showToast(
    state.lang === 'zh'
      ? `预算已更新为 ${state.currency} ${formatNumber(val)}`
      : `Monthly budget updated to ${state.currency} ${formatNumber(val)}`,
  );
}

/**
 * Chart.js Instance & Color Harmony Palette
 */
let categoryChartInstance = null;

const CHART_PALETTE = [
  '#F97316', // Warm Orange
  '#0EA5E9', // Vibrant Sky Blue
  '#EC4899', // Bright Pink
  '#8B5CF6', // Royal Purple
  '#EAB308', // Amber Gold
  '#EF4444', // Red Coral
  '#10B981', // Emerald Green
  '#06B6D4', // Vibrant Cyan
  '#6366F1', // Indigo
  '#64748B', // Slate Grey
];

/**
 * Render Category Breakdown Donut Chart
 */
function renderCategoryChart(breakdown) {
  const chartCanvas = document.getElementById('categoryChart');
  if (!chartCanvas) return;

  const rawCategories = Object.keys(breakdown || {});
  const localizedLabels = rawCategories.map((c) => getCategoryDisplayLabel(c));
  const amounts = Object.values(breakdown || {}).map(Number);
  const totalExpense = amounts.reduce((sum, val) => sum + val, 0);

  if (rawCategories.length === 0 || totalExpense <= 0) {
    if (categoryChartInstance) {
      categoryChartInstance.destroy();
      categoryChartInstance = null;
    }
    elements.chartEmptyOverlay?.classList.remove('hidden');
    if (elements.chartCategoryCount) {
      elements.chartCategoryCount.textContent = `0 ${t('categories_unit')}`;
    }
    return;
  }

  elements.chartEmptyOverlay?.classList.add('hidden');
  if (elements.chartCategoryCount) {
    elements.chartCategoryCount.textContent = `${rawCategories.length} ${t('categories_unit')}`;
  }

  if (categoryChartInstance) {
    categoryChartInstance.destroy();
  }

  const isDark = isDarkModeActive();
  const ctx = chartCanvas.getContext('2d');
  const categoryColors = rawCategories.map(
    (c, idx) =>
      CATEGORY_META[c]?.color || CHART_PALETTE[idx % CHART_PALETTE.length],
  );

  categoryChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: localizedLabels,
      datasets: [
        {
          data: amounts,
          backgroundColor: categoryColors,
          borderWidth: 2,
          borderColor: isDark ? '#111827' : '#FFFFFF',
          hoverOffset: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '68%',
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            boxWidth: 9,
            boxHeight: 9,
            usePointStyle: true,
            pointStyle: 'circle',
            font: {
              family: "'Plus Jakarta Sans', sans-serif",
              size: 11,
              weight: '600',
            },
            color: isDark ? '#F8FAFC' : '#334155',
            padding: 10,
          },
        },
        tooltip: {
          backgroundColor: isDark ? '#1F2937' : '#0F172A',
          padding: 9,
          cornerRadius: 8,
          callbacks: {
            label: function (context) {
              const val = Number(context.raw) || 0;
              const pct =
                totalExpense > 0 ? ((val / totalExpense) * 100).toFixed(1) : 0;
              return ` ${state.currency} ${formatNumber(val)} (${pct}%)`;
            },
          },
        },
      },
    },
  });
}

let dailyTrendChartInstance = null;

/**
 * Render Month's Daily Spending Trend Line / Area Chart
 */
function renderDailyTrendChart(trendData) {
  const chartCanvas = document.getElementById('dailyTrendChart');
  if (!chartCanvas) return;

  const {
    labels = [],
    data = [],
    peakDay = null,
    peakAmount = 0,
  } = trendData || {};
  const totalSpent = (data || []).reduce((sum, v) => sum + Number(v || 0), 0);

  if (!labels.length || totalSpent <= 0) {
    if (dailyTrendChartInstance) {
      dailyTrendChartInstance.destroy();
      dailyTrendChartInstance = null;
    }
    elements.trendEmptyOverlay?.classList.remove('hidden');
    if (elements.trendPeakDayBadge) {
      elements.trendPeakDayBadge.textContent = `${t('trend_peak')}: —`;
    }
    return;
  }

  elements.trendEmptyOverlay?.classList.add('hidden');
  if (elements.trendPeakDayBadge) {
    if (peakDay && peakAmount > 0) {
      const sym = state.currency || 'RM';
      const dayLabel = state.lang === 'zh' ? `${peakDay}日` : `Day ${peakDay}`;
      elements.trendPeakDayBadge.textContent = `${t('trend_peak')}: ${dayLabel} (${sym} ${formatNumber(peakAmount)})`;
    } else {
      elements.trendPeakDayBadge.textContent = `${t('trend_peak')}: —`;
    }
  }

  if (dailyTrendChartInstance) {
    dailyTrendChartInstance.destroy();
  }

  const isDark = isDarkModeActive();
  const ctx = chartCanvas.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, 0, 180);
  gradient.addColorStop(
    0,
    isDark ? 'rgba(13, 148, 136, 0.4)' : 'rgba(13, 148, 136, 0.25)',
  );
  gradient.addColorStop(
    1,
    isDark ? 'rgba(13, 148, 136, 0.01)' : 'rgba(13, 148, 136, 0.01)',
  );

  dailyTrendChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: t('expense'),
          data: data,
          borderColor: '#0D9488',
          borderWidth: 2,
          backgroundColor: gradient,
          fill: true,
          tension: 0.35,
          pointRadius: (ctx) => (Number(ctx.raw) > 0 ? 3 : 0),
          pointHoverRadius: 6,
          pointBackgroundColor: '#0D9488',
          pointBorderColor: isDark ? '#111827' : '#FFFFFF',
          pointBorderWidth: 1.5,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: 'index',
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: isDark ? '#1F2937' : '#0F172A',
          titleColor: '#F8FAFC',
          bodyColor: '#E2E8F0',
          padding: 8,
          cornerRadius: 8,
          callbacks: {
            title: (items) => {
              const day = items[0]?.label;
              return state.lang === 'zh' ? `${day}日` : `Day ${day}`;
            },
            label: (item) => {
              const val = Number(item.raw) || 0;
              return ` ${t('expense')}: ${state.currency} ${formatNumber(val)}`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            color: isDark ? '#94A3B8' : '#64748B',
            font: { size: 10, weight: '500' },
            maxTicksLimit: 12,
          },
        },
        y: {
          beginAtZero: true,
          grid: {
            color: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.05)',
          },
          ticks: {
            color: isDark ? '#94A3B8' : '#64748B',
            font: { size: 10 },
            maxTicksLimit: 5,
            callback: (v) => `${v}`,
          },
        },
      },
    },
  });
}

/**
 * Trigger recalculation and re-rendering of the Daily Spending Trend
 */
function updateDailySpendingTrend() {
  const trendData = calculateDailySpendingTrend(
    state.records,
    state.currentMonth,
  );
  renderDailyTrendChart(trendData);
}

/**
 * Calculate daily expense totals across all days of the selected month
 * for the "Daily Spending Trend" area/line chart.
 *
 * @param {Array<Object>} records - All transaction records
 * @param {string} currentMonth - Selected month string (e.g. "2026-10" or "all")
 * @returns {Object} Chart data object { labels, data, peakDay, peakAmount }
 */
function calculateDailySpendingTrend(records, currentMonth) {
  const targetMonth =
    currentMonth && currentMonth !== 'all'
      ? currentMonth
      : getCurrentMonthKey();
  const [year, month] = targetMonth.split('-').map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();
  const labels = Array.from({ length: daysInMonth }, (_, i) => String(i + 1));
  const dailyTotals = new Array(daysInMonth).fill(0);
  const monthExpenses = (records || []).filter(
    (r) => r.type === 'expense' && r.date && r.date.startsWith(targetMonth),
  );

  for (const record of monthExpenses) {
    const dayNum = parseInt(record.date.split('-')[2], 10);
    if (dayNum >= 1 && dayNum <= daysInMonth) {
      dailyTotals[dayNum - 1] += Number(record.amount || 0);
    }
  }

  let peakAmount = 0;
  let peakDay = null;
  dailyTotals.forEach((val, idx) => {
    if (val > peakAmount) {
      peakAmount = val;
      peakDay = idx + 1;
    }
  });

  return { labels, data: dailyTotals, peakDay, peakAmount };
}

/**
 * Save file via Native OS File Picker or Android native share sheet if supported,
 * falling back to standard browser download.
 * @param {Blob} blob - The file blob
 * @param {string} defaultFileName - Suggested file name
 * @param {string} fileDescription - Description of file type for OS dialog
 * @param {string} mimeType - MIME type of the file
 * @param {string[]} extensions - Accepted file extensions for showSaveFilePicker
 * @returns {Promise<{ success?: boolean, canceled?: boolean, fileName: string, isNativePicker?: boolean, isNativeShare?: boolean }>}
 */
async function saveBlobWithPicker(
  blob,
  defaultFileName,
  fileDescription = 'CSV 表格文件 (*.csv)',
  mimeType = 'text/csv;charset=utf-8',
  extensions = ['.csv'],
  options = {},
) {
  const { preferDirectDownload = false } = options;
  const baseMime = String(mimeType || 'application/octet-stream')
    .split(';')[0]
    .trim();

  // 1. Android Native APK Share & Save Sheet (FileProvider + Intent.ACTION_SEND)
  if (
    window.NativeUpdater &&
    typeof window.NativeUpdater.shareBinaryFile === 'function'
  ) {
    try {
      const base64Data = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const resultStr = String(reader.result || '');
          const commaIdx = resultStr.indexOf(',');
          resolve(commaIdx !== -1 ? resultStr.slice(commaIdx + 1) : resultStr);
        };
        reader.onerror = () =>
          reject(reader.error || new Error('FileReader failed'));
        reader.readAsDataURL(blob);
      });
      window.NativeUpdater.shareBinaryFile(
        defaultFileName,
        base64Data,
        baseMime,
        fileDescription,
      );
      return {
        success: true,
        fileName: defaultFileName,
        isNativeShare: true,
      };
    } catch (err) {
      console.warn('NativeUpdater.shareBinaryFile failed:', err);
    }
  } else if (
    baseMime === 'text/csv' &&
    window.NativeUpdater &&
    typeof window.NativeUpdater.shareCsvFile === 'function'
  ) {
    try {
      const csvText = await blob.text();
      window.NativeUpdater.shareCsvFile(
        defaultFileName,
        csvText,
        fileDescription,
      );
      return {
        success: true,
        fileName: defaultFileName,
        isNativeShare: true,
      };
    } catch (err) {
      console.warn('NativeUpdater.shareCsvFile failed:', err);
    }
  }

  // 2. Mobile Browser Web Share API (System Share & Save to Files Sheet)
  const isMobileDevice = /Android|iPhone|iPad|iPod/i.test(
    navigator.userAgent || '',
  );
  if (
    isMobileDevice &&
    typeof navigator.share === 'function' &&
    typeof navigator.canShare === 'function'
  ) {
    try {
      const shareFile = new File([blob], defaultFileName, {
        type: baseMime,
      });
      if (navigator.canShare({ files: [shareFile] })) {
        await navigator.share({
          files: [shareFile],
          title: defaultFileName,
        });
        return {
          success: true,
          fileName: defaultFileName,
          isNativeShare: true,
        };
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        return { canceled: true, fileName: defaultFileName };
      }
      console.warn('navigator.share failed, falling back:', err);
    }
  }

  // 3. Desktop OS Save File Picker (Chrome / Edge Desktop)
  if (!preferDirectDownload && typeof window.showSaveFilePicker === 'function') {
    try {
      const acceptedExts =
        Array.isArray(extensions) && extensions.length > 0
          ? extensions
          : ['.bin'];
      const handle = await window.showSaveFilePicker({
        suggestedName: defaultFileName,
        types: [
          {
            description: fileDescription,
            accept: { [baseMime]: acceptedExts },
          },
        ],
      });
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
      return {
        success: true,
        fileName: handle.name || defaultFileName,
        isNativePicker: true,
      };
    } catch (err) {
      if (err.name === 'AbortError') {
        // User deliberately clicked cancel in OS save dialog
        return { canceled: true, fileName: defaultFileName };
      }
      console.warn('showSaveFilePicker failed, falling back to download:', err);
    }
  }

  // 4. Fallback download link for browsers without native picker/share
  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.setAttribute('download', defaultFileName);
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return { success: true, fileName: defaultFileName, isNativePicker: false };
}

function formatCsvCell(value, options = {}) {
  if (value === null || value === undefined || value === '') return '';
  if (typeof value === 'number') {
    if (options.isPercent) return `${(value * 100).toFixed(1)}%`;
    if (options.isCurrency) return value.toFixed(2);
    return String(value);
  }
  const str = String(value);
  if (/[",\r\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function buildExportReportData() {
  const isZh = state.lang === 'zh';
  const currency = state.currency || 'MYR';
  const { records, projects, claims } = getExportScopedDataset();
  const periodLabel =
    state.currentMonth === 'all'
      ? isZh
        ? '全部月份'
        : 'All Months'
      : state.currentMonth;
  const exportedAt = new Date().toLocaleString(isZh ? 'zh-CN' : 'en-US', {
    hour12: false,
  });

  // ---- Ledger & Category Breakdown ----
  let totalExpense = 0;
  let totalIncome = 0;
  let expenseCount = 0;
  let incomeCount = 0;
  const categoryMap = new Map();

  const ledgerRows = records.map((r, idx) => {
    const isExpense = r.type === 'expense';
    const numAmt = Math.abs(Number(r.amount) || 0);
    const signedAmt = Number((isExpense ? -numAmt : numAmt).toFixed(2));
    if (isExpense) {
      totalExpense += numAmt;
      expenseCount++;
      const catKey = getCategoryDisplayLabel(r.category);
      const prev = categoryMap.get(catKey) || { count: 0, amount: 0 };
      prev.count += 1;
      prev.amount += numAmt;
      categoryMap.set(catKey, prev);
    } else {
      totalIncome += numAmt;
      incomeCount++;
    }

    const projTitle = r.project_id
      ? (state.projects || []).find(
          (p) => String(p.id) === String(r.project_id),
        )?.title || ''
      : '';
    const createdAtStr = r.createdAt
      ? new Date(r.createdAt).toLocaleString(isZh ? 'zh-CN' : 'en-US', {
          hour12: false,
        })
      : '';

    return [
      idx + 1,
      r.date || '',
      isExpense ? (isZh ? '支出' : 'Expense') : isZh ? '收入' : 'Income',
      getCategoryDisplayLabel(r.category),
      getAccountDisplayName(r.account_name),
      signedAmt,
      currency,
      r.note || '',
      projTitle,
      createdAtStr,
    ];
  });

  const netBalance = Number((totalIncome - totalExpense).toFixed(2));
  totalExpense = Number(totalExpense.toFixed(2));
  totalIncome = Number(totalIncome.toFixed(2));

  // ---- Projects & Entries ----
  let totalProjectBudget = 0;
  let totalProjectSpent = 0;
  const projectSummaryRows = [];
  const projectEntryRows = [];

  projects.forEach((p) => {
    const target = Number((parseFloat(p.target_amount) || 0).toFixed(2));
    const entries =
      typeof normalizeProjectEntries === 'function'
        ? normalizeProjectEntries(p.entries)
        : Array.isArray(p.entries)
          ? p.entries
          : [];
    const spent =
      typeof getProjectSpentAmount === 'function'
        ? getProjectSpentAmount(p)
        : Number((parseFloat(p.spent_amount) || 0).toFixed(2));
    const remaining = Number((target - spent).toFixed(2));
    const progress = target > 0 ? spent / target : 0;
    totalProjectBudget += target;
    totalProjectSpent += spent;

    const statusLabel =
      p.status === 'archived'
        ? isZh
          ? '已归档'
          : 'Archived'
        : isZh
          ? '进行中'
          : 'Active';
    const modeLabel = p.include_in_budget
      ? isZh
        ? '计入月预算'
        : 'In Monthly Budget'
      : isZh
        ? '独立专款'
        : 'Independent Fund';
    const timeframeLabel = p.deadline
      ? `${p.start_date || ''} ~ ${p.deadline}`
      : p.month || (isZh ? '长期有效' : 'Indefinite');

    projectSummaryRows.push([
      p.title || '',
      modeLabel,
      statusLabel,
      target,
      spent,
      remaining,
      progress,
      timeframeLabel,
      entries.length,
    ]);

    entries.forEach((e) => {
      projectEntryRows.push([
        p.title || '',
        e.date || '',
        e.title || '',
        getCategoryDisplayLabel(e.category || 'Other Expense'),
        getAccountDisplayName(e.account_name || 'Cash'),
        Number((parseFloat(e.amount) || 0).toFixed(2)),
        currency,
      ]);
    });
  });

  // ---- Claims & Split Parties ----
  let totalClaimsPending = 0;
  let totalClaimsReceived = 0;
  const claimSummaryRows = [];
  const claimFriendRows = [];

  claims.forEach((c) => {
    const friends = Array.isArray(c.friends) ? c.friends : [];
    const totalAmt = Number((parseFloat(c.total_amount) || 0).toFixed(2));
    const myShare = Number((parseFloat(c.my_share) || 0).toFixed(2));
    let received = 0;
    let pending = 0;

    friends.forEach((f) => {
      const fAmt = Number((parseFloat(f.amount) || 0).toFixed(2));
      if (f.paid) {
        received += fAmt;
      } else {
        pending += fAmt;
      }
      claimFriendRows.push([
        c.title || '',
        c.date || '',
        f.name || '',
        fAmt,
        currency,
        f.paid ? (isZh ? '已结清' : 'Paid') : isZh ? '待收款' : 'Pending',
        f.paid_via
          ? getAccountDisplayName(f.paid_via)
          : isZh
            ? '未记录'
            : 'Unrecorded',
      ]);
    });

    received = Number(received.toFixed(2));
    pending = Number(pending.toFixed(2));
    totalClaimsReceived += received;
    totalClaimsPending += pending;

    claimSummaryRows.push([
      c.title || '',
      c.date || '',
      c.status === 'settled'
        ? isZh
          ? '已结清'
          : 'Settled'
        : isZh
          ? '待收款'
          : 'Active',
      totalAmt,
      myShare,
      Number((received + pending).toFixed(2)),
      received,
      pending,
      friends.length,
    ]);
  });

  // ---- Section 1: Summary ----
  const summaryData = [
    [isZh ? 'MonetaX 财务数据报表汇总' : 'MonetaX Financial Summary Report'],
    [
      isZh ? '统计周期' : 'Period',
      periodLabel,
      isZh ? '币种' : 'Currency',
      currency,
    ],
    [isZh ? '导出时间' : 'Exported At', exportedAt, '', ''],
    [],
    isZh
      ? ['核心指标', '数值', '笔数 / 数量', '备注']
      : ['Key Metric', 'Amount', 'Count', 'Notes'],
    [
      isZh ? '总收入' : 'Total Income',
      totalIncome,
      incomeCount,
      isZh ? '当前周期收入合计' : 'Total income in scope',
    ],
    [
      isZh ? '总支出' : 'Total Expense',
      -totalExpense,
      expenseCount,
      isZh ? '当前周期支出合计' : 'Total expense in scope',
    ],
    [
      isZh ? '收支净额' : 'Net Balance',
      netBalance,
      records.length,
      netBalance >= 0
        ? isZh
          ? '结余盈余'
          : 'Surplus'
        : isZh
          ? '净支出超支'
          : 'Deficit',
    ],
    [
      isZh ? '专款总预算 / 已用' : 'Projects Budget / Spent',
      Number(totalProjectSpent.toFixed(2)),
      projects.length,
      isZh
        ? `总预算 ${currency} ${totalProjectBudget.toFixed(2)}`
        : `Total Budget ${currency} ${totalProjectBudget.toFixed(2)}`,
    ],
    [
      isZh ? '代垫待收余额' : 'Pending Split Claims',
      Number(totalClaimsPending.toFixed(2)),
      claims.length,
      isZh
        ? `已收回 ${currency} ${totalClaimsReceived.toFixed(2)}`
        : `Received ${currency} ${totalClaimsReceived.toFixed(2)}`,
    ],
    [],
    isZh
      ? ['支出分类排行', '支出金额', '笔数', '占比']
      : ['Expense Category Breakdown', 'Amount', 'Count', 'Share'],
  ];

  const sortedCategories = Array.from(categoryMap.entries()).sort(
    (a, b) => b[1].amount - a[1].amount,
  );
  if (sortedCategories.length > 0) {
    sortedCategories.forEach(([catName, info]) => {
      summaryData.push([
        catName,
        Number(info.amount.toFixed(2)),
        info.count,
        totalExpense > 0 ? info.amount / totalExpense : 0,
      ]);
    });
  } else {
    summaryData.push([isZh ? '暂无支出记录' : 'No expense records', 0, 0, 0]);
  }

  // ---- Section 2: Ledger ----
  const ledgerHeaders = isZh
    ? [
        '序号',
        '记账日期',
        '收支类型',
        '消费分类',
        '支付账户',
        '金额',
        '币种',
        '备注说明',
        '关联专款',
        '创建时间',
      ]
    : [
        'No.',
        'Date',
        'Type',
        'Category',
        'Account',
        'Amount',
        'Currency',
        'Note',
        'Linked Project',
        'Created At',
      ];
  const ledgerSheetData = [
    ledgerHeaders,
    ...ledgerRows,
    [],
    [
      '',
      '',
      '',
      isZh ? '总支出' : 'Total Expense',
      '',
      -totalExpense,
      currency,
      isZh ? `共 ${expenseCount} 笔` : `${expenseCount} expenses`,
      '',
      '',
    ],
    [
      '',
      '',
      '',
      isZh ? '总收入' : 'Total Income',
      '',
      totalIncome,
      currency,
      isZh ? `共 ${incomeCount} 笔` : `${incomeCount} incomes`,
      '',
      '',
    ],
    [
      '',
      '',
      '',
      isZh ? '收支净额' : 'Net Balance',
      '',
      netBalance,
      currency,
      netBalance >= 0
        ? isZh
          ? '结余盈余'
          : 'Surplus'
        : isZh
          ? '净支出超支'
          : 'Deficit',
      '',
      '',
    ],
  ];
  const ledgerFooterStart = ledgerRows.length + 2;

  // ---- Section 3: Projects ----
  const projOverviewHeaders = isZh
    ? [
        '专款名称',
        '预算模式',
        '状态',
        '预算总额',
        '已用金额',
        '剩余额度',
        '使用进度',
        '周期 / 截止日期',
        '明细笔数',
      ]
    : [
        'Project Title',
        'Mode',
        'Status',
        'Budget',
        'Spent',
        'Remaining',
        'Progress',
        'Timeframe / Deadline',
        'Entries',
      ];
  const projEntriesHeaders = isZh
    ? ['所属专款', '消费日期', '项目说明', '分类', '支付账户', '金额', '币种']
    : [
        'Project',
        'Date',
        'Entry Title',
        'Category',
        'Account',
        'Amount',
        'Currency',
      ];
  const projEntryTitleRowIdx =
    (projectSummaryRows.length > 0 ? projectSummaryRows.length : 1) + 2;
  const projectsSheetData = [
    projOverviewHeaders,
    ...(projectSummaryRows.length > 0
      ? projectSummaryRows
      : [[isZh ? '暂无专款卡片' : 'No projects', '', '', 0, 0, 0, 0, '', 0]]),
    [],
    [isZh ? '专款消费子条目明细' : 'Project Expense Entries'],
    projEntriesHeaders,
    ...(projectEntryRows.length > 0
      ? projectEntryRows
      : [
          [
            isZh ? '暂无专款消费条目' : 'No project entries',
            '',
            '',
            '',
            '',
            0,
            currency,
          ],
        ]),
  ];

  // ---- Section 4: Claims ----
  const claimsOverviewHeaders = isZh
    ? [
        '代垫项目',
        '日期',
        '状态',
        '总付金额',
        '本人自付',
        '朋友分摊合计',
        '已收回',
        '待收余额',
        '分摊人数',
      ]
    : [
        'Claim Title',
        'Date',
        'Status',
        'Total Paid',
        'My Share',
        'Friends Total',
        'Received',
        'Pending',
        'Parties',
      ];
  const claimsFriendHeaders = isZh
    ? ['所属代垫', '日期', '朋友姓名', '分摊金额', '币种', '结算状态', '收款方式']
    : [
        'Claim',
        'Date',
        'Friend',
        'Share Amount',
        'Currency',
        'Status',
        'Paid Via',
      ];
  const claimFriendTitleRowIdx =
    (claimSummaryRows.length > 0 ? claimSummaryRows.length : 1) + 2;
  const claimsSheetData = [
    claimsOverviewHeaders,
    ...(claimSummaryRows.length > 0
      ? claimSummaryRows
      : [
          [
            isZh ? '暂无代垫账单' : 'No split claims',
            '',
            '',
            0,
            0,
            0,
            0,
            0,
            0,
          ],
        ]),
    [],
    [isZh ? '分摊对象收款明细' : 'Split Party Payment Details'],
    claimsFriendHeaders,
    ...(claimFriendRows.length > 0
      ? claimFriendRows
      : [
          [
            isZh ? '暂无分摊对象' : 'No split parties',
            '',
            '',
            0,
            currency,
            '',
            '',
          ],
        ]),
  ];

  return {
    isZh,
    currency,
    records,
    projects,
    claims,
    summaryData,
    ledgerSheetData,
    ledgerFooterStart,
    projectsSheetData,
    projEntryTitleRowIdx,
    claimsSheetData,
    claimFriendTitleRowIdx,
  };
}

/**
 * Export Full Report (Summary, Ledger, Projects, Claims) as RFC 4180 CSV
 * Consistent with Excel export content & direct download behavior.
 */
async function exportToCSV() {
  const report = buildExportReportData();
  const { isZh, records, projects, claims } = report;

  if (records.length === 0 && projects.length === 0 && claims.length === 0) {
    showToast(isZh ? '暂无可导出的数据' : 'No data available to export', true);
    return;
  }

  const aoaToCsvLines = (aoa, currencyCols = [], percentCols = []) => {
    const currSet = new Set(currencyCols);
    const pctSet = new Set(percentCols);
    return aoa.map((row) =>
      row
        .map((cell, idx) =>
          formatCsvCell(cell, {
            isCurrency: currSet.has(idx),
            isPercent: pctSet.has(idx),
          }),
        )
        .join(','),
    );
  };

  const allLines = [
    ...aoaToCsvLines(report.summaryData, [1], [3]),
    '',
    formatCsvCell(isZh ? '【日常流水】' : '[Ledger]'),
    ...aoaToCsvLines(report.ledgerSheetData, [5]),
    '',
    formatCsvCell(isZh ? '【专款明细】' : '[Projects]'),
    ...aoaToCsvLines(report.projectsSheetData, [3, 4, 5], [6]),
    '',
    formatCsvCell(isZh ? '【代垫明细】' : '[Claims]'),
    ...aoaToCsvLines(report.claimsSheetData, [3, 4, 5, 6, 7]),
  ];

  const csvContent = '\uFEFF' + allLines.join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const defaultFileName = `monetax_report_${state.currentMonth === 'all' ? 'all' : state.currentMonth}_${new Date().toISOString().slice(0, 10)}.csv`;

  const saveRes = await saveBlobWithPicker(
    blob,
    defaultFileName,
    isZh ? 'MonetaX 财务报表 CSV (*.csv)' : 'MonetaX CSV Report (*.csv)',
    'text/csv;charset=utf-8',
    ['.csv'],
    { preferDirectDownload: true },
  );

  if (saveRes.canceled) {
    showToast(isZh ? '已取消下载' : 'Download canceled');
    return;
  }

  if (saveRes.isNativeShare) {
    showToast(
      isZh
        ? `已唤起系统分享：${saveRes.fileName}`
        : `Opened share sheet: ${saveRes.fileName}`,
    );
  } else {
    showToast(
      isZh
        ? `已下载 CSV 报表：${defaultFileName}`
        : `Downloaded CSV report: ${defaultFileName}`,
    );
  }
}

// ============================================================================
// Export Format Modal (Excel / CSV) & Styled Multi-Sheet Excel (.xlsx) Export
// ============================================================================

let xlsxLoadPromise = null;

function getExportScopedDataset() {
  let records = Array.isArray(state.records) ? [...state.records] : [];
  if (state.currentMonth !== 'all') {
    records = records.filter(
      (r) => r.date && r.date.startsWith(state.currentMonth),
    );
  }
  if (state.currentFilter !== 'all') {
    records = records.filter((r) => r.type === state.currentFilter);
  }

  const projects = Array.isArray(state.projects) ? [...state.projects] : [];
  let claims = Array.isArray(state.claims) ? [...state.claims] : [];
  if (state.currentMonth !== 'all') {
    claims = claims.filter(
      (c) =>
        !c.date ||
        c.date.startsWith(state.currentMonth) ||
        c.status !== 'settled',
    );
  }

  return { records, projects, claims };
}

function openExportFormatModal() {
  if (!elements.exportFormatModal) {
    exportToCSV();
    return;
  }
  triggerHaptic(10);
  const isZh = state.lang === 'zh';
  const { records, projects, claims } = getExportScopedDataset();
  const periodLabel =
    state.currentMonth === 'all'
      ? isZh
        ? '全部月份'
        : 'All Months'
      : state.currentMonth;

  if (elements.exportScopeSummary) {
    elements.exportScopeSummary.textContent = isZh
      ? `${periodLabel} · ${records.length} 笔流水 · ${projects.length} 项专款 · ${claims.length} 笔代垫`
      : `${periodLabel} · ${records.length} records · ${projects.length} projects · ${claims.length} claims`;
  }

  elements.exportFormatModal.classList.remove('hidden');
  pushModalHistoryState();
}

function closeExportFormatModal(fromPopState = false) {
  if (!elements.exportFormatModal) return;
  elements.exportFormatModal.classList.add('hidden');
  popModalHistoryIfCleared(fromPopState === true);
}

function loadXlsxLibrary() {
  if (window.XLSX && window.XLSX.utils) {
    return Promise.resolve(window.XLSX);
  }
  if (xlsxLoadPromise) return xlsxLoadPromise;

  xlsxLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src =
      'https://cdn.jsdelivr.net/npm/xlsx-js-style@1.2.0/dist/xlsx.bundle.js';
    script.async = true;
    script.onload = () => {
      if (window.XLSX && window.XLSX.utils) {
        resolve(window.XLSX);
      } else {
        xlsxLoadPromise = null;
        reject(new Error('XLSX library loaded without global XLSX'));
      }
    };
    script.onerror = () => {
      xlsxLoadPromise = null;
      reject(new Error('Failed to load XLSX library'));
    };
    document.head.appendChild(script);
  });

  return xlsxLoadPromise;
}

function applyExcelSheetStyles(
  XLSX,
  ws,
  headerRowIndices,
  colWidths,
  options = {},
) {
  const {
    currencyCols = [],
    percentCols = [],
    signedCols = [],
    summaryRowIndices = [],
    titleRowIndices = [],
  } = options;

  const ref = ws['!ref'];
  if (!ref) return;
  const range = XLSX.utils.decode_range(ref);
  const headerSet = new Set(headerRowIndices);
  const summarySet = new Set(summaryRowIndices);
  const titleSet = new Set(titleRowIndices);
  const currencySet = new Set(currencyCols);
  const percentSet = new Set(percentCols);
  const signedSet = new Set(signedCols);

  const thinBorder = {
    top: { style: 'thin', color: { rgb: 'E2E8F0' } },
    bottom: { style: 'thin', color: { rgb: 'E2E8F0' } },
    left: { style: 'thin', color: { rgb: 'E2E8F0' } },
    right: { style: 'thin', color: { rgb: 'E2E8F0' } },
  };

  for (let r = range.s.r; r <= range.e.r; r++) {
    for (let c = range.s.c; c <= range.e.c; c++) {
      const addr = XLSX.utils.encode_cell({ r, c });
      const cell = ws[addr];
      if (!cell) continue;

      if (titleSet.has(r)) {
        cell.s = {
          font: { bold: true, sz: 13, color: { rgb: '0F766E' } },
          alignment: { vertical: 'center', horizontal: 'left' },
        };
        continue;
      }

      if (headerSet.has(r)) {
        cell.s = {
          font: { bold: true, sz: 10, color: { rgb: 'FFFFFF' } },
          fill: { fgColor: { rgb: '0F766E' } },
          alignment: { vertical: 'center', horizontal: 'center' },
          border: thinBorder,
        };
        continue;
      }

      const isSummary = summarySet.has(r);
      const isNum = typeof cell.v === 'number';
      let fontColor = '1E293B';
      if (isNum && signedSet.has(c)) {
        fontColor = cell.v < 0 ? 'DC2626' : cell.v > 0 ? '059669' : '1E293B';
      }

      cell.s = {
        font: { bold: isSummary, sz: 10, color: { rgb: fontColor } },
        fill: isSummary
          ? { fgColor: { rgb: 'F0FDFA' } }
          : r % 2 === 1
            ? { fgColor: { rgb: 'F8FAFC' } }
            : undefined,
        alignment: {
          vertical: 'center',
          horizontal: isNum ? 'right' : 'left',
        },
        border: thinBorder,
      };

      if (isNum && currencySet.has(c)) {
        cell.z = '#,##0.00';
      } else if (isNum && percentSet.has(c)) {
        cell.z = '0.0%';
      }
    }
  }

  ws['!cols'] = colWidths.map((wch) => ({ wch }));
}

async function exportToExcel() {
  const report = buildExportReportData();
  const { isZh, records, projects, claims } = report;

  if (records.length === 0 && projects.length === 0 && claims.length === 0) {
    showToast(isZh ? '暂无可导出的数据' : 'No data available to export', true);
    return;
  }

  let XLSX;
  try {
    if (!window.XLSX) {
      showToast(isZh ? '正在准备 Excel 引擎...' : 'Loading Excel engine...');
    }
    XLSX = await loadXlsxLibrary();
  } catch (err) {
    showToast(
      isZh
        ? 'Excel 组件加载失败（离线可改选 CSV）'
        : 'Failed to load Excel library (use CSV while offline)',
      true,
    );
    return;
  }

  const wb = XLSX.utils.book_new();

  // Sheet 1: Summary
  const wsSummary = XLSX.utils.aoa_to_sheet(report.summaryData);
  applyExcelSheetStyles(XLSX, wsSummary, [4, 11], [26, 16, 14, 28], {
    titleRowIndices: [0],
    currencyCols: [1],
    percentCols: [3],
    signedCols: [1],
    summaryRowIndices: [7],
  });
  XLSX.utils.book_append_sheet(wb, wsSummary, isZh ? '收支汇总' : 'Summary');

  // Sheet 2: Ledger
  const wsLedger = XLSX.utils.aoa_to_sheet(report.ledgerSheetData);
  applyExcelSheetStyles(
    XLSX,
    wsLedger,
    [0],
    [8, 13, 10, 16, 15, 14, 9, 28, 18, 20],
    {
      currencyCols: [5],
      signedCols: [5],
      summaryRowIndices: [
        report.ledgerFooterStart,
        report.ledgerFooterStart + 1,
        report.ledgerFooterStart + 2,
      ],
    },
  );
  XLSX.utils.book_append_sheet(wb, wsLedger, isZh ? '日常流水' : 'Ledger');

  // Sheet 3: Projects
  const wsProjects = XLSX.utils.aoa_to_sheet(report.projectsSheetData);
  applyExcelSheetStyles(
    XLSX,
    wsProjects,
    [0, report.projEntryTitleRowIdx + 1],
    [22, 16, 12, 14, 14, 14, 12, 22, 10],
    {
      titleRowIndices: [report.projEntryTitleRowIdx],
      currencyCols: [3, 4, 5],
      percentCols: [6],
    },
  );
  XLSX.utils.book_append_sheet(wb, wsProjects, isZh ? '专款明细' : 'Projects');

  // Sheet 4: Claims
  const wsClaims = XLSX.utils.aoa_to_sheet(report.claimsSheetData);
  applyExcelSheetStyles(
    XLSX,
    wsClaims,
    [0, report.claimFriendTitleRowIdx + 1],
    [22, 13, 14, 14, 14, 14, 14, 14, 10],
    {
      titleRowIndices: [report.claimFriendTitleRowIdx],
      currencyCols: [3, 4, 5, 6, 7],
    },
  );
  XLSX.utils.book_append_sheet(wb, wsClaims, isZh ? '代垫明细' : 'Claims');

  const wbOut = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbOut], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const defaultFileName = `monetax_report_${state.currentMonth === 'all' ? 'all' : state.currentMonth}_${new Date().toISOString().slice(0, 10)}.xlsx`;
  const saveRes = await saveBlobWithPicker(
    blob,
    defaultFileName,
    isZh ? 'MonetaX 财务报表 Excel (*.xlsx)' : 'MonetaX Excel Workbook (*.xlsx)',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ['.xlsx'],
    { preferDirectDownload: true },
  );

  if (saveRes.canceled) {
    showToast(isZh ? '已取消下载' : 'Download canceled');
    return;
  }

  if (saveRes.isNativeShare) {
    showToast(
      isZh
        ? `已唤起系统分享：${saveRes.fileName}`
        : `Opened share sheet: ${saveRes.fileName}`,
    );
  } else {
    showToast(
      isZh
        ? `已下载 Excel 报表：${defaultFileName}`
        : `Downloaded Excel report: ${defaultFileName}`,
    );
  }
}

// ============================================================================
// Data Retention & Archiving Modal Controller
// ============================================================================

function getRetentionCutoffDate(years) {
  const date = new Date();
  date.setFullYear(date.getFullYear() - years);
  return date.toISOString().split('T')[0];
}

function updateRetentionDropdownLabels() {
  if (!elements.retentionYearsSelect) return;
  const isZh = state.lang === 'zh';
  const currentYear = new Date().getFullYear();
  const currentVal = elements.retentionYearsSelect.value || 'current_year';

  elements.retentionYearsSelect.innerHTML = `
    <option value="current_year">${isZh ? `本年度账单 (${currentYear}年)` : `Current Year (${currentYear})`}</option>
    <option value="1">${isZh ? '1 年前历史数据 (> 1年)' : '> 1 Year (365 Days)'}</option>
    <option value="2">${isZh ? '2 年前历史数据 (> 2年)' : '> 2 Years (730 Days)'}</option>
    <option value="3">${isZh ? '3 年前历史数据 (> 3年推荐)' : '> 3 Years (1095 Days)'}</option>
    <option value="5">${isZh ? '5 年前历史数据 (> 5年)' : '> 5 Years (1825 Days)'}</option>
  `;
  elements.retentionYearsSelect.value = currentVal;
}

function evaluateRetentionEligible() {
  if (!elements.retentionYearsSelect) return;
  const isZh = state.lang === 'zh';
  const val = elements.retentionYearsSelect.value;
  const currentYear = new Date().getFullYear();

  let matchingRecords = [];
  const isCurrentYear = val === 'current_year';

  if (isCurrentYear) {
    matchingRecords = (state.records || []).filter(
      (r) => r.date && r.date.startsWith(String(currentYear)),
    );
    if (elements.retentionCutoffPrefix) {
      elements.retentionCutoffPrefix.textContent = isZh ? '范围：' : 'Range: ';
    }
    if (elements.retentionCutoffDate) {
      elements.retentionCutoffDate.textContent = isZh
        ? `${currentYear}年度 (1月1日 - 至今)`
        : `Year ${currentYear} (YTD)`;
    }
  } else {
    const years = parseInt(val) || 3;
    const cutoffDate = getRetentionCutoffDate(years);
    if (elements.retentionCutoffPrefix) {
      elements.retentionCutoffPrefix.textContent = isZh ? '早于：' : 'before ';
    }
    if (elements.retentionCutoffDate) {
      elements.retentionCutoffDate.textContent = cutoffDate;
    }
    matchingRecords = (state.records || []).filter((r) => r.date < cutoffDate);
  }

  if (elements.retentionMatchCount) {
    elements.retentionMatchCount.textContent = matchingRecords.length;
  }

  if (elements.downloadArchiveBtn) {
    elements.downloadArchiveBtn.disabled = matchingRecords.length === 0;
  }

  if (elements.purgeOldRecordsBtn) {
    if (isCurrentYear) {
      elements.purgeOldRecordsBtn.disabled = true;
      elements.purgeOldRecordsBtn.style.opacity = '0.35';
      elements.purgeOldRecordsBtn.style.cursor = 'not-allowed';
      elements.purgeOldRecordsBtn.title = isZh
        ? '本年度当前账单受安全保护，不可清理'
        : 'Current year records are protected from purging';
    } else {
      const isDisabled = matchingRecords.length === 0;
      elements.purgeOldRecordsBtn.disabled = isDisabled;
      elements.purgeOldRecordsBtn.style.opacity = isDisabled ? '0.35' : '1';
      elements.purgeOldRecordsBtn.style.cursor = isDisabled
        ? 'not-allowed'
        : 'pointer';
      elements.purgeOldRecordsBtn.title = '';
    }
  }
}

function openRetentionModal() {
  updateRetentionDropdownLabels();
  evaluateRetentionEligible();
  elements.retentionModal?.classList.remove('hidden');
  pushModalHistoryState();
}

function closeRetentionModal(fromPopState = false) {
  elements.retentionModal?.classList.add('hidden');
  popModalHistoryIfCleared(fromPopState === true);
}

async function downLoadArchiveCSV() {
  const isZh = state.lang === 'zh';
  const val = elements.retentionYearsSelect?.value || '3';
  const currentYear = new Date().getFullYear();

  let matchingRecords = [];
  let defaultFileName = '';
  let fileDesc = '';

  if (val === 'current_year') {
    matchingRecords = (state.records || []).filter(
      (r) => r.date && r.date.startsWith(String(currentYear)),
    );
    defaultFileName = `monetax_export_year_${currentYear}_${getLocalDateString()}.csv`;
    fileDesc = isZh ? '本年度账单 CSV (*.csv)' : 'Current Year CSV (*.csv)';
  } else {
    const years = parseInt(val) || 3;
    const cutoffDate = getRetentionCutoffDate(years);
    matchingRecords = (state.records || []).filter((r) => r.date < cutoffDate);
    defaultFileName = `monetax_archive_older_than_${years}y_${cutoffDate}.csv`;
    fileDesc = isZh ? '归档账单 CSV (*.csv)' : 'Archive Records CSV (*.csv)';
  }

  if (matchingRecords.length === 0) {
    showToast(
      isZh
        ? val === 'current_year'
          ? '本年度暂无可导出的账单记录'
          : '没有符合归档年限的历史账单'
        : 'No records available for archiving',
      true,
    );
    return;
  }

  const headers = isZh
    ? [
        '序号',
        '记账日期',
        '收支类型',
        '消费分类',
        '支付账户',
        '金额',
        '币种',
        '备注说明',
        '创建时间',
      ]
    : [
        'No.',
        'Date',
        'Type',
        'Category',
        'Account',
        'Amount',
        'Currency',
        'Note',
        'Created At',
      ];

  const rows = matchingRecords.map((r, idx) => [
    idx + 1,
    `"${r.date}"`,
    `"${r.type === 'expense' ? (isZh ? '支出' : 'Expense') : isZh ? '收入' : 'Income'}"`,
    `"${getCategoryDisplayLabel(r.category)}"`,
    `"${getAccountDisplayName(r.account_name)}"`,
    (r.type === 'expense' ? -Number(r.amount) : Number(r.amount)).toFixed(2),
    `"${state.currency || 'MYR'}"`,
    `"${(r.note || '').replace(/"/g, '""')}"`,
    `"${r.createdAt ? new Date(r.createdAt).toLocaleString(isZh ? 'zh-CN' : 'en-US', { hour12: false }) : ''}"`,
  ]);

  const csvContent =
    '\uFEFF' +
    [headers.join(','), ...rows.map((e) => e.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

  const saveRes = await saveBlobWithPicker(blob, defaultFileName, fileDesc);

  if (saveRes.canceled) {
    showToast(isZh ? '已取消导出' : 'Export canceled');
    return;
  }

  showToast(
    isZh
      ? val === 'current_year'
        ? `已成功导出本年度共 ${matchingRecords.length} 笔账单`
        : `已成功归档导出 ${matchingRecords.length} 笔历史账单`
      : `Downloaded ${matchingRecords.length} records`,
  );
}

function purgeOldRecords() {
  const isZh = state.lang === 'zh';
  const val = elements.retentionYearsSelect?.value || '3';

  if (val === 'current_year') {
    showToast(
      isZh
        ? '本年度在用账单受安全保护，不可清理'
        : 'Current year records are protected from purging',
      true,
    );
    return;
  }

  const years = parseInt(val) || 3;
  const cutoffDate = getRetentionCutoffDate(years);

  showConfirmModal({
    title:
      state.lang === 'zh'
        ? '确认永久清理历史记录？'
        : 'Purge Historical Records?',
    subtitle: `Before ${cutoffDate}`,
    desc:
      state.lang === 'zh'
        ? `确定要永久清理早于 ${years} 年前的所有历史记录吗？此操作不可撤销。`
        : `Permanently delete all records older than ${years} years? This action cannot be undone.`,
    confirmText: state.lang === 'zh' ? '永久清理' : 'Purge',
    danger: true,
    onConfirm: async () => {
      const userId = state.user?.id;
      try {
        const recordsToPurge = (state.records || []).filter(
          (r) => r.date && r.date < cutoffDate && r.image_url,
        );
        for (const rec of recordsToPurge) {
          if (typeof deleteReceiptFromCloud === 'function') {
            await deleteReceiptFromCloud(rec.image_url);
          }
        }

        if (supabaseClient && userId) {
          const { error } = await supabaseClient
            .from('records')
            .delete()
            .eq('user_id', userId)
            .lt('date', cutoffDate);

          if (error) throw new Error(error.message);
        } else {
          const res = await fetch(`/api/records/purge?years=${years}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
          });
          if (!res.ok) throw new Error('Failed to purge old records');
        }

        showToast(
          state.lang === 'zh'
            ? `已清理 ${years} 年前的历史记录`
            : `Purged records older than ${years} years`,
        );
        closeRetentionModal();
        await Promise.all([
          loadRecords(),
          loadSummary(),
          fetchProjectsFromBackend(),
          fetchClaimsFromBackend(),
        ]);
      } catch (err) {
        showToast(err.message, true);
      }
    },
  });
}

// Budget Top-Up Management (History, Add, Delete)
function renderBudgetTopupHistory() {
  const container = document.getElementById('budgetTopupHistoryContainer');
  if (!container) return;

  const month =
    state.currentMonth === 'all' ? getCurrentMonthKey() : state.currentMonth;
  const topups =
    state.budgetTopUps && Array.isArray(state.budgetTopUps[month])
      ? state.budgetTopUps[month]
      : [];

  const sym = state.currency || 'RM';
  const isZh = state.lang === 'zh';

  if (topups.length === 0) {
    container.innerHTML = `
      <div class="topup-history-empty" style="text-align: center; padding: 12px 8px; color: var(--text-muted); font-size: 0.8rem;">
        ${isZh ? '本月暂无追加记录' : 'No budget top-ups this month'}
      </div>
    `;
    return;
  }

  container.innerHTML = `
    <div style="font-size: 0.78rem; font-weight: 700; color: var(--text-secondary); margin: 16px 0 8px 0; text-transform: uppercase; letter-spacing: 0.5px;">
      ${isZh ? `本月已追加记录 (${topups.length})` : `Top-Up History (${topups.length})`}
    </div>
    <div class="topup-history-list" style="display: flex; flex-direction: column; gap: 8px; max-height: 180px; overflow-y: auto;">
      ${topups
        .map(
          (item) => `
        <div class="topup-history-item" style="display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; background: var(--bg-surface); border: 1px solid var(--border-card); border-radius: 8px;">
          <div style="display: flex; flex-direction: column; gap: 2px;">
            <strong style="font-size: 0.85rem; color: var(--text-primary); font-weight: 600;">${escapeHtml(item.reason || (isZh ? '临时追加额度' : 'Temporary Top-Up'))}</strong>
            <span style="font-size: 0.72rem; color: var(--text-muted);">${escapeHtml((item.date || '').slice(0, 10))}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-weight: 700; color: #16a34a; font-family: var(--font-mono, monospace); font-size: 0.9rem;">+ ${sym} ${formatNumber(item.amount)}</span>
            <button type="button" class="btn-del-topup" onclick="deleteBudgetTopup('${item.id}')" title="${isZh ? '删除此笔追加' : 'Delete top-up'}" style="background: none; border: none; color: var(--text-muted); cursor: pointer; padding: 4px; display: inline-flex; align-items: center; justify-content: center; border-radius: 6px; transition: all 0.15s ease;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        </div>
      `,
        )
        .join('')}
    </div>
  `;
}

function deleteBudgetTopup(topupId) {
  triggerHaptic(10);
  const month =
    state.currentMonth === 'all' ? getCurrentMonthKey() : state.currentMonth;
  const topups = state.budgetTopUps || {};
  if (!Array.isArray(topups[month])) return;

  const idx = topups[month].findIndex((t) => t.id === topupId);
  if (idx === -1) return;

  const [removed] = topups[month].splice(idx, 1);
  saveBudgetTopUps(topups);
  triggerHaptic(15);
  showToast(
    state.lang === 'zh'
      ? `已删除追加预算 ${state.currency} ${formatNumber(removed.amount)}`
      : `Removed budget top-up of ${state.currency} ${formatNumber(removed.amount)}`,
  );
  renderBudgetTopupHistory();
  renderBudgetTracker();
}

function openTopupBudgetModal() {
  triggerHaptic(10);
  if (!elements.topupBudgetModal) return;
  if (elements.budgetTopupAmountInput)
    elements.budgetTopupAmountInput.value = '300';
  if (elements.budgetTopupReasonInput)
    elements.budgetTopupReasonInput.value = '';
  renderBudgetTopupHistory();
  elements.topupBudgetModal.classList.remove('hidden');
  pushModalHistoryState();
}

function closeTopupBudgetModal() {
  triggerHaptic(10);
  elements.topupBudgetModal?.classList.add('hidden');
  popModalHistoryIfCleared();
}

function saveBudgetTopup() {
  const isZh = state.lang === 'zh';
  const amount = parseFloat(elements.budgetTopupAmountInput?.value) || 0;
  const reason =
    (elements.budgetTopupReasonInput?.value || '').trim() ||
    (isZh ? '临时追加额度' : 'Temporary Top-Up');
  const month =
    state.currentMonth === 'all' ? getCurrentMonthKey() : state.currentMonth;

  if (amount <= 0) {
    return showToast(
      isZh ? '请输入有效的追加金额' : 'Please enter a valid top-up amount',
      true,
    );
  }

  const topups = state.budgetTopUps || {};
  if (!Array.isArray(topups[month])) topups[month] = [];

  topups[month].push({
    id: 'topup_' + Date.now(),
    amount: amount,
    reason: reason,
    date: new Date().toISOString(),
  });

  saveBudgetTopUps(topups);
  triggerHaptic(15);
  closeTopupBudgetModal();
  showToast(
    isZh
      ? `已为本月追加预算 ${state.currency} ${formatNumber(amount)}`
      : `Added ${state.currency} ${formatNumber(amount)} to monthly budget`,
  );
  renderBudgetTracker();
}
