import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Dimensions, TouchableOpacity, Easing } from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import colors from '../constants/colors';
import { ChevronDownIcon, FilterIcon, TrendUpIcon, EyeIcon, UsersIcon, WarningTriangleIcon, CalendarIcon, CheckCircleIcon } from '../components/icons/Icons';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 52) / 2; // Fixed math so cards fit 2 per row!

// Animated SVG Components
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedRect = Animated.createAnimatedComponent(Rect);

const RevenueForecastScreen = () => {
  const { t } = useTranslation();
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const chartProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(fadeAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(chartProgress, {
        toValue: 1,
        duration: 1500,
        delay: 150,
        easing: Easing.bezier(0.25, 1, 0.5, 1), // Very smooth ease-out curve
        useNativeDriver: false,
      }),
    ]).start();
  }, [fadeAnim, slideAnim, chartProgress]);

  // Interpolations
  const arcOffset = chartProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [503, 408.76], // Circumference is 503, draw up to the dot
  });

  const barWidthInterpolate = chartProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '70%'],
  });

  const churnWidthInterpolate = chartProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '65%'],
  });
  
  const curveOffset = chartProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [400, 0],
  });

  const NUM_STEPS = 30;
  const inputRange = [];
  const dotCxOutput = [];
  const dotCyOutput = [];
  
  for (let i = 0; i <= NUM_STEPS; i++) {
    const p = i / NUM_STEPS;
    inputRange.push(p);
    const angle = Math.PI + p * 1.1781; // 180 deg to 247.5 deg
    dotCxOutput.push(90 + 80 * Math.cos(angle));
    dotCyOutput.push(90 + 80 * Math.sin(angle));
  }

  const dotCx = chartProgress.interpolate({
    inputRange,
    outputRange: dotCxOutput,
  });

  const dotCy = chartProgress.interpolate({
    inputRange,
    outputRange: dotCyOutput,
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      
      {/* Sub Header */}
      <Animated.View style={[styles.subHeader, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <TouchableOpacity style={styles.dropdownButton}>
          <Text style={styles.dropdownText}>{t('dashboard.overview')}</Text>
          <ChevronDownIcon size={16} color={colors.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <FilterIcon size={16} color={colors.textSecondary} />
        </TouchableOpacity>
      </Animated.View>

      {/* Grid Layout */}
      <View style={styles.grid}>
        {/* 90-Day Projection */}
        <Animated.View style={[styles.card, styles.smallCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.cardHeader}>
            <TrendUpIcon size={14} color={colors.textSecondary} />
            <Text style={styles.cardTitle}>{t('forecast.projection90Day')}</Text>
          </View>
          <View style={styles.valueRow}>
            <Text style={styles.cardValue}>$140,250</Text>
            <Text style={styles.positiveChange}>+8%</Text>
          </View>
          
          <View style={[StyleSheet.absoluteFill, { overflow: 'hidden', borderRadius: 24 }]}>
            <View style={styles.arcContainer}>
              <Svg width="90" height="90" viewBox="0 0 90 90">
                <Circle
                  cx="90"
                  cy="90"
                  r="80"
                  stroke={colors.border}
                  strokeWidth="2"
                  fill="none"
                />
                <AnimatedCircle
                  cx="90"
                  cy="90"
                  r="80"
                  stroke={colors.limeAccent}
                  strokeWidth="2.5"
                  fill="none"
                  strokeDasharray="503"
                  strokeDashoffset={arcOffset}
                  strokeLinecap="round"
                  origin="90, 90"
                  rotation="180"
                />
                <AnimatedCircle
                  cx={dotCx}
                  cy={dotCy}
                  r="3.5"
                  fill={colors.limeAccent}
                  opacity={chartProgress}
                />
              </Svg>
            </View>
          </View>
        </Animated.View>

        {/* Recurring Revenue */}
        <Animated.View style={[styles.card, styles.smallCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.cardHeader}>
            <EyeIcon size={14} color={colors.textSecondary} />
            <Text style={styles.cardTitle}>{t('forecast.recurringRevenue')}</Text>
          </View>
          <View style={styles.valueRow}>
            <Text style={styles.cardValue}>$91,000</Text>
            <Text style={styles.negativeChange}>-6%</Text>
          </View>
          <View style={styles.horizontalBarContainer}>
            <View style={styles.barTrack}>
              <Animated.View style={[styles.barFill, { width: barWidthInterpolate }]}>
                 <View style={styles.barSeparator} />
              </Animated.View>
            </View>
          </View>
        </Animated.View>

        {/* New Customers */}
        <Animated.View style={[styles.card, styles.smallCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.cardHeader}>
            <UsersIcon size={14} color={colors.textSecondary} />
            <Text style={styles.cardTitle}>{t('forecast.newCustomers')}</Text>
          </View>
          <View style={styles.valueRow}>
            <Text style={styles.cardValue}>+128</Text>
            <Text style={styles.positiveChange}>+8%</Text>
          </View>
          <View style={styles.miniHistogram}>
            {[30, 50, 40, 70, 20, 60, 80, 50, 90, 40, 60].map((h, i) => (
              <Animated.View 
                key={i} 
                style={[
                  styles.miniBar, 
                  { 
                    height: chartProgress.interpolate({ inputRange: [0, 1], outputRange: [0, h * 0.4] }),
                    backgroundColor: i === 3 || i === 8 ? colors.limeAccent : (i % 2 === 0 ? colors.border : '#E0E0E0') 
                  }
                ]} 
              />
            ))}
          </View>
        </Animated.View>

        {/* Closed Won */}
        <Animated.View style={[styles.card, styles.smallCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.cardHeader}>
            <CheckCircleIcon size={14} color={colors.textSecondary} />
            <Text style={styles.cardTitle}>{t('forecast.closedWon')}</Text>
          </View>
          <View style={styles.valueRow}>
            <Text style={styles.cardValue}>42</Text>
            <Text style={styles.positiveChange}>+12%</Text>
          </View>
          <View style={styles.churnBarContainer}>
             <View style={styles.churnLabels}>
               <Text style={styles.churnLabelText}>Improvement</Text>
               <Text style={styles.churnLabelText}>Risk</Text>
             </View>
             <View style={styles.churnTrack}>
               <Animated.View style={[styles.churnFill, { width: churnWidthInterpolate }]} />
             </View>
          </View>
        </Animated.View>
      </View>

      {/* Revenue Growth Large Chart */}
      <Animated.View style={[styles.card, styles.largeCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
         <View style={styles.largeCardHeader}>
            <View>
              <View style={styles.cardHeader}>
                <TrendUpIcon size={14} color={colors.textSecondary} />
                <Text style={styles.cardTitle}>{t('dashboard.revenueGrowth', 'Revenue growth')}</Text>
              </View>
              <Text style={[styles.cardValue, { fontSize: 28, marginTop: 4 }]}>$12.5M</Text>
            </View>
            <TouchableOpacity style={styles.iconButton}>
              <CalendarIcon size={18} color={colors.textSecondary} />
            </TouchableOpacity>
         </View>

         <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={{ paddingRight: 20 }}
            style={{ width: '100%' }}
         >
           <View style={{ width: 550 }}>
             <View style={styles.mainChartContainer}>
                <Svg width="100%" height="200" viewBox="0 0 550 200">
                   {/* Background Histogram Bars */}
                   {Array.from({ length: 45 }).map((_, i) => {
                     const h = 20 + Math.random() * 120;
                     const isCenter = i > 15 && i < 25;
                     return (
                       <AnimatedRect
                         key={i}
                         x={i * 12}
                         y={200 - h}
                         width="6"
                         height={chartProgress.interpolate({ inputRange: [0, 1], outputRange: [0, h] })}
                         fill={isCenter ? '#000000' : colors.progressInactive}
                         rx="3"
                       />
                     )
                   })}

                   {/* Smooth Curved Line */}
                   <AnimatedPath
                     d="M 0 160 Q 140 160 210 120 T 450 150 Q 510 150 550 140"
                     stroke={colors.primary}
                     strokeWidth="3"
                     fill="none"
                     strokeDasharray="600"
                     strokeDashoffset={curveOffset}
                   />

                   {/* Highlight Dot */}
                   <AnimatedCircle
                     cx="245"
                     cy="125"
                     r="6"
                     fill={colors.limeAccent}
                     opacity={chartProgress}
                   />
                </Svg>

                {/* Tooltip Badge */}
                <Animated.View style={[styles.tooltip, { opacity: chartProgress, transform: [{ translateY: chartProgress.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }] }]}>
                   <View style={styles.tooltipRow}>
                     <Text style={styles.tooltipValue}>$30K</Text>
                     <View style={styles.tooltipBadge}>
                       <Text style={styles.tooltipBadgeText}>+33%</Text>
                     </View>
                   </View>
                   <Text style={styles.tooltipDesc}>{t('forecast.increasedThisMonth', 'Increased this month')}</Text>
                </Animated.View>
             </View>

             <View style={styles.xLabels}>
               <Text style={styles.xLabelText}>{t('forecast.week1', 'Week 1')}</Text>
               <Text style={styles.xLabelText}>{t('forecast.week2', 'Week 2')}</Text>
               <Text style={styles.xLabelText}>{t('forecast.week3', 'Week 3')}</Text>
             </View>
           </View>
         </ScrollView>
      </Animated.View>
      
      {/* Spacer for bottom nav */}
      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 20,
  },
  mainHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '400',
    color: colors.textPrimary,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButtonSmall: {
    width: 36,
    height: 36,
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    position: 'relative',
  },
  notificationDot: {
    width: 6,
    height: 6,
    backgroundColor: colors.notificationDot,
    borderRadius: 3,
    position: 'absolute',
    top: 8,
    right: 10,
  },
  subHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    gap: 6,
  },
  dropdownText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  filterButton: {
    width: 40,
    height: 40,
    backgroundColor: colors.cardBackground,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 24,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 12,
  },
  smallCard: {
    width: CARD_WIDTH,
    minHeight: 130,
  },
  largeCard: {
    width: '100%',
    padding: 24,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardValue: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  positiveChange: {
    fontSize: 11,
    fontWeight: '700',
    color: '#34C759',
  },
  negativeChange: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FF3B30',
  },
  arcContainer: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    width: 90,
    height: 90,
  },
  horizontalBarContainer: {
    marginTop: 24,
  },
  barTrack: {
    height: 12,
    backgroundColor: colors.progressInactive,
    borderRadius: 6,
    width: '100%',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: colors.limeAccent,
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  barSeparator: {
    width: 3,
    height: '100%',
    backgroundColor: colors.primary,
  },
  miniHistogram: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 30,
    marginTop: 16,
    paddingHorizontal: 4,
  },
  miniBar: {
    width: 3,
    borderRadius: 1.5,
  },
  churnBarContainer: {
    marginTop: 16,
  },
  churnLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  churnLabelText: {
    fontSize: 9,
    color: colors.textMuted,
    fontWeight: '600',
  },
  churnTrack: {
    height: 6,
    backgroundColor: colors.progressInactive,
    borderRadius: 3,
    width: '100%',
  },
  churnFill: {
    height: '100%',
    backgroundColor: colors.limeAccent,
    borderRadius: 3,
  },
  largeCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainChartContainer: {
    height: 200,
    width: '100%',
    position: 'relative',
    marginTop: 10,
  },
  tooltip: {
    position: 'absolute',
    top: 100,
    left: 110,
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tooltipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  tooltipValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  tooltipBadge: {
    backgroundColor: colors.limeAccent,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tooltipBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary,
  },
  tooltipDesc: {
    fontSize: 10,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  xLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingHorizontal: 10,
  },
  xLabelText: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '500',
  },
});

export default RevenueForecastScreen;
