import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Pressable, Linking, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { User, Bell, HelpCircle, Shield, LogOut, ChevronRight, FileText, Calendar } from 'lucide-react-native';
import { theme } from '../../constants/theme';
import { useAppContext } from '../context/AppContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { currentUser, logoutUser, history } = useAppContext();

  const handleSupport = () => {
    router.push('/help');
  };

  const handleNotifications = () => {
    if (Platform.OS === 'web') {
      window.alert('Notifications are sent to registered mobile numbers upon app updates.');
    } else {
      Alert.alert('Notifications', 'Notifications are sent to registered mobile numbers upon app updates.');
    }
  };

  const handleLogout = () => {
    logoutUser();
    router.replace('/login');
  };

  const name = currentUser?.name || 'Guest User';
  const email = currentUser?.email || 'guest@example.com';
  const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Top Section */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.email}>{email}</Text>
          
          <Pressable style={styles.editButton} onPress={() => router.push('/edit-profile')}>
            <User size={14} color={theme.colors.textPrimary} style={{ marginRight: 6 }} />
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </Pressable>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <FileText size={20} color={theme.colors.primary} style={styles.statIcon} />
            <Text style={styles.statNumber}>{history.length}</Text>
            <Text style={styles.statLabel}>Total Audits</Text>
          </View>
          {/* Removed Savings Card per user request */}
          <View style={styles.statCard}>
            <Calendar size={20} color={theme.colors.secondary} style={styles.statIcon} />
            <Text style={styles.statNumber}>2026</Text>
            <Text style={styles.statLabel}>Member Since</Text>
          </View>
        </View>

        {/* Settings List */}
        <View style={styles.settingsList}>

          <Pressable style={styles.settingsRow} onPress={handleNotifications}>
            <View style={[styles.iconBox, { backgroundColor: theme.colors.tints.primaryAction }]}>
              <Bell size={20} color={theme.colors.primary} />
            </View>
            <Text style={styles.settingsLabel}>Notifications</Text>
            <ChevronRight size={20} color={theme.colors.textSecondary} />
          </Pressable>

          <Pressable style={styles.settingsRow} onPress={handleSupport}>
            <View style={[styles.iconBox, { backgroundColor: theme.colors.tints.electricity }]}>
              <HelpCircle size={20} color={theme.colors.primary} />
            </View>
            <Text style={styles.settingsLabel}>Help & Support</Text>
            <ChevronRight size={20} color={theme.colors.textSecondary} />
          </Pressable>

          <Pressable style={styles.settingsRow} onPress={() => router.push('/privacy')}>
            <View style={[styles.iconBox, { backgroundColor: theme.colors.tints.hotel }]}>
              <Shield size={20} color="#c084fc" />
            </View>
            <Text style={styles.settingsLabel}>Privacy Policy</Text>
            <ChevronRight size={20} color={theme.colors.textSecondary} />
          </Pressable>

          <Pressable style={styles.settingsRow} onPress={handleLogout}>
            <View style={[styles.iconBox, { backgroundColor: theme.colors.tints.restaurant }]}>
              <LogOut size={20} color="#ef4444" />
            </View>
            <Text style={[styles.settingsLabel, { color: '#ef4444' }]}>Log Out</Text>
            <View style={{ width: 20 }} />
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
  content: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xxl,
  },
  profileCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.card,
    padding: theme.spacing.xl,
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  avatarText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
  },
  name: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  email: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: theme.borderRadius.pill,
  },
  editButtonText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textPrimary,
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
    borderWidth: 1,
    borderColor: theme.colors.border,
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
  settingsList: {
    gap: theme.spacing.sm,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.card,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.iconBox,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  settingsLabel: {
    flex: 1,
    fontFamily: theme.typography.fontFamily,
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
});
