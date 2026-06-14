import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Check } from 'lucide-react-native';
import { theme } from '../constants/theme';

export default function SubscriptionScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={theme.colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Choose Plan</Text>
        <View style={{width: 24}} /> 
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* FREE CARD */}
        <View style={styles.freeCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.freeLabel}>Free</Text>
            <Text style={styles.freePrice}>₹0 / month</Text>
          </View>
          <View style={styles.featuresList}>
            {[
              '5 scans/month',
              'Basic audit report',
              'Email support'
            ].map((feat, idx) => (
              <View key={idx} style={styles.featureRow}>
                <Check size={16} color={theme.colors.textSecondary} />
                <Text style={styles.featureText}>{feat}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* PRO CARD */}
        <View style={styles.proCard}>
          <View style={styles.proBadge}>
            <Text style={styles.proBadgeText}>Most Popular</Text>
          </View>
          <View style={styles.cardHeader}>
            <Text style={styles.proLabel}>Pro</Text>
            <Text style={styles.proPrice}>₹299 / month</Text>
          </View>
          <View style={styles.featuresList}>
            {[
              'Unlimited scans',
              'Full AI audit',
              'Dispute letters',
              'Priority support',
              'Export PDF'
            ].map((feat, idx) => (
              <View key={idx} style={styles.featureRow}>
                <Check size={16} color={theme.colors.primary} />
                <Text style={styles.featureText}>{feat}</Text>
              </View>
            ))}
          </View>
        </View>

        <Pressable style={styles.upgradeButton} onPress={() => router.back()}>
          <Text style={styles.upgradeButtonText}>Upgrade to Pro</Text>
        </Pressable>

        <Pressable style={styles.continueButton} onPress={() => router.back()}>
          <Text style={styles.continueButtonText}>Continue with Free</Text>
        </Pressable>

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
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  cardHeader: {
    marginBottom: theme.spacing.lg,
  },
  featuresList: {
    gap: theme.spacing.md,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  featureText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 15,
    color: theme.colors.textPrimary,
  },
  freeCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
  },
  freeLabel: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  freePrice: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  proCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.card,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
    position: 'relative',
  },
  proBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.pill,
  },
  proBadgeText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 12,
    fontWeight: '700',
    color: '#000',
  },
  proLabel: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.primary,
    marginBottom: 4,
  },
  proPrice: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 16,
    color: theme.colors.textPrimary,
  },
  upgradeButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.pill,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  upgradeButtonText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  continueButton: {
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 15,
    color: theme.colors.textSecondary,
  },
});
