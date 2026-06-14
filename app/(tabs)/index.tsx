import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, SafeAreaView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Home, Building, Zap, ShoppingCart, Plane, Hexagon } from 'lucide-react-native';
import Svg, { Path, Circle, Rect, Defs } from 'react-native-svg';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  useAnimatedProps,
  useAnimatedReaction,
  withTiming, 
  withSpring,
  withRepeat,
  withSequence,
  FadeInUp,
  interpolateColor
} from 'react-native-reanimated';
import { theme } from '../../constants/theme';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedRect = Animated.createAnimatedComponent(Rect);

// Custom Animated SVGs
const AnimatedRestaurantIcon = ({ isHovered, color }: { isHovered: Animated.SharedValue<number>, color: string }) => {
  const dash = useSharedValue(0);
  const length = 120;
  
  useAnimatedReaction(
    () => isHovered.value === 1,
    (hovered) => {
      if (hovered) {
        dash.value = withRepeat(withSequence(withTiming(length, {duration: 400}), withTiming(0, {duration: 400})), -1, false);
      } else {
        dash.value = withTiming(0, {duration: 250});
      }
    }
  );

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: dash.value,
  }));

  return (
    <Svg width="34" height="34" viewBox="0 0 24 24">
      <AnimatedPath 
        d="M3 2v7c0 2.2 1.8 4 4 4h1v9M7 2v7M11 2v7M21 2c-2.2 0-4 1.8-4 4v16M17 10h4" 
        stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"
        strokeDasharray={120} animatedProps={animatedProps}
      />
    </Svg>
  );
};

const AnimatedPetrolIcon = ({ isHovered, color }: { isHovered: Animated.SharedValue<number>, color: string }) => {
  const dash = useSharedValue(0);
  const length = 100;

  useAnimatedReaction(
    () => isHovered.value === 1,
    (hovered) => {
      if (hovered) {
        dash.value = withRepeat(withSequence(withTiming(length, {duration: 350}), withTiming(0, {duration: 350})), -1, false);
      } else {
        dash.value = withTiming(0, {duration: 250});
      }
    }
  );

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: dash.value,
  }));

  return (
    <Svg width="34" height="34" viewBox="0 0 24 24">
      <AnimatedPath 
        d="M3 22v-8c0-2.2 1.8-4 4-4h4c2.2 0 4 1.8 4 4v8M3 22h12M15 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2M15 10h6v6l-2-2v4" 
        stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"
        strokeDasharray={100} animatedProps={animatedProps}
      />
    </Svg>
  );
};

const AnimatedPharmacyIcon = ({ isHovered, color }: { isHovered: Animated.SharedValue<number>, color: string }) => {
  const dash = useSharedValue(0);
  const length = 150;

  useAnimatedReaction(
    () => isHovered.value === 1,
    (hovered) => {
      if (hovered) {
        dash.value = withRepeat(withSequence(withTiming(length, {duration: 450}), withTiming(0, {duration: 450})), -1, false);
      } else {
        dash.value = withTiming(0, {duration: 250});
      }
    }
  );

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: dash.value,
  }));

  return (
    <Svg width="34" height="34" viewBox="0 0 24 24">
      <AnimatedPath 
        d="M10.5 20.5l-6-6a4.24 4.24 0 0 1 0-6 4.24 4.24 0 0 1 6 0l6 6a4.24 4.24 0 0 1 0 6 4.24 4.24 0 0 1-6 0z M8.5 8.5l7 7" 
        stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"
        strokeDasharray={150} animatedProps={animatedProps}
      />
    </Svg>
  );
};

const AnimatedRentalIcon = ({ isHovered, color }: { isHovered: Animated.SharedValue<number>, color: string }) => {
  const dash = useSharedValue(0);
  const length = 120;

  useAnimatedReaction(
    () => isHovered.value === 1,
    (hovered) => {
      if (hovered) {
        dash.value = withRepeat(withSequence(withTiming(length, {duration: 400}), withTiming(0, {duration: 400})), -1, false);
      } else {
        dash.value = withTiming(0, {duration: 250});
      }
    }
  );

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: dash.value,
  }));

  return (
    <Svg width="34" height="34" viewBox="0 0 24 24">
      <AnimatedPath 
        d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" 
        stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"
        strokeDasharray={120} animatedProps={animatedProps}
      />
      <Path d="M9 22V12h6v10" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </Svg>
  );
};

const AnimatedHotelIcon = ({ isHovered, color }: { isHovered: Animated.SharedValue<number>, color: string }) => {
  const windowPulse = useSharedValue(0);

  useAnimatedReaction(
    () => isHovered.value === 1,
    (hovered) => {
      if (hovered) {
        windowPulse.value = withRepeat(withSequence(withTiming(1, {duration: 350}), withTiming(0.2, {duration: 350})), -1, true);
      } else {
        windowPulse.value = withTiming(0, {duration: 200});
      }
    }
  );

  const windowProps = useAnimatedProps(() => ({
    opacity: windowPulse.value,
  }));

  return (
    <Svg width="34" height="34" viewBox="0 0 24 24">
      <Path 
        d="M3 21h18M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" 
        stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"
      />
      <AnimatedPath 
        d="M9 7h2v2H9zm4 0h2v2h-2zm-4 4h2v2H9zm4 0h2v2h-2zm-4 4h2v2H9zm4 0h2v2h-2z"
        fill={color} stroke="none" animatedProps={windowProps}
      />
    </Svg>
  );
};

const AnimatedElectricityIcon = ({ isHovered, color }: { isHovered: Animated.SharedValue<number>, color: string }) => {
  const dash = useSharedValue(0);
  const strokeWidth = useSharedValue(1.5);
  const length = 80;

  useAnimatedReaction(
    () => isHovered.value === 1,
    (hovered) => {
      if (hovered) {
        dash.value = withRepeat(withSequence(withTiming(length, {duration: 300}), withTiming(0, {duration: 300})), -1, false);
        strokeWidth.value = withRepeat(withSequence(withTiming(2.5, {duration: 150}), withTiming(1.5, {duration: 150})), -1, true);
      } else {
        dash.value = withTiming(0, {duration: 250});
        strokeWidth.value = withTiming(1.5, {duration: 200});
      }
    }
  );

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: dash.value,
    strokeWidth: strokeWidth.value,
  }));

  return (
    <Svg width="34" height="34" viewBox="0 0 24 24">
      <AnimatedPath 
        d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" 
        stroke={color} strokeLinecap="round" strokeLinejoin="round" fill="none"
        strokeDasharray={80} animatedProps={animatedProps}
      />
    </Svg>
  );
};

const AnimatedGroceryIcon = ({ isHovered, color }: { isHovered: Animated.SharedValue<number>, color: string }) => {
  const dash = useSharedValue(0);
  const length = 120;

  useAnimatedReaction(
    () => isHovered.value === 1,
    (hovered) => {
      if (hovered) {
        dash.value = withRepeat(withSequence(withTiming(length, {duration: 400}), withTiming(0, {duration: 400})), -1, false);
      } else {
        dash.value = withTiming(0, {duration: 250});
      }
    }
  );

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: dash.value,
  }));

  return (
    <Svg width="34" height="34" viewBox="0 0 24 24">
      <AnimatedPath 
        d="M2 3h4l2.7 13.5A2 2 0 0 0 10.7 18h11.6a2 2 0 0 0 2-1.6l1.7-8.4H6.3" 
        stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"
        strokeDasharray={120} animatedProps={animatedProps}
      />
      <Circle cx="9" cy="21" r="2" stroke={color} strokeWidth="1.5" fill="none" />
      <Circle cx="20" cy="21" r="2" stroke={color} strokeWidth="1.5" fill="none" />
    </Svg>
  );
};

const AnimatedTravelIcon = ({ isHovered, color }: { isHovered: Animated.SharedValue<number>, color: string }) => {
  const dash = useSharedValue(0);
  const length = 160;
  const trailDash = useSharedValue(20);

  useAnimatedReaction(
    () => isHovered.value === 1,
    (hovered) => {
      if (hovered) {
        dash.value = withRepeat(withSequence(withTiming(length, {duration: 500}), withTiming(0, {duration: 500})), -1, false);
        trailDash.value = withRepeat(withTiming(0, {duration: 400}), -1, false);
      } else {
        dash.value = withTiming(0, {duration: 250});
        trailDash.value = withTiming(20, {duration: 200});
      }
    }
  );

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: dash.value,
  }));

  const trailProps = useAnimatedProps(() => ({
    strokeDashoffset: trailDash.value,
  }));

  return (
    <Svg width="34" height="34" viewBox="0 0 24 24">
      <AnimatedPath 
        d="M2 19l4-2M4 21l3-1.5" 
        stroke={color} strokeWidth="1" strokeLinecap="round" strokeDasharray="5, 15"
        animatedProps={trailProps}
      />
      <AnimatedPath 
        d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3.5s-2.5 0-4 1.5L13.5 8.5L5.3 6.7c-1.1-.2-2.2.4-2.5 1.5v0c-.3 1.1.2 2.2 1.3 2.5l7.7 2.5L8.3 17l-3.3-.8c-.9-.2-1.9.2-2.3 1v0c-.4.8-.2 1.8.5 2.3l3.8 2.2l2.2 3.8c.5.7 1.5.9 2.3.5v0c.8-.4 1.2-1.4 1-2.3l-.8-3.3l3.8-3.5l2.5 7.7c.3 1.1 1.4 1.6 2.5 1.3v0c1.1-.3 1.7-1.4 1.5-2.5l-1.8-8.2z" 
        stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"
        strokeDasharray={160} animatedProps={animatedProps}
      />
    </Svg>
  );
};

const categories = [
  { id: 'rental', label: 'Rental', customIcon: AnimatedRentalIcon, tint: theme.colors.tints.rental },
  { id: 'hotel', label: 'Hotel', customIcon: AnimatedHotelIcon, tint: theme.colors.tints.hotel },
  { id: 'food', label: 'Restaurant', customIcon: AnimatedRestaurantIcon, tint: theme.colors.tints.restaurant },
  { id: 'fuel', label: 'Petrol', customIcon: AnimatedPetrolIcon, tint: theme.colors.tints.petrol },
  { id: 'utilities', label: 'Electricity', customIcon: AnimatedElectricityIcon, tint: theme.colors.tints.electricity },
  { id: 'retail', label: 'Grocery', customIcon: AnimatedGroceryIcon, tint: theme.colors.tints.grocery },
  { id: 'pharmacy', label: 'Pharmacy', customIcon: AnimatedPharmacyIcon, tint: theme.colors.tints.history },
  { id: 'travel', label: 'Travel', customIcon: AnimatedTravelIcon, tint: theme.colors.tints.upload },
];

const CategoryCard = ({ item, index, onPress }: { item: typeof categories[0], index: number, onPress: () => void }) => {
  const isHovered = useSharedValue(0);

  const handleHoverIn = () => { isHovered.value = withTiming(1, { duration: 250 }); };
  const handleHoverOut = () => { isHovered.value = withTiming(0, { duration: 350 }); };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: withSpring(isHovered.value ? -10 : 0, { damping: 15, stiffness: 120 }) },
        { scale: withSpring(isHovered.value ? 1.05 : 1, { damping: 15, stiffness: 120 }) }
      ],
      borderColor: interpolateColor(
        isHovered.value,
        [0, 1],
        [theme.colors.border, item.tint]
      ),
      shadowColor: item.tint,
      shadowOpacity: isHovered.value * 0.4,
      shadowRadius: isHovered.value * 20,
      elevation: isHovered.value * 15,
      backgroundColor: interpolateColor(
        isHovered.value,
        [0, 1],
        [theme.colors.surface, 'rgba(255, 255, 255, 0.05)']
      )
    };
  });

  const iconStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: withSpring(isHovered.value ? 1.2 : 1) },
      ]
    };
  });

  const CustomIcon = item.customIcon;

  return (
    <Animated.View 
      entering={FadeInUp.delay(index * 80).springify().damping(14)}
      style={styles.cardContainer}
    >
      <Pressable
        onPress={onPress}
        onHoverIn={Platform.OS === 'web' ? handleHoverIn : undefined}
        onHoverOut={Platform.OS === 'web' ? handleHoverOut : undefined}
        onPressIn={() => Platform.OS !== 'web' && handleHoverIn()}
        onPressOut={() => Platform.OS !== 'web' && handleHoverOut()}
      >
        <Animated.View style={[styles.card, animatedStyle]}>
          <Animated.View style={[iconStyle, { marginBottom: 20 }]}>
            <CustomIcon isHovered={isHovered} color={item.tint} />
          </Animated.View>
          <Text style={styles.cardLabel}>{item.label}</Text>
          <View style={[styles.accentBar, { backgroundColor: item.tint, opacity: isHovered.value ? 1 : 0.3 }]} />
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
};

export default function HomeScreen() {
  const router = useRouter();

  const navigateToUpload = (categoryId: string) => {
    router.push({
      pathname: '/upload',
      params: { category: categoryId }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View entering={FadeInUp.delay(0).springify()} style={styles.header}>
        <Text style={styles.headerTitle}>OmniAudit</Text>
        <Text style={styles.headerSubtitle}>Select a category to scan</Text>
      </Animated.View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {categories.map((item, index) => (
            <CategoryCard 
              key={item.id} 
              item={item} 
              index={index} 
              onPress={() => navigateToUpload(item.id)} 
            />
          ))}
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
    alignItems: 'center',
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
  },
  headerTitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 32,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    letterSpacing: 1,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 16,
    color: theme.colors.textSecondary,
    letterSpacing: 0.5,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardContainer: {
    width: '47%',
    marginBottom: theme.spacing.lg,
  },
  card: {
    height: 160,
    borderRadius: theme.borderRadius.card,
    borderWidth: 1,
    padding: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
  },
  cardLabel: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    letterSpacing: 0.5,
  },
  accentBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
  }
});
