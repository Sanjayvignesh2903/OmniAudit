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
  ScrollView, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Hexagon, User, Mail, Lock, Phone, Eye, EyeOff, Hash, AlertCircle } from 'lucide-react-native';
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

export default function SignupScreen() {
  const router = useRouter();
  const { registerUser } = useAppContext();
  
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  
  const [nameFocus, setNameFocus] = useState(false);
  const [userFocus, setUserFocus] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);
  const [phoneFocus, setPhoneFocus] = useState(false);
  const [passFocus, setPassFocus] = useState(false);
  
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const isSubmitting = React.useRef(false);

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
      Alert.alert('Registration Failed', msg.replace('Registration Failed: ', ''));
    }
    // Auto clear inline warning banner after a few seconds
    setTimeout(() => {
      setErrorText(null);
    }, 5000);
  };

  const handleSignup = () => {
    if (isSubmitting.current) return;
    
    setErrorText(null);
    if (!fullName.trim() || !username.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      triggerError('Missing Fields: Please fill out all fields to continue.');
      return;
    }
    
    isSubmitting.current = true;
    setIsLoading(true);
    setTimeout(() => {
      isSubmitting.current = false;
      setIsLoading(false);
      const success = registerUser({
        name: fullName.trim(),
        username: username.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password: password.trim()
      });

      if (success) {
        router.replace('/(tabs)');
      } else {
        triggerError('Registration Failed: This username or email is already taken.');
      }
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Background Ambient Glow Orbs */}
      <View style={styles.bgGlow1} />
      <View style={styles.bgGlow2} />

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
        style={styles.keyboardAvoid}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
        >
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
              <Svg width="46" height="46" viewBox="0 0 160 160">
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
            <Text style={styles.logoText}>Create Account</Text>
            <Text style={styles.logoSubtext}>Join OmniAudit today</Text>
          </Animated.View>

          {/* Form Fields */}
          <View style={styles.inputGroup}>
            
            {/* Full Name */}
            <View style={[
              styles.inputContainer, 
              nameFocus && styles.inputFocused,
              nameFocus && styles.inputFocusedGlow
            ]}>
              <User size={20} color={nameFocus ? theme.colors.primary : theme.colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor={theme.colors.textSecondary}
                value={fullName}
                onChangeText={setFullName}
                onFocus={() => {
                  setNameFocus(true);
                  setErrorText(null);
                }}
                onBlur={() => setNameFocus(false)}
              />
            </View>

            {/* Username */}
            <View style={[
              styles.inputContainer, 
              userFocus && styles.inputFocused,
              userFocus && styles.inputFocusedGlow
            ]}>
              <Hash size={20} color={userFocus ? theme.colors.primary : theme.colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Username"
                placeholderTextColor={theme.colors.textSecondary}
                value={username}
                onChangeText={setUsername}
                onFocus={() => {
                  setUserFocus(true);
                  setErrorText(null);
                }}
                onBlur={() => setUserFocus(false)}
                autoCapitalize="none"
              />
            </View>

            {/* Email Address */}
            <View style={[
              styles.inputContainer, 
              emailFocus && styles.inputFocused,
              emailFocus && styles.inputFocusedGlow
            ]}>
              <Mail size={20} color={emailFocus ? theme.colors.primary : theme.colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor={theme.colors.textSecondary}
                value={email}
                onChangeText={setEmail}
                onFocus={() => {
                  setEmailFocus(true);
                  setErrorText(null);
                }}
                onBlur={() => setEmailFocus(false)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Phone Number */}
            <View style={[
              styles.inputContainer, 
              phoneFocus && styles.inputFocused,
              phoneFocus && styles.inputFocusedGlow
            ]}>
              <Phone size={20} color={phoneFocus ? theme.colors.primary : theme.colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                placeholderTextColor={theme.colors.textSecondary}
                value={phone}
                onChangeText={setPhone}
                onFocus={() => {
                  setPhoneFocus(true);
                  setErrorText(null);
                }}
                onBlur={() => setPhoneFocus(false)}
                keyboardType="phone-pad"
              />
            </View>

            {/* Password */}
            <View style={[
              styles.inputContainer, 
              passFocus && styles.inputFocused,
              passFocus && styles.inputFocusedGlow
            ]}>
              <Lock size={20} color={passFocus ? theme.colors.primary : theme.colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Create Password"
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

          </View>

          {/* Action Button */}
          <Animated.View style={[buttonAnimatedStyle, { marginTop: theme.spacing.lg }]}>
            <Pressable 
              style={[styles.primaryButton, isLoading && styles.primaryButtonDisabled]} 
              onPress={handleSignup}
              disabled={isLoading}
              onPressIn={() => { buttonScale.value = withSpring(0.96); }}
              onPressOut={() => { buttonScale.value = withSpring(1); }}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.primaryButtonText}>Sign Up</Text>
              )}
            </Pressable>
          </Animated.View>

        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <Pressable onPress={() => router.push('/login')}>
          <Text style={styles.footerLink}>Log In</Text>
        </Pressable>
      </View>
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
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xxl,
    paddingBottom: theme.spacing.xl,
    justifyContent: 'center',
    flexGrow: 1,
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
    marginBottom: theme.spacing.xxl,
  },
  logoBadge: {
    width: 70,
    height: 70,
    borderRadius: 22,
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
    fontSize: 28,
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
  inputGroup: {
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
    color: '#000000',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    backgroundColor: theme.colors.background,
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
});
