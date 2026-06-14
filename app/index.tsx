import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path, Circle, Defs } from 'react-native-svg';
import Animated, { 
  useSharedValue, 
  useAnimatedProps, 
  useAnimatedStyle,
  withTiming, 
  Easing,
  FadeInUp
} from 'react-native-reanimated';
import { useAppContext } from './context/AppContext';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();
  const { currentUser } = useAppContext();
  const currentUserRef = React.useRef(currentUser);

  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);
  
  // Shared values for drawing SVG Hexagon and Checkmark
  const hexagonProgress = useSharedValue(0);
  const checkProgress = useSharedValue(0);
  const logoScale = useSharedValue(0.9);
  const textOpacity = useSharedValue(0);

  useEffect(() => {
    // 1. Draw Hexagon outline
    hexagonProgress.value = withTiming(1, { duration: 1100, easing: Easing.inOut(Easing.ease) });
    logoScale.value = withTiming(1, { duration: 1200, easing: Easing.out(Easing.back(1.2)) });
    
    // 2. Draw Checkmark inside
    setTimeout(() => {
      checkProgress.value = withTiming(1, { duration: 700, easing: Easing.out(Easing.back(1.4)) });
    }, 900);

    // 3. Fade in text
    setTimeout(() => {
      textOpacity.value = withTiming(1, { duration: 600 });
    }, 1500);

    // 4. Navigate to login or tabs depending on currentUser session
    setTimeout(() => {
      if (currentUserRef.current) {
        router.replace('/(tabs)');
      } else {
        router.replace('/login');
      }
    }, 3000);
  }, []);

  const hexagonProps = useAnimatedProps(() => {
    const length = 300;
    return {
      strokeDashoffset: length - (length * hexagonProgress.value),
    };
  });

  const checkProps = useAnimatedProps(() => {
    const length = 70;
    return {
      strokeDashoffset: length - (length * checkProgress.value),
    };
  });

  const logoAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: logoScale.value }],
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
        <Svg width="160" height="160" viewBox="0 0 160 160">
          {/* Animated regular pointed Hexagon outline */}
          <AnimatedPath 
            d="M 80 30 L 123.3 55 L 123.3 105 L 80 130 L 36.7 105 L 36.7 55 Z" 
            stroke="#6366f1" 
            strokeWidth="8" 
            fill="transparent" 
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={300}
            animatedProps={hexagonProps}
          />
          
          {/* Animated Checkmark Inside */}
          <AnimatedPath 
            d="M 58 80 L 73 95 L 102 66" 
            stroke="#6366f1" 
            strokeWidth="8" 
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={70}
            animatedProps={checkProps}
          />
        </Svg>
      </Animated.View>

      <Animated.View style={{ opacity: textOpacity, transform: [{ translateY: textOpacity.value * -10 + 10 }] }}>
        <Text style={styles.title}>OMNIAUDIT</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0f19', // Deep midnight dark mode
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 20,
  },
  title: {
    fontFamily: 'System', // Geometric sans-serif
    fontSize: 42,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 4,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
  }
});
