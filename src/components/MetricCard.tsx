import React from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import colors from '../constants/colors';

interface MetricCardProps {
  title: string;
  value: string;
  badgeText: string;
  badgeType: 'positive' | 'negative';
  icon: React.ReactNode;
  activeColor: string;
  fadeAnim: Animated.Value;
  barAnim: Animated.Value;
  activeFlex: number;
  onPress?: () => void;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  badgeText,
  badgeType,
  icon,
  activeColor,
  fadeAnim,
  barAnim,
  activeFlex,
  onPress,
}) => {
  return (
    <Animated.View style={[styles.metricCard, { opacity: fadeAnim }]}>
      <TouchableOpacity activeOpacity={0.8} style={styles.touchableArea} onPress={onPress}>
      <View style={styles.cardHeaderRow}>
        {icon}
        <Text style={styles.cardLabel}>{title}</Text>
      </View>
      <View style={styles.cardValueRow}>
        <Text style={styles.cardValue}>{value}</Text>
        <Text style={badgeType === 'positive' ? styles.greenBadge : styles.redBadge}>
          {badgeText}
        </Text>
      </View>
      <Animated.View style={[styles.progressContainer, { opacity: barAnim }]}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              flex: barAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.0001, activeFlex],
              }),
              backgroundColor: activeColor,
            },
          ]}
        />
        <View style={[styles.progressDot, { backgroundColor: colors.progressDot }]} />
        <Animated.View
          style={[
            styles.progressBar,
            {
              flex: barAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.9499, 0.95 - activeFlex],
              }),
              backgroundColor: colors.progressInactive,
            },
          ]}
        />
      </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  metricCard: {
    flex: 1,
    backgroundColor: colors.cardBackground,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  touchableArea: {
    padding: 16,
    flex: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  cardValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginBottom: 14,
  },
  cardValue: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  greenBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.success,
  },
  redBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.danger,
  },
  progressContainer: {
    height: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
  },
  progressDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});

export default MetricCard;
