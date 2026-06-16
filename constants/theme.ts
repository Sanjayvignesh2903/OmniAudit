export const theme = {
  colors: {
    background: '#0b0f19', // Midnight dark mode
    surface: 'rgba(255, 255, 255, 0.03)', // Semi-transparent glass
    border: 'rgba(255, 255, 255, 0.08)', // Thin, subtle borders
    primary: '#6366f1', // Glowing indigo
    primaryLight: 'rgba(99, 102, 241, 0.15)',
    secondary: '#38bdf8', 
    secondaryLight: 'rgba(56, 189, 248, 0.15)',
    textPrimary: '#f8fafc', // Crisp white text
    textSecondary: '#94a3b8', // Subtle slate text
    
    // Tints for category accent glows (used for hover/borders)
    tints: {
      primaryAction: '#6366f1', // Indigo
      history: '#8b5cf6', // Purple
      upload: '#ec4899', // Pink
      electricity: '#eab308', // Yellow/Gold
      petrol: '#f97316', // Orange
      hotel: '#ec4899', // Pink
      grocery: '#10b981', // Emerald
      restaurant: '#f43f5e', // Rose
      rental: '#38bdf8', // Sky Blue
    },

    verdict: {
      fair: {
        accent: '#10b981', // green
        bg: 'rgba(16, 185, 129, 0.1)' // glass green bg
      },
      overcharged: {
        accent: '#ef4444', // red
        bg: 'rgba(239, 68, 68, 0.1)' // glass red bg
      },
      review: {
        accent: '#f59e0b', // amber
        bg: 'rgba(245, 158, 11, 0.1)' // glass amber bg
      }
    }
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    card: 16, 
    iconBox: 12, 
    pill: 999, 
  },
  typography: {
    fontFamily: 'System', 
  }
};

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: '#0a7ea4',
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: '#0a7ea4',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: '#fff',
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#fff',
  },
};

