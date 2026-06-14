import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, CheckCircle2, FileText, Banknote } from 'lucide-react-native';
import { theme } from '../constants/theme';

export default function SavingsScreen() {
  const router = useRouter();

  const mockChartData = [
    { month: 'Jun', value: '4k', height: 40 },
    { month: 'Jul', value: '6k', height: 60 },
    { month: 'Aug', value: '3k', height: 30 },
    { month: 'Sep', value: '8k', height: 80 },
    { month: 'Oct', value: '12k', height: 120, current: true },
  ];

  const categoryProgress = [
    { name: 'Housing', amount: '₹8,000', percent: '65%', color: theme.colors.tints.rental },
    { name: 'Travel', amount: '₹2,500', percent: '20%', color: theme.colors.tints.hotel },
    { name: 'Retail', amount: '₹1,500', percent: '15%', color: theme.colors.tints.grocery },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={theme.colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Savings Tracker</Text>
        <View style={{width: 24}} /> 
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <CheckCircle2 size={20} color={theme.colors.primary} style={styles.statIcon} />
            <Text style={styles.statNumber}>₹12k</Text>
            <Text style={styles.statLabel}>Total Saved</Text>
          </View>
          <View style={styles.statCard}>
            <FileText size={20} color="#3b82f6" style={styles.statIcon} />
            <Text style={styles.statNumber}>142</Text>
            <Text style={styles.statLabel}>Bills Audited</Text>
          </View>
          <View style={styles.statCard}>
            <Banknote size={20} color="#f59e0b" style={styles.statIcon} />
            <Text style={styles.statNumber}>₹8k</Text>
            <Text style={styles.statLabel}>Recovered</Text>
          </View>
        </View>

        {/* Bar Chart Card */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Monthly Savings</Text>
          <View style={styles.chartArea}>
            {mockChartData.map((data, index) => (
              <View key={index} style={styles.barCol}>
                <Text style={styles.barValue}>{data.value}</Text>
                <View style={[
                  styles.bar, 
                  { height: data.height },
                  data.current && styles.barCurrent
                ]} />
                <Text style={styles.barLabel}>{data.month}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* By Category */}
        <View style={styles.categorySection}>
          <Text style={styles.sectionTitle}>BY CATEGORY</Text>
          
          <View style={styles.categoryCard}>
            {categoryProgress.map((item, index) => (
              <View key={index} style={styles.progressRow}>
                <View style={styles.progressHeader}>
                  <View style={styles.progressHeaderLeft}>
                    <View style={[styles.dot, { backgroundColor: item.color }]} />
                    <Text style={styles.categoryName}>{item.name}</Text>
                  </View>
                  <Text style={styles.categoryAmount}>{item.amount}</Text>
                </View>
                <View style={styles.progressBarTrack}>
                  <View style={[styles.progressBarFill, { backgroundColor: item.color, width: item.percent as any }]} />
                </View>
              </View>
            ))}
          </View>
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
  content: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing.xl,
    gap: theme.spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.card,
    padding: theme.spacing.md,
  },
  statIcon: {
    marginBottom: theme.spacing.sm,
  },
  statNumber: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  statLabel: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 11,
    color: theme.colors.textSecondary,
  },
  chartCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.card,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  chartTitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xl,
  },
  chartArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 160,
  },
  barCol: {
    alignItems: 'center',
  },
  barValue: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 12,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  bar: {
    width: 32,
    backgroundColor: '#064e3b', // darker emerald
    borderRadius: 4,
  },
  barCurrent: {
    backgroundColor: theme.colors.primary, // brighter emerald
  },
  barLabel: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
  },
  categorySection: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    letterSpacing: 1,
  },
  categoryCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.card,
    padding: theme.spacing.lg,
    gap: theme.spacing.lg,
  },
  progressRow: {
    // row container
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  progressHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: theme.spacing.sm,
  },
  categoryName: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 14,
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  categoryAmount: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 14,
    color: theme.colors.textPrimary,
    fontWeight: '700',
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: theme.colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
});
