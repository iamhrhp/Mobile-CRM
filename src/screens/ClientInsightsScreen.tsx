import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Dimensions, TouchableOpacity, Easing } from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient, Stop, Rect, Line } from 'react-native-svg';
import colors from '../constants/colors';
import { ChevronDownIcon, FilterIcon, UsersIcon, UserIcon, TrendUpIcon, CalendarIcon, XIcon } from '../components/icons/Icons';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 52) / 2;

const AnimatedRect = Animated.createAnimatedComponent(Rect);
const AnimatedLine = Animated.createAnimatedComponent(Line);

// Dummy data for the weekly chart (12 months * 4 weeks)
const chartData = [
  { ltv: 60, eng: 30 }, { ltv: 50, eng: 25 }, { ltv: 70, eng: 40 }, { ltv: 65, eng: 35 }, // Jan
  { ltv: 80, eng: 45 }, { ltv: 75, eng: 40 }, { ltv: 90, eng: 50 }, { ltv: 85, eng: 45 }, // Feb
  { ltv: 100, eng: 55 }, { ltv: 90, eng: 50 }, { ltv: 110, eng: 60 }, { ltv: 95, eng: 55 }, // Mar
  { ltv: 50, eng: 25 }, { ltv: 40, eng: 20 }, { ltv: 120, eng: 50 }, { ltv: 80, eng: 30 }, // Apr
  { ltv: 150, eng: 60 }, { ltv: 140, eng: 55 }, { ltv: 90, eng: 40 }, { ltv: 110, eng: 45 }, // May
  { ltv: 130, eng: 65 }, { ltv: 100, eng: 45 }, { ltv: 80, eng: 35 }, { ltv: 70, eng: 30 }, // Jun
  { ltv: 160, eng: 70 }, { ltv: 150, eng: 65 }, { ltv: 90, eng: 40 }, { ltv: 85, eng: 35 }, // July
  { ltv: 120, eng: 60 }, { ltv: 110, eng: 55 }, { ltv: 130, eng: 65 }, { ltv: 140, eng: 70 }, // Aug
  { ltv: 90, eng: 45 }, { ltv: 80, eng: 40 }, { ltv: 100, eng: 50 }, { ltv: 110, eng: 55 }, // Sep
  { ltv: 140, eng: 65 }, { ltv: 130, eng: 60 }, { ltv: 150, eng: 70 }, { ltv: 160, eng: 75 }, // Oct
  { ltv: 110, eng: 50 }, { ltv: 100, eng: 45 }, { ltv: 120, eng: 55 }, { ltv: 130, eng: 60 }, // Nov
  { ltv: 150, eng: 70 }, { ltv: 140, eng: 65 }, { ltv: 160, eng: 75 }, { ltv: 170, eng: 80 }, // Dec
];

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const CHART_WIDTH = chartData.length * 16.5 + 40; // Dynamic width based on data points

const ClientInsightsScreen = () => {
  const { t } = useTranslation();
  const [showTooltip, setShowTooltip] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const chartProgress = useRef(new Animated.Value(0)).current;
  
  // Ref for auto-scrolling to the tooltip region (May/Jun)
  const scrollViewRef = useRef<ScrollView>(null);

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
        easing: Easing.bezier(0.25, 1, 0.5, 1),
        useNativeDriver: false,
      }),
    ]).start(() => {
       // Scroll to the active region (April/May/Jun area) after animation
       if (scrollViewRef.current) {
          scrollViewRef.current.scrollTo({ x: 150, animated: true });
       }
    });
  }, []);

  const topBarWidth = chartProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '50%'],
  });

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      
      {/* Sub Header */}
      <Animated.View style={[styles.subHeader, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View style={{ flex: 1 }} />
        <TouchableOpacity style={styles.iconButton}>
          <FilterIcon size={16} color={colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.dropdownButton}>
          <Text style={styles.dropdownText}>{t('insights.thisWeek', 'This Week')}</Text>
          <ChevronDownIcon size={12} color={colors.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.dropdownButton}>
          <Text style={styles.dropdownText}>{t('insights.allRegions', 'All Regions')}</Text>
          <ChevronDownIcon size={12} color={colors.textPrimary} />
        </TouchableOpacity>
      </Animated.View>

      {/* Grid Layout */}
      <View style={styles.grid}>
        
        {/* Total Clients Card */}
        <Animated.View style={[styles.card, styles.smallCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.cardHeader}>
            <UsersIcon size={14} color={colors.textSecondary} />
            <Text style={styles.cardTitle}>{t('insights.totalClients', 'Total Clients')}</Text>
          </View>
          <View style={styles.valueRow}>
            <Text style={styles.cardValue}>12.8K</Text>
            <Text style={styles.positiveChange}>+8%</Text>
          </View>
          
          <View style={styles.progressBarContainer}>
            <View style={styles.progressTrack}>
              <Animated.View style={[styles.progressFill, { width: topBarWidth }]} />
              <View style={styles.progressThumb} />
            </View>
          </View>
        </Animated.View>

        {/* Active Clients Card */}
        <Animated.View style={[styles.card, styles.smallCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.cardHeader}>
            <UserIcon size={14} color={colors.textSecondary} />
            <Text style={styles.cardTitle}>Active Clients</Text>
          </View>
          <View style={styles.valueRow}>
            <Text style={styles.cardValue}>8.3K</Text>
            <Text style={styles.positiveChange}>+4%</Text>
          </View>

          <View style={styles.miniChartContainer}>
             <View style={styles.miniBars}>
                {[20, 45, 60, 30, 80, 50, 40, 20, 10, 60, 30, 45, 20].map((val, i) => (
                  <View key={i} style={styles.miniBarTrack}>
                     <Animated.View style={[styles.miniBarFill, { 
                        height: chartProgress.interpolate({
                           inputRange: [0, 1],
                           outputRange: ['0%', `${val}%`]
                        }),
                        backgroundColor: i === 4 || i === 5 || i === 9 ? colors.limeAccent : colors.border
                     }]} />
                  </View>
                ))}
             </View>
          </View>
        </Animated.View>
      </View>

      {/* Engagement vs Lifetime Value Large Card */}
      <Animated.View style={[styles.card, styles.largeCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.largeCardHeader}>
          <View style={styles.cardHeader}>
            <TrendUpIcon size={14} color={colors.textSecondary} />
            <Text style={styles.cardTitle}>Engagement vs Lifetime Value</Text>
          </View>
          <TouchableOpacity style={styles.calendarButton}>
            <CalendarIcon size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.largeValueRow}>
          <View style={styles.metricColumn}>
            <Text style={styles.metricLabel}>Enagagement</Text>
            <View style={styles.metricValueWrapper}>
              <Text style={styles.largeCardValue}>8.5%</Text>
              <View style={styles.badgeLime}>
                <Text style={styles.badgeLimeText}>+33%</Text>
              </View>
            </View>
          </View>

          <View style={styles.metricColumnRight}>
            <Text style={styles.metricLabel}>Lifetime Value</Text>
            <View style={styles.metricValueWrapper}>
              <Text style={styles.largeCardValue}>7.3%</Text>
              <View style={styles.badgeGrey}>
                <Text style={styles.badgeGreyText}>+37%</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Complex Chart Area */}
        <View style={styles.chartAreaWrapper}>
          
          {/* Y Axis Grid Lines & Labels (Fixed) */}
          <View style={styles.yAxisContainer}>
            {[
              { y: 170, label: '0' },
              { y: 130, label: '20k' },
              { y: 90, label: '30k' },
              { y: 50, label: '50k' },
              { y: 10, label: '150k' },
            ].map((grid, i) => (
              <Text key={i} style={[styles.yAxisText, { position: 'absolute', top: grid.y - 8, left: 0 }]}>
                {grid.label}
              </Text>
            ))}
          </View>

          {/* Scrollable Chart */}
          <ScrollView 
             horizontal 
             showsHorizontalScrollIndicator={false} 
             style={styles.chartScroll}
             ref={scrollViewRef}
             onScrollBeginDrag={() => setShowTooltip(false)}
             scrollEventThrottle={16}
          >
             <View style={styles.chartContainer}>
               <Svg width={CHART_WIDTH} height="200" viewBox={`0 0 ${CHART_WIDTH} 200`}>
                  
                  {/* Highlight Region Background (May to Jun - indices 16 to 23) */}
                  {/* Start X = 20 + 16*16.5 = 284, Width = 8*16.5 = 132 */}
                  <Rect x="274" y="20" width="132" height="150" fill={colors.background} rx="6" opacity="0.6" />
                  
                  {/* Highlight Region Bottom Bar */}
                  <Rect x="274" y="170" width="132" height="4" fill={colors.border} />
                  
                  {/* Highlight Region Dots */}
                  <Circle cx="274" cy="172" r="3" fill={colors.limeAccent} stroke="#fff" strokeWidth="1" />
                  <Circle cx="406" cy="172" r="3" fill={colors.limeAccent} stroke="#fff" strokeWidth="1" />

                  {/* Bars */}
                  {chartData.map((data, i) => {
                     const x = 20 + (i * 16.5);
                     const ltvHeight = (data.ltv / 160) * 160;
                     const engHeight = (data.eng / 160) * 160;

                     return (
                       <React.Fragment key={i}>
                         <AnimatedLine 
                            x1={x} y1="170" 
                            x2={x} y2={chartProgress.interpolate({
                               inputRange: [0, 1],
                               outputRange: [170, 170 - ltvHeight]
                            })}
                            stroke="#DCDFE4" strokeWidth="2" strokeLinecap="round" 
                         />
                         <AnimatedLine 
                            x1={x} y1="170" 
                            x2={x} y2={chartProgress.interpolate({
                               inputRange: [0, 1],
                               outputRange: [170, 170 - engHeight]
                            })}
                            stroke="#2B2D31" strokeWidth="2.5" strokeLinecap="round" 
                         />
                       </React.Fragment>
                     )
                  })}

               </Svg>

               {/* X Axis Labels */}
               {months.map((month, i) => {
                 const xPos = 20 + (i * 4 * 16.5) + (1.5 * 16.5) - 6; // Center label over the 4 weeks
                 return (
                   <Text key={i} style={[styles.xAxisText, { position: 'absolute', top: 185, left: xPos }]}>
                     {month}
                   </Text>
                 );
               })}

               {/* Floating Tooltip */}
               {showTooltip && (
                 <Animated.View style={[styles.tooltip, { opacity: chartProgress, left: 244 }]}>
                    <View style={styles.tooltipHeader}>
                      <View style={styles.tooltipValueRow}>
                        <Text style={styles.tooltipValue}>$12.2</Text>
                        <View style={styles.badgeLimeSmall}>
                          <Text style={styles.badgeLimeTextSmall}>+46%</Text>
                        </View>
                      </View>
                      <TouchableOpacity onPress={() => setShowTooltip(false)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                        <XIcon size={10} color={colors.textSecondary} />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.tooltipSubtext}>Growth to end the half-year</Text>
                 </Animated.View>
               )}
             </View>
          </ScrollView>
        </View>

      </Animated.View>
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
    paddingTop: 10,
    paddingBottom: 100,
  },
  subHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 20,
    gap: 8,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  dropdownText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 4,
  },
  smallCard: {
    width: CARD_WIDTH,
    padding: 20,
    minHeight: 140,
    justifyContent: 'space-between',
  },
  largeCard: {
    width: '100%',
    padding: 24,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  largeCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  calendarButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
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
  progressBarContainer: {
    height: 24,
    justifyContent: 'center',
  },
  progressTrack: {
    height: 6,
    backgroundColor: colors.progressInactive,
    borderRadius: 3,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.limeAccent,
    borderRadius: 3,
  },
  progressThumb: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.border,
    borderWidth: 2,
    borderColor: '#fff',
    marginLeft: -4,
  },
  miniChartContainer: {
    height: 30,
    justifyContent: 'flex-end',
  },
  miniBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: '100%',
    gap: 2,
  },
  miniBarTrack: {
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  miniBarFill: {
    width: 2,
    borderRadius: 1,
  },
  largeValueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  metricColumn: {
    flex: 1,
  },
  metricColumnRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  metricLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
    fontWeight: '500',
  },
  metricValueWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  largeCardValue: {
    fontSize: 28,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  badgeLime: {
    backgroundColor: colors.limeAccent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeLimeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#000',
  },
  badgeGrey: {
    backgroundColor: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeGreyText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  chartAreaWrapper: {
    flexDirection: 'row',
    height: 220,
    position: 'relative',
    marginLeft: -10, // Pull left slightly so Y axis fits
  },
  yAxisContainer: {
    width: 35,
    height: 200,
    position: 'relative',
    zIndex: 1, // Stay above scrollview
  },
  chartScroll: {
    flex: 1,
  },
  chartContainer: {
    height: 200, // Reduced from 220 so X-axis fits
    position: 'relative',
  },
  yAxisText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  xAxisText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  tooltip: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    width: 210,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  tooltipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  tooltipValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tooltipValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  badgeLimeSmall: {
    backgroundColor: colors.limeAccent,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeLimeTextSmall: {
    fontSize: 10,
    fontWeight: '700',
    color: '#000',
  },
  tooltipSubtext: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});

export default ClientInsightsScreen;
