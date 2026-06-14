import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, CheckCircle, Lightbulb, AlertTriangle, Info } from 'lucide-react-native';
import { theme } from '../constants/theme';

export default function NotificationsScreen() {
  const router = useRouter();

  const notifications = [
    {
      id: '1',
      type: 'audit_complete',
      title: 'Audit Complete',
      subtitle: 'Your Hotel Grand Stay bill is ready.',
      time: '10m ago',
      unread: true,
      section: 'Today',
    },
    {
      id: '2',
      type: 'overcharge',
      title: 'Overcharge Alert',
      subtitle: 'We found a ₹240 hidden fee on your bill.',
      time: '1h ago',
      unread: true,
      section: 'Today',
    },
    {
      id: '3',
      type: 'savings_tip',
      title: 'Savings Tip',
      subtitle: 'You could save 15% on utilities by...',
      time: 'Yesterday',
      unread: false,
      section: 'Earlier',
    },
    {
      id: '4',
      type: 'system',
      title: 'System Update',
      subtitle: 'OmniAudit v2.1 is now live with new features.',
      time: 'Oct 8',
      unread: false,
      section: 'Earlier',
    },
  ];

  const getIconProps = (type: string) => {
    switch (type) {
      case 'audit_complete': return { Icon: CheckCircle, color: theme.colors.verdict.fair.accent, bg: theme.colors.verdict.fair.bg };
      case 'savings_tip': return { Icon: Lightbulb, color: theme.colors.verdict.review.accent, bg: theme.colors.verdict.review.bg };
      case 'overcharge': return { Icon: AlertTriangle, color: theme.colors.verdict.overcharged.accent, bg: theme.colors.verdict.overcharged.bg };
      case 'system': return { Icon: Info, color: '#3b82f6', bg: '#1e3a8a' };
      default: return { Icon: Info, color: theme.colors.textSecondary, bg: theme.colors.border };
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={theme.colors.textPrimary} />
          </Pressable>
          <Text style={styles.headerTitle}>Notifications</Text>
        </View>
        <Pressable>
          <Text style={styles.markReadText}>Mark all read</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        <Text style={styles.sectionTitle}>TODAY</Text>
        {notifications.filter(n => n.section === 'Today').map(n => {
          const { Icon, color, bg } = getIconProps(n.type);
          return (
            <View key={n.id} style={[styles.notificationCard, n.unread && styles.notificationCardUnread]}>
              <View style={[styles.iconBox, { backgroundColor: bg }]}>
                <Icon size={20} color={color} />
              </View>
              <View style={styles.cardCenter}>
                <Text style={styles.cardTitle}>{n.title}</Text>
                <Text style={styles.cardSubtitle}>{n.subtitle}</Text>
              </View>
              <Text style={styles.cardTime}>{n.time}</Text>
            </View>
          );
        })}

        <View style={{height: 24}} />

        <Text style={styles.sectionTitle}>EARLIER</Text>
        {notifications.filter(n => n.section === 'Earlier').map(n => {
          const { Icon, color, bg } = getIconProps(n.type);
          return (
            <View key={n.id} style={[styles.notificationCard, n.unread && styles.notificationCardUnread]}>
              <View style={[styles.iconBox, { backgroundColor: bg }]}>
                <Icon size={20} color={color} />
              </View>
              <View style={styles.cardCenter}>
                <Text style={styles.cardTitle}>{n.title}</Text>
                <Text style={styles.cardSubtitle}>{n.subtitle}</Text>
              </View>
              <Text style={styles.cardTime}>{n.time}</Text>
            </View>
          );
        })}

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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: theme.spacing.xs,
    marginRight: theme.spacing.sm,
  },
  headerTitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.textPrimary,
  },
  markReadText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  content: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    letterSpacing: 1,
    paddingHorizontal: theme.spacing.xs,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.card,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderLeftWidth: 2,
    borderLeftColor: 'transparent',
  },
  notificationCardUnread: {
    borderLeftColor: theme.colors.primary,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.iconBox,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  cardCenter: {
    flex: 1,
  },
  cardTitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 15,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
  cardTime: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
});
