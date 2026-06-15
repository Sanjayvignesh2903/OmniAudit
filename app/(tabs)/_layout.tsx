import { Tabs } from 'expo-router';
import { Home, History, User } from 'lucide-react-native';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../../constants/theme';

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  const isMobileWeb = Platform.OS === 'web' && 
    typeof window !== 'undefined' && 
    window.navigator && 
    /Mobi|Android|iPhone/i.test(window.navigator.userAgent);

  const getTabBarStyles = () => {
    if (Platform.OS === 'web') {
      return {
        height: isMobileWeb ? 78 : 64,
        paddingBottom: isMobileWeb ? 22 : 10,
        paddingTop: 8,
      };
    }
    return {
      height: 60 + (insets.bottom > 0 ? insets.bottom - 10 : 0),
      paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
      paddingTop: 8,
    };
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 10,
          ...getTabBarStyles(),
        },
        tabBarLabelStyle: {
          fontFamily: theme.typography.fontFamily,
          fontSize: 12,
          fontWeight: '500',
        }
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color }) => <History size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
