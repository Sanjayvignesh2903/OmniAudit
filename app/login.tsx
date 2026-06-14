import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TextInput, 
  Pressable, 
  ActivityIndicator, 
  Alert, 
  Modal,
  Platform 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Hexagon, User, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react-native';
import Svg, { Path } from 'react-native-svg';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withRepeat, 
  withSequence, 
  withSpring,
  FadeInUp,
  FadeOutUp
} from 'react-native-reanimated';
import { theme } from '../constants/theme';
import { useAppContext } from './context/AppContext';

export default function LoginScreen() {
  const router = useRouter();
  const { currentUser, loginUser, loginWithGoogle } = useAppContext();
  
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [idFocus, setIdFocus] = useState(false);
  const [passFocus, setPassFocus] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const isSubmitting = React.useRef(false);

  // Google SSO state
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleEmailFocus, setGoogleEmailFocus] = useState(false);

  // Redirect to dashboard if session exists
  useEffect(() => {
    if (currentUser) {
      router.replace('/(tabs)');
    }
  }, [currentUser]);

  // Google SSO Popup listener
  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleMessage = (e: MessageEvent) => {
        if (e.data?.type === 'GOOGLE_LOGIN_SUCCESS') {
          const email = e.data.email;
          setIsLoading(true);
          setTimeout(() => {
            setIsLoading(false);
            const success = loginWithGoogle(email);
            if (success) {
              router.replace('/(tabs)');
            } else {
              triggerError('Google Login Failed: Unable to authenticate your account.');
            }
          }, 1000);
        }
      };
      window.addEventListener('message', handleMessage);
      return () => window.removeEventListener('message', handleMessage);
    }
  }, []);

  // Animations
  const logoY = useSharedValue(0);
  const buttonScale = useSharedValue(1);

  // Logo floating loop
  useEffect(() => {
    logoY.value = withRepeat(
      withSequence(
        withTiming(-6, { duration: 1800 }),
        withTiming(6, { duration: 1800 })
      ),
      -1,
      true
    );
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: logoY.value }],
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const triggerError = (msg: string) => {
    setErrorText(msg);
    if (Platform.OS !== 'web') {
      Alert.alert('Login Failed', msg.replace('Login Failed: ', ''));
    }
    // Auto clear inline warning banner after a few seconds
    setTimeout(() => {
      setErrorText(null);
    }, 5000);
  };

  const handleLogin = () => {
    if (isSubmitting.current) return;
    
    setErrorText(null);
    if (!identifier.trim() || !password.trim()) {
      triggerError('Missing Fields: Please enter your username/email and password to continue.');
      return;
    }
    
    isSubmitting.current = true;
    setIsLoading(true);
    setTimeout(() => {
      isSubmitting.current = false;
      setIsLoading(false);
      const success = loginUser(identifier.trim(), password.trim());
      
      if (success) {
        router.replace('/(tabs)');
      } else {
        triggerError('Login Failed: Invalid username or password. Please try again or sign up.');
      }
    }, 1000);
  };

  const handleGoogleLoginSubmit = () => {
    if (!googleEmail.trim()) {
      triggerError('Missing Email: Please enter your Google email address.');
      return;
    }
    if (!googleEmail.includes('@')) {
      triggerError('Invalid Email: Please enter a valid email address.');
      return;
    }

    setShowGoogleModal(false);
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      const success = loginWithGoogle(googleEmail.trim());
      setGoogleEmail('');
      if (success) {
        router.replace('/(tabs)');
      } else {
        triggerError('Google Login Failed: Unable to authenticate your account.');
      }
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Background Ambient Glow Orbs */}
      <View style={styles.bgGlow1} />
      <View style={styles.bgGlow2} />

      <View style={styles.content}>
        
        {/* Top: Sliding Error Notification */}
        {errorText && (
          <Animated.View 
            entering={FadeInUp.springify().damping(15)} 
            exiting={FadeOutUp.duration(200)} 
            style={styles.errorBanner}
          >
            <AlertCircle size={20} color="#ff4d4d" style={{ marginRight: 10 }} />
            <Text style={styles.errorText}>{errorText}</Text>
          </Animated.View>
        )}

        {/* Top: Floating Logo */}
        <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
          <View style={styles.logoBadge}>
            <Svg width="50" height="50" viewBox="0 0 160 160">
              <Path 
                d="M 80 30 L 123.3 55 L 123.3 105 L 80 130 L 36.7 105 L 36.7 55 Z" 
                stroke={theme.colors.primary} 
                strokeWidth="10" 
                fill="transparent" 
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path 
                d="M 58 80 L 73 95 L 102 66" 
                stroke={theme.colors.primary} 
                strokeWidth="10" 
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>
          <Text style={styles.logoText}>OmniAudit</Text>
          <Text style={styles.logoSubtext}>Protect your wallet</Text>
        </Animated.View>

        <Text style={styles.welcomeText}>Welcome back</Text>

        {/* Form Container */}
        <View style={styles.inputGroup}>
          
          {/* Identifier Input */}
          <View style={[
            styles.inputContainer, 
            idFocus && styles.inputFocused,
            idFocus && styles.inputFocusedGlow
          ]}>
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

          {/* Password Input */}
          <View style={[
            styles.inputContainer, 
            passFocus && styles.inputFocused,
            passFocus && styles.inputFocusedGlow
          ]}>
            <Lock size={20} color={passFocus ? theme.colors.primary : theme.colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor={theme.colors.textSecondary}
              value={password}
              onChangeText={setPassword}
              onFocus={() => {
                setPassFocus(true);
                setErrorText(null);
              }}
              onBlur={() => setPassFocus(false)}
              secureTextEntry={!showPass}
            />
            <Pressable onPress={() => setShowPass(!showPass)}>
              {showPass ? (
                <EyeOff size={20} color={theme.colors.textSecondary} />
              ) : (
                <Eye size={20} color={theme.colors.textSecondary} />
              )}
            </Pressable>
          </View>

          {/* Forgot Password */}
          <Pressable style={styles.forgotPassword} onPress={() => router.push('/forgot-password')}>
            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
          </Pressable>
        </View>

        {/* Action Button with Spring Compression */}
        <Animated.View style={buttonAnimatedStyle}>
          <Pressable 
            style={[styles.primaryButton, isLoading && styles.primaryButtonDisabled]} 
            onPress={handleLogin}
            disabled={isLoading}
            onPressIn={() => { buttonScale.value = withSpring(0.96); }}
            onPressOut={() => { buttonScale.value = withSpring(1); }}
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.primaryButtonText}>Log In</Text>
            )}
          </Pressable>
        </Animated.View>

        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Google SSO Button */}
        <Pressable 
          style={styles.googleButton}
          onPress={() => {
            setErrorText(null);
            if (Platform.OS === 'web') {
              const width = 500;
              const height = 650;
              const left = (window.screen.width / 2) - (width / 2);
              const top = (window.screen.height / 2) - (height / 2);
              window.open('/google-login', 'GoogleLoginPopup', `width=${width},height=${height},top=${top},left=${left},status=no,toolbar=no,menubar=no`);
            } else {
              setShowGoogleModal(true);
            }
          }}
        >
          <View style={{ marginRight: 8 }}>
            <Svg width="18" height="18" viewBox="0 0 160 160">
              <Path 
                d="M 80 30 L 123.3 55 L 123.3 105 L 80 130 L 36.7 105 L 36.7 55 Z" 
                stroke={theme.colors.textPrimary} 
                strokeWidth="12" 
                fill="transparent" 
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path 
                d="M 58 80 L 73 95 L 102 66" 
                stroke={theme.colors.textPrimary} 
                strokeWidth="12" 
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>
          <Text style={styles.googleButtonText}>Continue with Google</Text>
        </Pressable>

      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account? </Text>
        <Pressable onPress={() => router.push('/signup')}>
          <Text style={styles.footerLink}>Sign up</Text>
        </Pressable>
      </View>

      {/* Google Authentication Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showGoogleModal}
        onRequestClose={() => setShowGoogleModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Continue with Google</Text>
            <Text style={styles.modalSubtitle}>Please enter your Google Email address to sign in or register dynamically.</Text>
            
            <View style={[
              styles.inputContainer,
              googleEmailFocus && styles.inputFocused,
              googleEmailFocus && styles.inputFocusedGlow,
              { marginBottom: theme.spacing.lg, width: '100%' }
            ]}>
              <User size={20} color={googleEmailFocus ? theme.colors.primary : theme.colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Google Email (e.g. user@gmail.com)"
                placeholderTextColor={theme.colors.textSecondary}
                value={googleEmail}
                onChangeText={setGoogleEmail}
                onFocus={() => setGoogleEmailFocus(true)}
                onBlur={() => setGoogleEmailFocus(false)}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.modalButtons}>
              <Pressable 
                style={[styles.modalButton, styles.modalButtonCancel]} 
                onPress={() => {
                  setShowGoogleModal(false);
                  setGoogleEmail('');
                }}
              >
                <Text style={styles.modalButtonCancelText}>Cancel</Text>
              </Pressable>
              
              <Pressable 
                style={[styles.modalButton, styles.modalButtonSubmit]} 
                onPress={handleGoogleLoginSubmit}
              >
                <Text style={styles.modalButtonSubmitText}>Continue</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    overflow: 'hidden',
  },
  bgGlow1: {
    position: 'absolute',
    top: -60,
    left: -60,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(99, 102, 241, 0.12)', // Indigo glow
    ...Platform.select({
      web: {
        filter: 'blur(80px)',
      }
    })
  },
  bgGlow2: {
    position: 'absolute',
    bottom: 80,
    right: -80,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(56, 189, 248, 0.1)', // Sky blue glow
    ...Platform.select({
      web: {
        filter: 'blur(90px)',
      }
    })
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    justifyContent: 'center',
    position: 'relative',
    zIndex: 2,
    ...Platform.select({
      web: {
        maxWidth: 480,
        width: '100%',
        alignSelf: 'center',
      }
    })
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
  logoContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  logoBadge: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  logoText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 30,
    fontWeight: '900',
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.md,
    letterSpacing: 0.5,
  },
  logoSubtext: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
    letterSpacing: 0.2,
  },
  welcomeText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 22,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.lg,
    textAlign: 'left',
  },
  inputGroup: {
    marginBottom: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: theme.borderRadius.card,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: theme.spacing.md,
    height: 56,
    ...Platform.select({
      web: {
        transition: 'all 0.2s ease-in-out',
      }
    })
  },
  inputFocused: {
    borderColor: theme.colors.primary,
    backgroundColor: 'rgba(99, 102, 241, 0.02)',
  },
  inputFocusedGlow: {
    ...Platform.select({
      web: {
        boxShadow: '0 0 12px rgba(99, 102, 241, 0.25)',
      },
      default: {
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      }
    })
  },
  inputIcon: {
    marginRight: theme.spacing.sm,
  },
  input: {
    flex: 1,
    fontFamily: theme.typography.fontFamily,
    fontSize: 16,
    color: theme.colors.textPrimary,
    outlineStyle: 'none', // Remove focus ring on web browser
  } as any,
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: theme.spacing.xs,
  },
  forgotPasswordText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.pill,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  primaryButtonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 16,
    fontWeight: '800',
    color: '#000000', // Crisp dark contrast on neon primary
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  dividerText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 14,
    color: theme.colors.textSecondary,
    paddingHorizontal: theme.spacing.md,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: theme.borderRadius.card,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    height: 56,
  },
  googleButtonText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    zIndex: 2,
  },
  footerText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  footerLink: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 8, 16, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  modalCard: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#0c101d',
    borderRadius: theme.borderRadius.card,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: theme.spacing.xl,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
  },
  modalTitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
    lineHeight: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    width: '100%',
  },
  modalButton: {
    flex: 1,
    height: 48,
    borderRadius: theme.borderRadius.pill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  modalButtonCancelText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  modalButtonSubmit: {
    backgroundColor: theme.colors.primary,
  },
  modalButtonSubmitText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 14,
    fontWeight: '800',
    color: '#000000',
  },
});
