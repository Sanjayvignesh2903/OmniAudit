import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, Pressable, ActivityIndicator, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, User, Lock, AlertCircle, CheckCircle } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';
import { theme } from '../constants/theme';
import { useAppContext } from './context/AppContext';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { usersDatabase, resetPassword } = useAppContext();
  
  const [identifier, setIdentifier] = useState('');
  const [idFocus, setIdFocus] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpFocus, setOtpFocus] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordFocus, setNewPasswordFocus] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordFocus, setConfirmPasswordFocus] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [isResetSuccess, setIsResetSuccess] = useState(false);
  const [countdown, setCountdown] = useState(3);

  // Countdown timer for automatic redirect to login screen
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isResetSuccess && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (isResetSuccess && countdown === 0) {
      router.replace('/login');
    }
    return () => clearTimeout(timer);
  }, [isResetSuccess, countdown]);

  const handleSendOtp = () => {
    setErrorText(null);
    if (!identifier.trim()) {
      setErrorText('Please enter your username or email address.');
      return;
    }
    
    // Look up user in the mock database
    const user = Object.values(usersDatabase).find(
      u => u.username.toLowerCase() === identifier.trim().toLowerCase() || 
           u.email.toLowerCase() === identifier.trim().toLowerCase()
    );

    if (!user) {
      setErrorText('Account not found. Please verify the email or username.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
    }, 1200);
  };

  const handleResetPasswordSubmit = () => {
    setErrorText(null);
    if (!otp.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      setErrorText('Please fill in all the required fields.');
      return;
    }

    if (otp.trim() !== '123456') {
      setErrorText('Invalid verification code. For testing, please enter 123456.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorText('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorText('Passwords do not match. Please verify your entries.');
      return;
    }

    // Find user record in database
    const user = Object.values(usersDatabase).find(
      u => u.username.toLowerCase() === identifier.trim().toLowerCase() || 
           u.email.toLowerCase() === identifier.trim().toLowerCase()
    );

    if (user) {
      const success = resetPassword(user.username, newPassword);
      if (success) {
        setIsResetSuccess(true);
      } else {
        setErrorText('Failed to reset password. Please try again.');
      }
    } else {
      setErrorText('User account has expired or could not be found.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={theme.colors.textPrimary} />
        </Pressable>
      </View>

      <View style={styles.content}>
        {/* Pointed Hexagon brand logo */}
        <View style={styles.logoContainer}>
          <Svg width="64" height="64" viewBox="0 0 160 160">
            <Path 
              d="M 80 30 L 123.3 55 L 123.3 105 L 80 130 L 36.7 105 L 36.7 55 Z" 
              stroke={theme.colors.primary} 
              strokeWidth="8" 
              fill="transparent" 
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path 
              d="M 58 80 L 73 95 L 102 66" 
              stroke={theme.colors.primary} 
              strokeWidth="8" 
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </View>

        {isResetSuccess ? (
          <View style={styles.successContainer}>
            <CheckCircle size={56} color="#2ed573" style={{ marginBottom: 16 }} />
            <Text style={styles.title}>Password Reset Success!</Text>
            <Text style={styles.subtitle}>
              Your account password has been updated. You will be redirected to the login screen in {countdown} seconds...
            </Text>
            <Pressable style={styles.primaryButton} onPress={() => router.replace('/login')}>
              <Text style={styles.primaryButtonText}>Return to Login Now</Text>
            </Pressable>
          </View>
        ) : (
          <View style={{ width: '100%' }}>
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>
              {isSent 
                ? "Enter the 6-digit verification code sent to your email and choose a secure new password."
                : "Enter your username or registered email and we will send a 6-digit verification code."}
            </Text>

            {errorText && (
              <View style={styles.errorBanner}>
                <AlertCircle size={18} color="#ff4d4d" style={{ marginRight: 8 }} />
                <Text style={styles.errorText}>{errorText}</Text>
              </View>
            )}

            {!isSent ? (
              <View style={styles.formContainer}>
                <View style={styles.inputGroup}>
                  <View style={[styles.inputContainer, idFocus && styles.inputFocused]}>
                    <User size={20} color={idFocus ? theme.colors.primary : theme.colors.textSecondary} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Username or Email"
                      placeholderTextColor={theme.colors.textSecondary}
                      value={identifier}
                      onChangeText={setIdentifier}
                      onFocus={() => {
                        setIdFocus(true);
                        setErrorText(null);
                      }}
                      onBlur={() => setIdFocus(false)}
                      autoCapitalize="none"
                    />
                  </View>
                </View>

                <Pressable 
                  style={[styles.primaryButton, isLoading && styles.primaryButtonDisabled]} 
                  onPress={handleSendOtp}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#ffffff" />
                  ) : (
                    <Text style={styles.primaryButtonText}>Send Reset Code</Text>
                  )}
                </Pressable>
              </View>
            ) : (
              <View style={styles.formContainer}>
                {/* Simulated Verification notice */}
                <View style={styles.infoBanner}>
                  <Text style={styles.infoText}>
                    Code sent! For testing, use the numeric verification code: <Text style={{ fontWeight: 'bold' }}>123456</Text>
                  </Text>
                </View>

                <View style={styles.inputGroup}>
                  {/* Verification Code */}
                  <View style={[styles.inputContainer, otpFocus && styles.inputFocused, { marginBottom: 16 }]}>
                    <User size={20} color={otpFocus ? theme.colors.primary : theme.colors.textSecondary} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Verification Code (123456)"
                      placeholderTextColor={theme.colors.textSecondary}
                      value={otp}
                      onChangeText={setOtp}
                      onFocus={() => {
                        setOtpFocus(true);
                        setErrorText(null);
                      }}
                      onBlur={() => setOtpFocus(false)}
                      keyboardType="numeric"
                      maxLength={6}
                    />
                  </View>

                  {/* New Password */}
                  <View style={[styles.inputContainer, newPasswordFocus && styles.inputFocused, { marginBottom: 16 }]}>
                    <Lock size={20} color={newPasswordFocus ? theme.colors.primary : theme.colors.textSecondary} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="New Password"
                      placeholderTextColor={theme.colors.textSecondary}
                      value={newPassword}
                      onChangeText={setNewPassword}
                      onFocus={() => {
                        setNewPasswordFocus(true);
                        setErrorText(null);
                      }}
                      onBlur={() => setNewPasswordFocus(false)}
                      secureTextEntry
                    />
                  </View>

                  {/* Confirm Password */}
                  <View style={[styles.inputContainer, confirmPasswordFocus && styles.inputFocused]}>
                    <Lock size={20} color={confirmPasswordFocus ? theme.colors.primary : theme.colors.textSecondary} style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Confirm New Password"
                      placeholderTextColor={theme.colors.textSecondary}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      onFocus={() => {
                        setConfirmPasswordFocus(true);
                        setErrorText(null);
                      }}
                      onBlur={() => setConfirmPasswordFocus(false)}
                      secureTextEntry
                    />
                  </View>
                </View>

                <Pressable 
                  style={[styles.primaryButton, isLoading && styles.primaryButtonDisabled]} 
                  onPress={handleResetPasswordSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#ffffff" />
                  ) : (
                    <Text style={styles.primaryButtonText}>Reset Password</Text>
                  )}
                </Pressable>
              </View>
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    ...Platform.select({
      web: {
        maxWidth: 480,
        width: '100%',
        alignSelf: 'center',
      }
    })
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 28,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: theme.spacing.xxl,
  },
  formContainer: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: theme.spacing.xl,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
    height: 56,
  },
  inputFocused: {
    borderColor: theme.colors.primary,
  },
  inputIcon: {
    marginRight: theme.spacing.sm,
  },
  input: {
    flex: 1,
    fontFamily: theme.typography.fontFamily,
    fontSize: 16,
    color: theme.colors.textPrimary,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.pill,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
    marginTop: 16,
  },
  primaryButtonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
    borderRadius: theme.borderRadius.card,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  errorText: {
    flex: 1,
    fontFamily: theme.typography.fontFamily,
    fontSize: 14,
    color: '#ff4d4d',
    fontWeight: '500',
  },
  infoBanner: {
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.2)',
    borderRadius: theme.borderRadius.card,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  infoText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 14,
    color: theme.colors.primary,
    textAlign: 'center',
    lineHeight: 20,
  },
  successContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: theme.spacing.xl,
  }
});
