import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, Pressable, Platform, Alert, ScrollView, KeyboardAvoidingView, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, HelpCircle, Send } from 'lucide-react-native';
import { theme } from '../constants/theme';

export default function HelpScreen() {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = () => {
    if (!message.trim()) {
      if (Platform.OS === 'web') {
        window.alert('Please enter a message before sending.');
      } else {
        Alert.alert('Empty Message', 'Please enter a message before sending.');
      }
      return;
    }

    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      const emailUrl = `mailto:sanjayvignesh11a2@gmail.com?subject=OmniAudit%20Support%20Request&body=${encodeURIComponent(message)}`;
      Linking.openURL(emailUrl).catch(() => {
         if (Platform.OS === 'web') {
           window.alert('Could not open your email client. Please email us directly at sanjayvignesh11a2@gmail.com');
         } else {
           Alert.alert('Error', 'Could not open your email client. Please email us directly at sanjayvignesh11a2@gmail.com');
         }
      });
      setMessage('');
      router.back();
    }, 500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color={theme.colors.textPrimary} />
          </Pressable>
          <Text style={styles.headerTitle}>Help & Support</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.iconContainer}>
            <HelpCircle size={48} color={theme.colors.primary} />
          </View>
          
          <Text style={styles.title}>How can we help?</Text>
          <Text style={styles.subtitle}>Send us a message and our support team will get back to you within 24 hours.</Text>

          <TextInput
            style={styles.textArea}
            placeholder="Describe your issue or question..."
            placeholderTextColor={theme.colors.textSecondary}
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={8}
            textAlignVertical="top"
          />

          <Pressable 
            style={[styles.primaryButton, isSending && { opacity: 0.7 }]} 
            onPress={handleSend}
            disabled={isSending}
          >
            <Send size={20} color="#ffffff" style={{ marginRight: 8 }} />
            <Text style={styles.primaryButtonText}>
              {isSending ? 'Sending...' : 'Send Message'}
            </Text>
          </Pressable>

        </ScrollView>
      </KeyboardAvoidingView>
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
    padding: theme.spacing.xl,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 15,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xxl,
    lineHeight: 22,
  },
  textArea: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily,
    fontSize: 16,
    minHeight: 150,
    marginBottom: theme.spacing.xl,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.pill,
    height: 56,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
});
