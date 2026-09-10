import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { ThemeColors } from '../constants/colors';
import { useTheme } from '../context/ThemeContext';
import { TabType } from '../components/BottomNavBar';

interface SkeletonProps {
  tabId?: TabType;
}

const SkeletonScreen: React.FC<SkeletonProps> = ({ tabId = 'key' }) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const pulseAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.6,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 400,
          useNativeDriver: true,
        })
      ])
    ).start();
  }, [pulseAnim]);

  const renderLayout = () => {
    switch (tabId) {
      case 'users':
        return (
          <>
            <View style={[styles.row, { justifyContent: 'space-between' }]}>
              <Animated.View style={[styles.card, { opacity: pulseAnim, width: 40, height: 40, borderRadius: 20 }]} />
              <Animated.View style={[styles.card, { opacity: pulseAnim, width: 120, height: 40, borderRadius: 20 }]} />
            </View>
            <Animated.View style={[styles.card, { opacity: pulseAnim, width: 150, height: 24, marginTop: 8 }]} />
            <Animated.View style={[styles.card, { opacity: pulseAnim, height: 280 }]} />
            <Animated.View style={[styles.card, { opacity: pulseAnim, height: 280 }]} />
          </>
        );
      case 'pie': // Pipeline (Map + List)
        return (
          <>
            <Animated.View style={[styles.card, { opacity: pulseAnim, height: 220 }]} />
            <View style={[styles.row, { justifyContent: 'space-between', marginTop: 16, marginBottom: 8 }]}>
              <Animated.View style={[styles.card, { opacity: pulseAnim, width: 140, height: 24 }]} />
              <Animated.View style={[styles.card, { opacity: pulseAnim, width: 80, height: 24 }]} />
            </View>
            <Animated.View style={[styles.card, { opacity: pulseAnim, height: 160 }]} />
            <Animated.View style={[styles.card, { opacity: pulseAnim, height: 160 }]} />
          </>
        );
      case 'bar': // Revenue Forecast
        return (
          <>
            <Animated.View style={[styles.card, { opacity: pulseAnim, height: 280 }]} />
            <View style={styles.row}>
              <Animated.View style={[styles.card, { opacity: pulseAnim, flex: 1, height: 140 }]} />
              <Animated.View style={[styles.card, { opacity: pulseAnim, flex: 1, height: 140 }]} />
            </View>
          </>
        );
      case 'lightbulb': // Insights
        return (
          <>
            <View style={styles.row}>
              <Animated.View style={[styles.card, { opacity: pulseAnim, flex: 1, height: 100 }]} />
              <Animated.View style={[styles.card, { opacity: pulseAnim, flex: 1, height: 100 }]} />
            </View>
            <Animated.View style={[styles.card, { opacity: pulseAnim, height: 300 }]} />
            <Animated.View style={[styles.card, { opacity: pulseAnim, height: 80 }]} />
          </>
        );
      case 'key':
      default:
        return (
          <>
            <Animated.View style={[styles.card, { opacity: pulseAnim, height: 160 }]} />
            <View style={styles.row}>
              <Animated.View style={[styles.card, { opacity: pulseAnim, flex: 1, height: 120 }]} />
              <Animated.View style={[styles.card, { opacity: pulseAnim, flex: 1, height: 120 }]} />
            </View>
            <Animated.View style={[styles.card, { opacity: pulseAnim, height: 250 }]} />
          </>
        );
    }
  };

  return <View style={styles.container}>{renderLayout()}</View>;
};

const getStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 16,
    backgroundColor: colors.background,
  },
  row: {
    flexDirection: 'row',
    gap: 16,
  },
  card: {
    backgroundColor: '#E5E7EB',
    borderRadius: 24,
  }
});

export default SkeletonScreen;
