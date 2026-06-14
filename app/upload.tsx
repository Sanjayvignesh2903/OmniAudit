import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView, Image, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  withSequence,
  Easing,
  FadeIn
} from 'react-native-reanimated';
import { ArrowLeft, Upload, FileText, Camera, CheckCircle2 } from 'lucide-react-native';
import { theme } from '../constants/theme';
import { submitAudit } from '../utils/api';
import { useAppContext } from './context/AppContext';

const CATEGORY_LABELS: Record<string, string> = {
  scan: 'Scan New Bill',
  rental: 'Rental Agreement',
  hotel: 'Hotel / Stay',
  food: 'Restaurant / Food',
  fuel: 'Petrol / Fuel',
  utilities: 'Electricity / Utilities',
  retail: 'Retail / Groceries',
  pharmacy: 'Pharmacy',
  travel: 'Travel / Tickets',
};

export default function UploadScreen() {
  const router = useRouter();
  const { category, sub } = useLocalSearchParams<{ category: string, sub: string }>();
  const { addHistoryItem } = useAppContext();
  
  const [fileSelected, setFileSelected] = useState<{ uri: string; name: string; type: string } | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);

  // Animation values
  const scanLineY = useSharedValue(0);
  const progressWidth = useSharedValue(0);

  useEffect(() => {
    if (isAuditing) {
      scanLineY.value = withRepeat(
        withSequence(
          withTiming(200, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 1500, easing: Easing.inOut(Easing.ease) })
        ),
        -1, // infinite
        true // reverse
      );

      progressWidth.value = withTiming(100, { duration: 3000 }); // simulate 3s loading
    } else {
      scanLineY.value = 0;
      progressWidth.value = 0;
    }
  }, [isAuditing]);

  const scanLineStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: scanLineY.value }],
    };
  });

  const progressStyle = useAnimatedStyle(() => {
    return {
      width: `${progressWidth.value}%`,
    };
  });

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      if (result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setFileSelected({
          uri: asset.uri,
          name: asset.name,
          type: asset.mimeType?.includes('pdf') ? 'pdf' : 'image'
        });
      }
    } catch (error) {
      console.error("Error picking document", error);
    }
  };

  const handleTakePhoto = async () => {
    if (Platform.OS === 'web') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.capture = 'environment';
      input.onchange = (e: any) => {
        const file = e.target.files?.[0];
        if (file) {
          const url = URL.createObjectURL(file);
          setFileSelected({
            uri: url,
            name: file.name || 'camera_capture.jpg',
            type: 'image'
          });
        }
      };
      input.click();
      return;
    }

    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera permissions to make this work!');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setFileSelected({
          uri: asset.uri,
          name: 'camera_capture.jpg',
          type: 'image'
        });
      }
    } catch (error) {
      console.error("Error taking photo", error);
    }
  };

  const handleRunAudit = async () => {
    if (!fileSelected) return;
    
    setIsAuditing(true);
    
    try {
      const response = await submitAudit(category || 'unknown', fileSelected.uri, fileSelected.name);
      
      const newHistoryItem = {
        id: Date.now().toString(),
        title: fileSelected.name || 'Scanned Document',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        category: category || 'scan',
        verdict: response.verdict === 'fair' ? 'Fair' : response.verdict === 'overcharged' ? 'Overcharged' : 'Review',
        amount: response.savings ? `₹${response.savings}` : '₹0',
        iconName: 
          category === 'rental' ? 'Home' : 
          category === 'hotel' ? 'Building' : 
          category === 'food' ? 'UtensilsCrossed' :
          category === 'fuel' ? 'Fuel' :
          category === 'utilities' ? 'Zap' :
          category === 'retail' ? 'ShoppingCart' :
          category === 'pharmacy' ? 'Pill' :
          category === 'travel' ? 'Plane' : 'Hexagon',
        tint: theme.colors.tints[category as keyof typeof theme.colors.tints] || theme.colors.primary,
      };

      addHistoryItem(newHistoryItem);

      router.replace({
        pathname: '/results',
        params: { 
          category: category || 'unknown',
          result: JSON.stringify(response) 
        }
      });
    } catch (e) {
      console.error(e);
      setIsAuditing(false);
    }
  };

  if (isAuditing) {
    return (
      <View style={styles.loadingContainer}>
        <Animated.View style={styles.scannerBox} entering={FadeIn}>
          {fileSelected?.type === 'image' ? (
            <Image source={{ uri: fileSelected.uri }} style={styles.previewImage} />
          ) : (
            <FileText size={64} color={theme.colors.textSecondary} strokeWidth={1} />
          )}
          <Animated.View style={[styles.activeScanLine, scanLineStyle]} />
        </Animated.View>
        
        <Text style={styles.loadingTitle}>Auditing your document...</Text>
        <Text style={styles.loadingSub}>Checking for hidden fees and tax errors</Text>

        <View style={styles.progressContainer}>
          <Animated.View style={[styles.progressBar, progressStyle]} />
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={theme.colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>
          {sub ? sub.replace(/-/g, ' ').toUpperCase() : (CATEGORY_LABELS[category] || 'UPLOAD BILL')}
        </Text>
        <View style={{width: 24}} />
      </View>

      <View style={styles.content}>
        <Pressable 
          style={[styles.uploadZone, fileSelected && styles.uploadZoneSelected]}
          onPress={fileSelected ? undefined : handlePickDocument}
        >
          {fileSelected ? (
            <View style={styles.fileSelectedState}>
              <CheckCircle2 size={48} color={theme.colors.primary} strokeWidth={1.5} style={{marginBottom: 16}} />
              <Text style={styles.fileName}>{fileSelected.name}</Text>
              <Pressable onPress={() => setFileSelected(null)} style={styles.clearBtn}>
                <Text style={styles.clearBtnText}>Remove & pick again</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.uploadEmptyState}>
              <View style={styles.uploadIconWrapper}>
                <Upload size={32} color={theme.colors.primary} strokeWidth={2} />
              </View>
              <Text style={styles.uploadTitle}>Tap to browse files</Text>
              <Text style={styles.uploadSub}>JPG, PNG or PDF • Max 10MB</Text>
            </View>
          )}
        </Pressable>

        {!fileSelected && (
          <View style={styles.orDivider}>
            <View style={styles.dividerLine} />
            <Text style={styles.orText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>
        )}

        {!fileSelected && (
          <Pressable style={styles.secondaryButton} onPress={handleTakePhoto}>
            <Camera size={20} color={theme.colors.textPrimary} />
            <Text style={styles.secondaryButtonText}>Take a Photo</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.footer}>
        <Pressable
          style={[styles.button, !fileSelected && styles.buttonDisabled]}
          onPress={handleRunAudit}
          disabled={!fileSelected}
        >
          <Text style={[styles.buttonText, !fileSelected && styles.buttonTextDisabled]}>
            Start Audit Scan
          </Text>
        </Pressable>
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
    flex: 1,
    padding: theme.spacing.lg,
    justifyContent: 'center',
  },
  uploadZone: {
    backgroundColor: theme.colors.surface,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
    borderRadius: theme.borderRadius.card,
    height: 320,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  uploadZoneSelected: {
    borderColor: theme.colors.primary,
    borderStyle: 'solid',
  },
  uploadEmptyState: {
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  uploadIconWrapper: {
    width: 64,
    height: 64,
    borderRadius: theme.borderRadius.iconBox,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  uploadTitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  uploadSub: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  fileSelectedState: {
    alignItems: 'center',
  },
  fileName: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.lg,
  },
  clearBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: theme.borderRadius.pill,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  clearBtnText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  orDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border,
  },
  orText: {
    fontFamily: theme.typography.fontFamily,
    color: theme.colors.textSecondary,
    paddingHorizontal: theme.spacing.md,
    fontWeight: '600',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.pill,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.spacing.sm,
  },
  secondaryButtonText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  footer: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.pill,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  buttonText: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  buttonTextDisabled: {
    color: theme.colors.textSecondary,
  },
  
  // Scanning Loader (Screen 4)
  loadingContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  scannerBox: {
    width: 140,
    height: 180,
    borderRadius: 16, 
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    opacity: 0.8,
  },
  activeScanLine: {
    position: 'absolute',
    top: -10,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: theme.colors.primary, 
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 10,
  },
  loadingTitle: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 28,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
    letterSpacing: 1,
  },
  loadingSub: {
    fontFamily: theme.typography.fontFamily,
    fontSize: 15,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    letterSpacing: 0.5,
  },
  progressContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: theme.colors.border,
  },
  progressBar: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.4,
    shadowRadius: 5,
  }
});
