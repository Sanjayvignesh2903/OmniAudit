import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Pressable, ScrollView, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, User, Lock, Link, Bell, Moon, Fingerprint, Globe, HelpCircle, Shield, FileText, Star, Smartphone, ChevronRight, LogOut, Trash2 } from 'lucide-react-native';
import { theme } from '../constants/theme';

export default function SettingsScreen() {
  const router = useRouter();

  const [notificationsOn, setNotificationsOn] = useState(true);
  const [darkModeOn, setDarkModeOn] = useState(true);
  const [biometricsOn, setBiometricsOn] = useState(false);

  const renderRow = (icon: any, title: string, rightContent: any, tint: string, isDestructive?: boolean) => {
    const Icon = icon;
    return (
      <Pressable style={styles.settingsRow}>
        <View style={[styles.iconBox, { backgroundColor: tint }]}>
          <Icon size={20} color={isDestructive ? '#ef4444' : theme.colors.textPrimary} />
        </View>
        <Text style={[styles.settingsLabel, isDestructive && { color: '#ef4444' }]}>{title}</Text>
        {rightContent}
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={theme.colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{width: 24}} /> 
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* ACCOUNT */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ACCOUNT</Text>
          <View style={styles.cardGroup}>
            {renderRow(User, 'Edit Profile', <ChevronRight size={20} color={theme.colors.textSecondary} />, theme.colors.tints.history)}
            {renderRow(Lock, 'Change Password', <ChevronRight size={20} color={theme.colors.textSecondary} />, theme.colors.tints.hotel)}
            {renderRow(Link, 'Linked Accounts', <ChevronRight size={20} color={theme.colors.textSecondary} />, theme.colors.tints.rental)}
          </View>
        </View>

        {/* PREFERENCES */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PREFERENCES</Text>
          <View style={styles.cardGroup}>
            {renderRow(Bell, 'Notifications', 
              <Switch value={notificationsOn} onValueChange={setNotificationsOn} trackColor={{ false: theme.colors.border, true: theme.colors.primary }} thumbColor="#ffffff" />, 
              theme.colors.tints.primaryAction
            )}
            {renderRow(Moon, 'Dark Mode', 
              <Switch value={darkModeOn} onValueChange={setDarkModeOn} trackColor={{ false: theme.colors.border, true: theme.colors.primary }} thumbColor="#ffffff" />, 
              theme.colors.tints.upload
            )}
            {renderRow(Fingerprint, 'Biometric Login', 
              <Switch value={biometricsOn} onValueChange={setBiometricsOn} trackColor={{ false: theme.colors.border, true: theme.colors.primary }} thumbColor="#ffffff" />, 
              theme.colors.tints.electricity
            )}
            {renderRow(Globe, 'Language', 
              <View style={{flexDirection:'row', alignItems:'center'}}>
                <Text style={styles.valueText}>English</Text>
                <ChevronRight size={20} color={theme.colors.textSecondary} style={{marginLeft: 4}} />
              </View>, 
              theme.colors.tints.grocery
            )}
          </View>
        </View>

        {/* ABOUT */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ABOUT</Text>
          <View style={styles.cardGroup}>
            {renderRow(HelpCircle, 'Help & Support', <ChevronRight size={20} color={theme.colors.textSecondary} />, theme.colors.tints.petrol)}
            {renderRow(Shield, 'Privacy Policy', <ChevronRight size={20} color={theme.colors.textSecondary} />, theme.colors.tints.history)}
            {renderRow(FileText, 'Terms of Service', <ChevronRight size={20} color={theme.colors.textSecondary} />, theme.colors.tints.hotel)}
            {renderRow(Star, 'Rate the App', <ChevronRight size={20} color={theme.colors.textSecondary} />, theme.colors.tints.restaurant)}
            {renderRow(Smartphone, 'App Version', <Text style={styles.valueText}>2.1.0</Text>, theme.colors.tints.rental)}
          </View>
        </View>

        {/* DANGER ZONE */}
        <Pressable style={styles.logoutCard} onPress={() => router.replace('/login')}>
          <LogOut size={20} color="#ef4444" style={{marginRight: 12}} />
          <Text style={styles.logoutText}>Log Out</Text>
        </Pressable>

        <Pressable style={styles.deleteAccountButton}>
          <Trash2 size={16} color="#7f1d1d" style={{marginRight: 8}} />
          <Text style={styles.deleteAccountText}>Delete Account</Text>
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
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xxl,
  },
  section: {
    marginBottom: theme.spacing.xl,
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
  cardGroup: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.card,
    overflow: 'hidden',
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: theme.borderRadius.iconBox,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  settingsLabel: {
    flex: 1,
    fontFamily: theme.typography.fontFamily,
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  valueText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  logoutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.card,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  logoutText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 16,
    fontWeight: '700',
    color: '#ef4444',
  },
  deleteAccountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
  },
  deleteAccountText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 14,
    fontWeight: '700',
    color: '#7f1d1d',
  },
});
