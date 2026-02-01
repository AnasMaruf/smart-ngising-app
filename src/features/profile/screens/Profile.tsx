import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import * as Print from "expo-print";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Platform } from "react-native";

import type { StatsData } from "@/features/statistics/api";
import { useStatsQuery } from "@/features/statistics/api";
import {
  buildHistoryEntries,
  formatFrequencyLabel,
  formatRecordDate,
  formatRecordTime,
} from "@/features/statistics/utils";

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [remindersEnabled, setRemindersEnabled] = React.useState(true);
  const [isExporting, setIsExporting] = React.useState(false);
  const displayName = user?.fullName ?? "John Doe";
  const email = user?.email ?? "john@example.com";
  const statsRange = "30";
  const statsRangeLabel = "Last 30 Days";
  const {
    data: statsResponse,
    refetch: refetchStats,
    isError: isStatsError,
    error: statsError,
  } = useStatsQuery(statsRange);
  const stats = statsResponse?.data;

  const ensureStatsData = React.useCallback(async () => {
    if (stats) return stats;
    const response = await refetchStats();
    return response.data?.data ?? null;
  }, [refetchStats, stats]);

  const handleExportReport = React.useCallback(async () => {
    if (isExporting) return;
    try {
      setIsExporting(true);
      const resolvedStats = await ensureStatsData();

      if (!resolvedStats) {
        throw new Error("Statistik belum tersedia. Coba lagi setelah membuat beberapa catatan.");
      }

      const html = createReportHtml({
        stats: resolvedStats,
        name: displayName,
        email,
        rangeLabel: statsRangeLabel,
      });

      if (Platform.OS === "web") {
        const popup = window.open("", "_blank");
        if (!popup) throw new Error("Browser menolak membuka jendela untuk report.");
        popup.document.write(html);
        popup.document.close();
        popup.focus();
        popup.print();
        return;
      }

      const { uri } = await Print.printToFileAsync({ html });
      const targetDir = FileSystem.documentDirectory ?? FileSystem.cacheDirectory ?? "";
      const fileName = `health-report-${Date.now()}.pdf`;
      const targetPath = `${targetDir}${fileName}`;
      await FileSystem.copyAsync({ from: uri, to: targetPath });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(targetPath, {
          mimeType: "application/pdf",
          dialogTitle: "Bagikan Health Report",
          UTI: "com.adobe.pdf",
        });
      }

      Alert.alert(
        "Report siap",
        `File berhasil disimpan di direktori aplikasi:\n${targetPath}\nSilakan bagikan atau pindahkan sesuai kebutuhan.`
      );
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Gagal mengekspor report. Silakan coba lagi.";
      Alert.alert("Export gagal", message);
    } finally {
      setIsExporting(false);
    }
  }, [displayName, email, ensureStatsData, isExporting, statsRangeLabel]);

  return (
    <SafeAreaView className="flex-1 bg-[#f1f4ff]">
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6">
          <Text className="text-3xl font-semibold text-[#1a1f36]">Profile</Text>
          <Text className="mt-1 text-base text-[#8d95af]">
            Manage your account settings
          </Text>

          <View
            style={styles.cardShadow}
            className="mt-6 rounded-[30px] bg-white p-5"
          >
            <View className="flex-row items-center gap-4">
              <View className="h-14 w-14 items-center justify-center rounded-full bg-[#e1ebff]">
                <Ionicons name="person-outline" size={30} color="#0c64ff" />
              </View>
              <View className="flex-1">
                <Text className="text-xl font-semibold text-[#1a1f36]">
                  {displayName}
                </Text>
                <Text className="mt-1 text-sm text-[#8d95af]">{email}</Text>
                <Text className="mt-1 text-xs font-semibold text-[#0c64ff]">
                  Member since Jan 2026
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color="#c0c6de" />
            </View>
          </View>

          <View
            style={styles.cardShadow}
            className="mt-4 rounded-[30px] bg-white p-5"
          >
            <View className="flex-row items-start gap-3">
              <View className="h-12 w-12 items-center justify-center rounded-2xl bg-[#eef3ff]">
                <Ionicons name="document-text-outline" size={24} color="#0c64ff" />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-semibold text-[#1a1f36]">
                  Health Report
                </Text>
                <Text className="mt-1 text-sm text-[#6c7280]">
                  Export your health data for doctor consultation
                </Text>
              </View>
            </View>
            <Pressable
              onPress={handleExportReport}
              disabled={isExporting}
              accessibilityState={{ busy: isExporting, disabled: isExporting }}
              className={`mt-4 w-full items-center rounded-[18px] bg-[#0c64ff] py-3 ${
                isExporting ? "opacity-70" : ""
              }`}
            >
              {isExporting ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <View className="flex-row items-center gap-2">
                  <Ionicons name="download-outline" size={18} color="#ffffff" />
                  <Text className="text-sm font-semibold text-white">
                    Export Report (PDF)
                  </Text>
                </View>
              )}
            </Pressable>
            {isStatsError && (
              <Text className="mt-2 text-xs text-[#ef4444]">
                {statsError instanceof Error
                  ? statsError.message
                  : "Gagal memuat statistik."}
              </Text>
            )}
          </View>

          <View
            style={styles.cardShadow}
            className="mt-4 rounded-[30px] bg-white"
          >
            <View className="border-b border-[#eef2ff] px-5 py-4">
              <Text className="text-base font-semibold text-[#1a1f36]">
                Settings
              </Text>
            </View>
            <View className="flex-row items-center justify-between px-5 py-4">
              <View className="flex-row items-start gap-3">
                <View className="h-10 w-10 items-center justify-center rounded-2xl bg-[#eef3ff]">
                  <Ionicons name="notifications-outline" size={20} color="#0c64ff" />
                </View>
                <View>
                  <Text className="text-base font-semibold text-[#1a1f36]">
                    Daily Reminders
                  </Text>
                  <Text className="mt-1 text-sm text-[#6c7280]">
                    Get notified to log your health data
                  </Text>
                </View>
              </View>
              <Switch
                value={remindersEnabled}
                onValueChange={setRemindersEnabled}
                trackColor={{ false: "#d5d9eb", true: "#0c64ff" }}
                thumbColor="#ffffff"
              />
            </View>
          </View>

          <Pressable
            onPress={logout}
            className="mt-6 items-center rounded-[22px] border border-[#ff4d72] py-3"
          >
            <View className="flex-row items-center gap-2">
              <Ionicons name="log-out-outline" size={18} color="#ff4d72" />
              <Text className="text-base font-semibold text-[#ff4d72]">Log Out</Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const REPORT_HISTORY_LIMIT = 15;

type ReportContext = {
  stats: StatsData;
  name: string;
  email: string;
  rangeLabel: string;
};

const createReportHtml = ({ stats, name, email, rangeLabel }: ReportContext) => {
  const generatedAt = new Date().toLocaleString();
  const historyEntries = buildHistoryEntries(stats.history, REPORT_HISTORY_LIMIT);
  const frequencyRows =
    stats.charts.frequency.length > 0
      ? stats.charts.frequency
          .map(
            (point) => `
        <tr>
          <td>${formatFrequencyLabel(point.date)}</td>
          <td>${point.count}</td>
        </tr>`
          )
          .join("")
      : `<tr><td colspan="2">No data</td></tr>`;
  const distributionRows = Object.entries(stats.charts.bristolDistribution)
    .map(
      ([label, count]) => `
      <tr>
        <td>${label}</td>
        <td>${count}</td>
      </tr>`
    )
    .join("");
  const historyRows =
    historyEntries.length > 0
      ? historyEntries
          .map(
            (entry) => `
      <tr>
        <td>${entry.label}</td>
        <td>${entry.bristolScale}</td>
        <td>${entry.volumeLabel}</td>
        <td>${entry.colorLabel}</td>
        <td>${entry.summary}</td>
      </tr>`
          )
          .join("")
      : `<tr><td colspan="5">No history entries for this range.</td></tr>`;
  const issuesSection =
    stats.analysis.recentIssues.length > 0
      ? `<ul>
      ${stats.analysis.recentIssues
        .map(
          (issue) => `
        <li>
          <strong>${formatRecordDate(issue.date)} ${formatRecordTime(issue.date)}</strong> - Score ${
            issue.score
          }<br/>
          ${issue.issues?.length ? issue.issues.join(", ") : "No issues recorded"}
        </li>`
        )
        .join("")}
    </ul>`
      : "<p>No alerts recorded in this period.</p>";

  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <title>Health Report</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; padding: 24px; color: #1f2937; }
        h1 { color: #0c64ff; }
        h2 { margin-top: 28px; color: #111827; }
        table { width: 100%; border-collapse: collapse; margin-top: 12px; }
        th, td { border: 1px solid #e5e7eb; padding: 8px; font-size: 13px; text-align: left; }
        th { background: #f3f4f6; text-transform: uppercase; letter-spacing: 0.04em; font-size: 11px; }
        section { margin-top: 20px; }
        ul { padding-left: 18px; }
        .summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 12px; margin-top: 12px; }
        .summary-card { border: 1px solid #dbeafe; border-radius: 12px; padding: 12px; background: #eff6ff; }
        .summary-card strong { font-size: 24px; display: block; margin-bottom: 4px; color: #0c64ff; }
        .meta { color: #6b7280; font-size: 12px; }
      </style>
    </head>
    <body>
      <header>
        <h1>Smart Ngising - Health Report</h1>
        <p class="meta">Generated for ${name} (${email})</p>
        <p class="meta">Period: ${rangeLabel} • Generated at ${generatedAt}</p>
      </header>

      <section>
        <h2>Summary</h2>
        <div class="summary-grid">
          <div class="summary-card">
            <strong>${stats.summary.totalLogs}</strong>
            <span>Total Logs</span>
          </div>
          <div class="summary-card">
            <strong>${stats.summary.logsThisMonth}</strong>
            <span>Logs This Month</span>
          </div>
          <div class="summary-card">
            <strong>${stats.summary.dayStreak}</strong>
            <span>Day Streak</span>
          </div>
          <div class="summary-card">
            <strong>${stats.summary.healthScore}</strong>
            <span>${stats.summary.healthLabel}</span>
          </div>
        </div>
        <p class="meta">Growth vs last month: ${stats.summary.percentageGrowth}</p>
      </section>

      <section>
        <h2>Bowel Frequency</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            ${frequencyRows}
          </tbody>
        </table>
      </section>

      <section>
        <h2>Bristol Stool Distribution</h2>
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${distributionRows}
          </tbody>
        </table>
      </section>

      <section>
        <h2>Recent Alerts</h2>
        ${issuesSection}
      </section>

      <section>
        <h2>Recent History (Top ${historyEntries.length})</h2>
        <table>
          <thead>
            <tr>
              <th>Date & Time</th>
              <th>Bristol</th>
              <th>Volume</th>
              <th>Color</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            ${historyRows}
          </tbody>
        </table>
      </section>
    </body>
  </html>`;
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 32,
    paddingTop: 8,
  },
  cardShadow: {
    shadowColor: "#b0c4ff",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 18,
    elevation: 3,
  },
});
