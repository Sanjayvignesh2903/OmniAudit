import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, SafeAreaView, Platform, Share } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { ArrowLeft, Check, AlertTriangle, X } from 'lucide-react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { theme } from '../constants/theme';
import { AuditResponse } from '../utils/api';

export default function ResultsScreen() {
  const router = useRouter();
  const { result } = useLocalSearchParams<{ result: string }>();
  
  const parsedResult: any = result ? JSON.parse(result as string) : null;

  if (!parsedResult) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{color: theme.colors.textPrimary, fontFamily: theme.typography.fontFamily}}>Loading results...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const verdict = parsedResult?.verdict || 'review';
  const savings = parsedResult?.savings || 0;
  const findings = parsedResult?.findings || [];
  const recommendation = parsedResult?.recommendation || '';
  const message = parsedResult?.message || recommendation || 'An error occurred during analysis.';
  const allDetails = parsedResult?.all_details || [];

  if (verdict === 'error') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => router.replace('/(tabs)')} style={styles.backButton}>
            <ArrowLeft size={24} color={theme.colors.textPrimary} />
          </Pressable>
          <Text style={styles.headerTitle}>Audit Failed</Text>
          <View style={{width: 24}} /> 
        </View>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: theme.spacing.xl}}>
          <X size={64} color="#ef4444" style={{marginBottom: theme.spacing.md}} />
          <Text style={{fontFamily: theme.typography.fontFamily, fontSize: 20, fontWeight: '800', color: theme.colors.textPrimary, marginBottom: 8}}>Error</Text>
          <Text style={{fontFamily: theme.typography.fontFamily, fontSize: 16, color: theme.colors.textSecondary, textAlign: 'center'}}>{message}</Text>
          <Pressable style={[styles.primaryButton, {marginTop: theme.spacing.xl, width: '100%'}]} onPress={() => router.replace('/(tabs)')}>
            <Text style={styles.primaryButtonText}>Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const getVerdictStyles = () => {
    switch (verdict) {
      case 'overcharged': return { border: '#ef4444', text: '#ef4444', bg: '#fef2f2', subtitle: `₹${savings} in excess charges found` };
      case 'fair': return { border: '#10b981', text: '#10b981', bg: '#ecfdf5', subtitle: 'No issues found' };
      case 'review': return { border: '#f59e0b', text: '#f59e0b', bg: '#fffbeb', subtitle: 'Items need your attention' };
      default: return { border: '#10b981', text: '#10b981', bg: '#ecfdf5', subtitle: '' };
    }
  };

  const vStyles = getVerdictStyles();

  const getFindingIcon = (status: string) => {
    switch (status) {
      case 'ok': return <Check size={18} color="#10b981" />;
      case 'warn': return <AlertTriangle size={18} color="#f59e0b" />;
      case 'error': return <X size={18} color="#ef4444" />;
      default: return null;
    }
  };

  const handleDownloadReport = async () => {
    const isOvercharged = verdict === 'overcharged';
    
    const detailsHtml = allDetails.map((detail: any) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #4b5563; font-family: 'Helvetica Neue', Helvetica, sans-serif;">${detail.label}</td>
        <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; color: #111827; text-align: right; font-family: 'Courier New', Courier, monospace; font-weight: bold;">${detail.value}</td>
      </tr>
    `).join('');

    const findingsHtml = findings.length > 0 ? findings.map((f: any) => `
      <div style="margin-bottom: 10px; padding: 10px 15px; border-left: 4px solid ${f.status === 'error' || f.status === 'warn' ? '#dc2626' : '#16a34a'}; background-color: ${f.status === 'error' || f.status === 'warn' ? '#fef2f2' : '#f0fdf4'}; font-family: 'Helvetica Neue', Helvetica, sans-serif;">
        <p style="margin: 0; color: #1f2937; font-size: 14px;">
          <strong>${f.status.toUpperCase()}:</strong> ${f.label}
          ${f.delta ? `<span style="color: #dc2626; font-weight: bold; margin-left: 8px;">(${f.delta})</span>` : ''}
        </p>
      </div>
    `).join('') : '<p style="color: #6b7280; font-style: italic;">No specific anomalies detected.</p>';

    const htmlContent = `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&display=swap');
            body { font-family: 'Georgia', serif; padding: 50px; color: #111827; background-color: #fff; line-height: 1.6; }
            .report-container { max-width: 800px; margin: 0 auto; border: 1px solid #e5e7eb; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
            .header { text-align: center; margin-bottom: 50px; border-bottom: 2px solid #111827; padding-bottom: 20px; }
            h1 { font-family: 'Playfair Display', serif; font-size: 36px; margin: 0 0 10px 0; letter-spacing: 1px; color: #111827; text-transform: uppercase; }
            .subtitle { color: #6b7280; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; }
            
            .verdict-box { margin-bottom: 40px; padding: 30px; text-align: center; border: 2px solid ${isOvercharged ? '#dc2626' : '#16a34a'}; background-color: ${isOvercharged ? '#fef2f2' : '#f0fdf4'}; }
            .verdict-title { font-size: 14px; text-transform: uppercase; letter-spacing: 2px; color: ${isOvercharged ? '#991b1b' : '#166534'}; margin-bottom: 10px; font-weight: bold; }
            .verdict-result { font-family: 'Playfair Display', serif; font-size: 32px; font-weight: bold; color: ${isOvercharged ? '#dc2626' : '#16a34a'}; margin: 0; }
            .discrepancy { font-size: 20px; color: #dc2626; font-weight: bold; margin-top: 15px; background: #fee2e2; display: inline-block; padding: 8px 16px; border-radius: 4px;}
            
            h2 { font-family: 'Playfair Display', serif; font-size: 20px; color: #111827; border-bottom: 1px solid #d1d5db; padding-bottom: 8px; margin-top: 40px; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 1px; }
            
            .summary-text { font-style: italic; color: #374151; padding: 20px; background-color: #f9fafb; border-left: 4px solid #9ca3af; }
            
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            
            .footer { text-align: center; margin-top: 60px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #9ca3af; font-size: 12px; font-family: 'Helvetica Neue', Helvetica, sans-serif; text-transform: uppercase; letter-spacing: 1px; }
          </style>
        </head>
        <body>
          <div class="report-container">
            <div class="header">
              <div style="margin-bottom: 15px;">
                <svg width="60" height="60" viewBox="0 0 160 160" style="margin: 0 auto; display: block;">
                  <path 
                    d="M 80 30 L 123.3 55 L 123.3 105 L 80 130 L 36.7 105 L 36.7 55 Z" 
                    stroke="#6366f1" 
                    stroke-width="10" 
                    fill="none" 
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path 
                    d="M 58 80 L 73 95 L 102 66" 
                    stroke="#6366f1" 
                    stroke-width="10" 
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
              <h1>OmniAudit</h1>
              <div class="subtitle">Official Automated Audit Report</div>
              <div style="margin-top: 10px; font-size: 12px; color: #9ca3af; font-family: 'Helvetica Neue', sans-serif;">Generated on ${new Date().toLocaleDateString()}</div>
            </div>

            <div class="verdict-box">
              <div class="verdict-title">Final Verdict</div>
              <p class="verdict-result">${verdict.toUpperCase()}</p>
              ${isOvercharged ? `<div class="discrepancy">AMOUNT OVERCHARGED: ₹${savings}</div>` : `<div style="margin-top: 10px; color: #166534; font-weight: bold;">No excess charges detected.</div>`}
            </div>

            <h2>Executive Summary</h2>
            <div class="summary-text">
              ${recommendation || message || 'Analysis complete and data successfully extracted.'}
            </div>

            <h2>Financial Extraction</h2>
            <table>
              ${detailsHtml}
            </table>

            <h2>Line-Item Analysis</h2>
            ${findingsHtml}
            
            <div class="footer">
              End of Report • Certified by OmniAudit AI Engine
            </div>
          </div>
        </body>
      </html>
    `;

    try {
      if (Platform.OS === 'web') {
        await Print.printAsync({ html: htmlContent });
      } else {
        const { uri } = await Print.printToFileAsync({ html: htmlContent });
        await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
      }
    } catch (e) {
      console.error("PDF generation failed:", e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.replace('/(tabs)')} style={styles.backButton}>
          <ArrowLeft size={24} color={theme.colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Audit Results</Text>
        <View style={{width: 24}} /> 
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Top Card */}
        <Animated.View entering={FadeInUp.delay(0).springify()} style={[styles.card, { borderTopWidth: 4, borderTopColor: vStyles.border, alignItems: 'center', justifyContent: 'center', paddingVertical: theme.spacing.xl }]}>
          <View style={{ alignItems: 'center', marginBottom: 12 }}>
            <View style={[styles.verdictBadge, { backgroundColor: vStyles.bg, paddingHorizontal: 20, paddingVertical: 10, borderWidth: 1, borderColor: `${vStyles.text}30` }]}>
              <Text style={[styles.verdictBadgeText, { color: vStyles.text, fontSize: 22, fontWeight: '900', letterSpacing: 1 }]}>
                {verdict.charAt(0).toUpperCase() + verdict.slice(1)}
              </Text>
            </View>
          </View>
          <Text style={[styles.verdictSubtitle, { color: verdict === 'fair' ? theme.colors.textSecondary : vStyles.text, fontSize: 18, fontWeight: '800', textAlign: 'center' }]}>
            {vStyles.subtitle}
          </Text>
        </Animated.View>

        {/* Parsed Details */}
        <Animated.View entering={FadeInUp.delay(100).springify()} style={styles.card}>
          <Text style={styles.cardTitle}>FULL BILL DETAILS</Text>
          <View style={styles.parsedDetailsContainer}>
            {allDetails.map((row: any, index: number, arr: any[]) => (
              <View key={row.label} style={[styles.parsedRow, index === arr.length - 1 && styles.parsedRowLast]}>
                <Text style={styles.parsedLabel}>{row.label}</Text>
                <Text style={styles.parsedValue}>{row.value}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Findings */}
        <Animated.View entering={FadeInUp.delay(200).springify()}>
          <Text style={styles.sectionTitle}>AUDIT FINDINGS</Text>
          <View style={styles.findingsList}>
            {findings.length > 0 ? (
              findings.map((finding: any, idx: number) => (
                <View key={idx} style={styles.findingRow}>
                  <View style={styles.findingIconWrapper}>
                    {getFindingIcon(finding.status)}
                  </View>
                  <Text style={styles.findingLabel}>{finding.label}</Text>
                  {finding.delta && (
                    <Text style={[styles.findingDelta, { color: '#ef4444' }]}>{finding.delta}</Text>
                  )}
                </View>
              ))
            ) : (
              <Text style={{fontFamily: theme.typography.fontFamily, color: theme.colors.textSecondary, paddingHorizontal: theme.spacing.xs}}>
                No specific line-item anomalies detected.
              </Text>
            )}
          </View>
        </Animated.View>

        {/* AI Analysis Summary (Always visible now) */}
        <Animated.View entering={FadeInUp.delay(300).springify()} style={[styles.card, { borderColor: vStyles.border, borderWidth: 1 }]}>
          <Text style={[styles.cardTitle, { color: vStyles.text }]}>AI ANALYSIS SUMMARY</Text>
          <Text style={styles.recommendationText}>{recommendation || message || 'Analysis complete.'}</Text>
        </Animated.View>

        <View style={styles.footerActions}>
          <Pressable style={styles.primaryButton} onPress={() => router.replace('/(tabs)')}>
            <Text style={styles.primaryButtonText}>Done</Text>
          </Pressable>

          <Pressable style={styles.outlinedButton} onPress={handleDownloadReport}>
            <Text style={styles.outlinedButtonText}>Download Full Report</Text>
          </Pressable>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  backButton: {
    padding: theme.spacing.xs,
  },
  headerTitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  scrollContent: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.card,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  verdictBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.pill,
  },
  verdictBadgeText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 14,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  verdictSubtitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 16,
    fontWeight: '600',
  },
  cardTitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.textSecondary,
    letterSpacing: 1.2,
    marginBottom: theme.spacing.md,
  },
  parsedDetailsContainer: {
  },
  parsedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  parsedRowLast: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  parsedLabel: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 15,
    color: theme.colors.textSecondary,
  },
  parsedValue: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 15,
    color: theme.colors.textPrimary,
  },
  parsedValueBold: {
    fontWeight: '800',
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 12,
    fontWeight: '800',
    color: theme.colors.textSecondary,
    letterSpacing: 1.2,
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.xs,
  },
  findingsList: {
    marginBottom: theme.spacing.xl,
  },
  findingRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
  },
  findingIconWrapper: {
    marginTop: 2,
  },
  findingLabel: {
    flex: 1,
    fontFamily: theme.typography.fontFamily,
    fontSize: 15,
    color: theme.colors.textPrimary,
    lineHeight: 22,
  },
  findingDelta: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 15,
    fontWeight: '800',
  },
  recommendationText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 15,
    color: theme.colors.textPrimary,
    lineHeight: 22,
  },
  footerActions: {
    gap: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.pill,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  outlinedButton: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.pill,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  outlinedButtonText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
});
