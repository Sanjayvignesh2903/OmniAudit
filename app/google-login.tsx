import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, ActivityIndicator, Platform, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { User, AlertCircle } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';
import { theme } from '../constants/theme';

export default function GoogleLoginScreen() {
  const router = useRouter();
  const [customEmail, setCustomEmail] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);

  const handleSelectAccount = (email: string) => {
    setIsLoading(true);
    setSelectedEmail(email);
    setErrorText(null);

    // Simulate authenticating...
    setTimeout(() => {
      if (Platform.OS === 'web' && window.opener) {
        window.opener.postMessage({
          type: 'GOOGLE_LOGIN_SUCCESS',
          email: email
        }, window.location.origin);
        window.close();
      } else {
        // Fallback for mobile environment if opened inside the app
        setIsLoading(false);
        setErrorText("Running in mobile environment: Popup redirection completed.");
      }
    }, 1200);
  };

  const handleCustomSubmit = () => {
    if (!customEmail.trim()) {
      setErrorText('Please enter your email address.');
      return;
    }
    if (!customEmail.includes('@')) {
      setErrorText('Please enter a valid email address.');
      return;
    }
    handleSelectAccount(customEmail.trim());
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        {/* Google Multicolored Logo */}
        <View style={styles.logoContainer}>
          <Svg width="40" height="40" viewBox="0 0 24 24">
            <Path
              fill="#EA4335"
              d="M12 5.04c1.64 0 3.12.56 4.28 1.67l3.2-3.2C17.52 1.58 14.96 1 12 1 7.35 1 3.39 3.67 1.5 7.56l3.78 2.93c.89-2.67 3.39-4.45 6.72-4.45z"
            />
            <Path
              fill="#4285F4"
              d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.43c-.28 1.44-1.09 2.67-2.33 3.51l3.61 2.8c2.12-1.95 3.78-4.83 3.78-8.46z"
            />
            <Path
              fill="#FBBC05"
              d="M5.28 14.77c-.23-.67-.36-1.39-.36-2.13s.13-1.46.36-2.13L1.5 7.58C.54 9.48 0 11.64 0 13s.54 3.52 1.5 5.42l3.78-2.65z"
            />
            <Path
              fill="#34A853"
              d="M12 23c3.24 0 5.97-1.09 7.96-2.95l-3.61-2.8c-1.01.67-2.3 1.09-4.35 1.09-3.33 0-5.83-1.78-6.72-4.45L1.5 16.82C3.39 20.71 7.35 23 12 23z"
            />
          </Svg>
        </View>

        <Text style={styles.title}>Sign in with Google</Text>
        <Text style={styles.subtitle}>to continue to OmniAudit</Text>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4285F4" />
            <Text style={styles.loadingText}>Connecting to {selectedEmail}...</Text>
          </View>
        ) : (
          <View style={styles.content}>
            {errorText && (
              <View style={styles.errorBanner}>
                <AlertCircle size={16} color="#EA4335" style={{ marginRight: 8 }} />
                <Text style={styles.errorText}>{errorText}</Text>
              </View>
            )}

            {!showCustomInput ? (
              <View style={styles.accountList}>
                {/* Simulated Saved Account */}
                <Pressable
                  style={styles.accountItem}
                  onPress={() => handleSelectAccount('sanjayvignesh11a2@gmail.com')}
                >
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>S</Text>
                  </View>
                  <View style={styles.accountInfo}>
                    <Text style={styles.accountName}>Sanjay Vignesh</Text>
                    <Text style={styles.accountEmail}>sanjayvignesh11a2@gmail.com</Text>
                  </View>
                </Pressable>

                {/* Use Another Account */}
                <Pressable
                  style={[styles.accountItem, styles.useAnotherBtn]}
                  onPress={() => setShowCustomInput(true)}
                >
                  <View style={[styles.avatar, styles.customAvatar]}>
                    <User size={18} color="#5f6368" />
                  </View>
                  <Text style={styles.useAnotherText}>Use another account</Text>
                </Pressable>
              </View>
            ) : (
              <View style={styles.customInputForm}>
                <Text style={styles.inputLabel}>Email or phone</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your email"
                  placeholderTextColor="#9ca3af"
                  value={customEmail}
                  onChangeText={setCustomEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoFocus
                />
                
                <View style={styles.buttonRow}>
                  <Pressable
                    style={styles.backBtn}
                    onPress={() => {
                      setShowCustomInput(false);
                      setErrorText(null);
                    }}
                  >
                    <Text style={styles.backBtnText}>Back</Text>
                  </Pressable>
                  
                  <Pressable
                    style={styles.nextBtn}
                    onPress={handleCustomSubmit}
                  >
                    <Text style={styles.nextBtnText}>Next</Text>
                  </Pressable>
                </View>
              </View>
            )}
          </View>
        )}

        <Text style={styles.disclaimer}>
          To continue, Google will share your name, email address, language preference, and profile picture with OmniAudit. Before using this app, you can review its privacy policy and terms of service.
        </Text>

        <View style={styles.footer}>
          <Text style={styles.footerLink}>Help</Text>
          <Text style={styles.footerLink}>Privacy</Text>
          <Text style={styles.footerLink}>Terms</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f3f4',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 450,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dadce0',
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  logoContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '400',
    color: '#202124',
    fontFamily: 'System',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#5f6368',
    fontFamily: 'System',
    textAlign: 'center',
    marginBottom: 32,
  },
  content: {
    width: '100%',
    marginBottom: 24,
  },
  loadingContainer: {
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: '#5f6368',
    fontFamily: 'System',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fdf2f2',
    borderWidth: 1,
    borderColor: '#fde8e8',
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
    width: '100%',
  },
  errorText: {
    flex: 1,
    fontSize: 12,
    color: '#c81e1e',
    fontFamily: 'System',
  },
  accountList: {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#dadce0',
  },
  accountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#dadce0',
    width: '100%',
  },
  useAnotherBtn: {
    borderBottomWidth: 0,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3f51b5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  customAvatar: {
    backgroundColor: '#f1f3f4',
    borderWidth: 1,
    borderColor: '#dadce0',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'System',
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3c4043',
    fontFamily: 'System',
  },
  accountEmail: {
    fontSize: 12,
    color: '#5f6368',
    fontFamily: 'System',
    marginTop: 2,
  },
  useAnotherText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a73e8',
    fontFamily: 'System',
  },
  customInputForm: {
    width: '100%',
  },
  inputLabel: {
    fontSize: 16,
    color: '#202124',
    fontFamily: 'System',
    marginBottom: 8,
  },
  textInput: {
    width: '100%',
    height: 52,
    borderWidth: 1,
    borderColor: '#1a73e8',
    borderRadius: 4,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#202124',
    fontFamily: 'System',
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  backBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  backBtnText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a73e8',
    fontFamily: 'System',
  },
  nextBtn: {
    backgroundColor: '#1a73e8',
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  nextBtnText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
    fontFamily: 'System',
  },
  disclaimer: {
    fontSize: 11,
    color: '#5f6368',
    lineHeight: 16,
    fontFamily: 'System',
    textAlign: 'left',
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f3f4',
    paddingTop: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 24,
    width: '100%',
  },
  footerLink: {
    fontSize: 12,
    color: '#5f6368',
    fontFamily: 'System',
  },
});
