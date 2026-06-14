import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, ShieldCheck } from 'lucide-react-native';
import { theme } from '../constants/theme';

export default function PrivacyPolicyScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={theme.colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={{width: 24}} /> 
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        <View style={styles.iconContainer}>
          <ShieldCheck size={64} color={theme.colors.primary} strokeWidth={1.5} />
        </View>

        <Text style={styles.title}>OmniAudit Privacy & Ownership</Text>
        <Text style={styles.lastUpdated}>Last Updated: October 2026</Text>

        <View style={styles.card}>
          <Text style={styles.heading}>1. Application Ownership</Text>
          <Text style={styles.paragraph}>
            This application belongs to the creator and is not owned by any other person. All rights, intellectual property, and code are the sole property of the original developer.
          </Text>

          <Text style={styles.heading}>2. Data Privacy</Text>
          <Text style={styles.paragraph}>
            We respect your privacy. Any bills, receipts, or documents you scan using OmniAudit are processed securely. We do not sell your personal data or audit history to third-party marketers.
          </Text>

          <Text style={styles.heading}>3. Local Processing</Text>
          <Text style={styles.paragraph}>
            Whenever possible, audits are processed locally or securely transmitted over encrypted channels. We do not retain copies of your personal financial documents beyond what is required to generate your audit report and maintain your history log.
          </Text>

          <Text style={styles.heading}>4. Notifications & Communications</Text>
          <Text style={styles.paragraph}>
            Notifications regarding application updates or security alerts may be sent to the registered mobile numbers of our users. By creating an account, you consent to receive these essential service updates.
          </Text>

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
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  title: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  lastUpdated: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.card,
    padding: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  heading: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  paragraph: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 15,
    lineHeight: 24,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
});
