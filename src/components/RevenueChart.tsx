import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import colors, { ThemeColors } from '../constants/colors';
import { useTheme } from '../context/ThemeContext';
import { TrendingIcon, CalendarIcon, XIcon } from './icons/Icons';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../hooks/useCurrency';

interface RevenueChartProps {
  barAnim: Animated.Value;
  onPress?: () => void;
}

const RevenueChart: React.FC<RevenueChartProps> = ({ barAnim, onPress }) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const { t } = useTranslation();
  const currency = useCurrency();
  const [isTooltipVisible, setIsTooltipVisible] = useState(true);
  const scrollViewRef = useRef<any>(null);

  useEffect(() => {
    // Auto-scroll to show the tooltip (around May/Jun)
    setTimeout(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ x: 200, animated: true });
      }
    }, 800);
  }, []);

  const yTicks = ['150k', '50k', '30k', '20k', '0k'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Generate 48 random-ish bar heights for 12 months (4 weeks each)
  const barHeights = [
    25, 40, 30, 45,  35, 50, 40, 60,  55, 45, 65, 50, // Jan-Mar
    45, 70, 50, 60,  25, 60, 20, 85,  35, 25, 75, 45, // Apr-Jun (Current snapshot in middle)
    55, 95, 30, 40,  60, 50, 75, 55,  70, 85, 65, 90, // Jul-Sep
    80, 100, 70, 85, 95, 80, 110, 90, 100, 115, 95, 120 // Oct-Dec
  ];

  return (
    <View style={styles.revenueCard}>
      {/* Card Top Header - Now clickable instead of whole card */}
      <TouchableOpacity activeOpacity={0.7} style={styles.revenueCardHeader} onPress={onPress}>
        <View style={styles.revenueTitleRow}>
          <TrendingIcon size={16} color={colors.textSecondary} />
          <Text style={styles.revenueLabel}>{t('dashboard.revenueGrowth')}</Text>
        </View>
        <View style={styles.calendarBtn}>
          <CalendarIcon size={16} color={colors.textSecondary} />
        </View>
      </TouchableOpacity>

      <Text style={styles.revenueAmount}>{currency}12.5M</Text>

      {/* Chart Container */}
      <View style={styles.chartWrapper}>
        {/* Y-Axis Column */}
        <View style={styles.yAxisColumn}>
          {yTicks.map((tick, index) => (
            <Text key={index} style={styles.yTickText}>{tick}</Text>
          ))}
        </View>

        {/* Grid & Bars Area */}
        <View style={styles.chartMainArea}>
          {/* Horizontal Gridlines (Fixed behind) */}
          {yTicks.map((_, index) => (
            <View
              key={index}
              style={[
                styles.gridLine,
                { top: index * 26 + 8 }
              ]}
            />
          ))}

          {/* Scrollable Chart Content */}
          <ScrollView 
             ref={scrollViewRef} 
             horizontal 
             showsHorizontalScrollIndicator={false} 
             style={styles.chartScroll}
             onScrollBeginDrag={() => setIsTooltipVisible(false)}
             scrollEventThrottle={16}
          >
            <View style={styles.scrollContentContainer}>
               {/* Bar Chart Columns */}
               <View style={styles.barsRow}>
                 {barHeights.map((h, i) => (
                   <View key={i} style={styles.barColumnContainer}>
                     <Animated.View
                       style={[
                         styles.chartBar,
                         { 
                           height: barAnim.interpolate({
                             inputRange: [0, 1],
                             outputRange: [0, h]
                           }) 
                         },
                         i === 19 && styles.activeChartBar // Highlight 3rd week of May
                       ]}
                     />
                   </View>
                 ))}
               </View>

               {/* X-Axis Labels */}
               <View style={styles.xAxisRow}>
                 {months.map((month, idx) => (
                   <View key={idx} style={styles.monthLabelContainer}>
                     <Text style={styles.xTickText}>{month}</Text>
                   </View>
                 ))}
               </View>
            </View>
          </ScrollView>

          {/* Interactive Tooltip Card (Centered over graph viewport) */}
          {isTooltipVisible && (
            <View style={[styles.tooltipCard, { left: '12%' }]}> 
              <View style={styles.tooltipHeaderRow}>
                <View style={styles.tooltipValueRow}>
                  <Text style={styles.tooltipValue}>{currency}30K</Text>
                  <View style={styles.tooltipBadge}>
                    <Text style={styles.tooltipBadgeText}>+33%</Text>
                  </View>
                </View>
                <TouchableOpacity activeOpacity={0.7} onPress={() => setIsTooltipVisible(false)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <XIcon size={10} color={colors.textMuted} />
                </TouchableOpacity>
              </View>
              <Text style={styles.tooltipSubtext}>{t('dashboard.growthHalfYear', 'Growth to end the half-year')}</Text>
              
              {/* Scrubber / Tick slider at bottom */}
              <View style={styles.scrubberRow}>
                <View style={styles.ticksContainer}>
                  {Array.from({ length: 18 }).map((_, idx) => (
                    <View key={idx} style={styles.tickItem} />
                  ))}
                </View>
                <View style={styles.scrubberHandle} />
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const getStyles = (colors: ThemeColors) => StyleSheet.create({
  revenueCard: {
    marginHorizontal: 20,
    backgroundColor: colors.cardBackground,
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
  },
  revenueCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  revenueTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  revenueLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  calendarBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.secondaryBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  revenueAmount: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  chartWrapper: {
    flexDirection: 'row',
    height: 140,
    marginTop: 4,
  },
  yAxisColumn: {
    width: 38,
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  yTickText: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '500',
  },
  chartMainArea: {
    flex: 1,
    position: 'relative',
    justifyContent: 'flex-end',
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: colors.gridLine,
  },
  chartScroll: {
    flex: 1,
    marginLeft: 4,
  },
  scrollContentContainer: {
    paddingRight: 20,
    minWidth: 1000, // Ensure it's wide enough for all 12 months
  },
  barsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 4,
    height: 110,
    gap: 8, // 14 width + 8 gap = 22 per bar
  },
  barColumnContainer: {
    alignItems: 'center',
    width: 14,
    justifyContent: 'flex-end',
  },
  chartBar: {
    width: 3.5,
    backgroundColor: colors.chartBar,
    borderRadius: 2,
  },
  activeChartBar: {
    width: 4,
    backgroundColor: colors.chartBarActive,
  },
  tooltipCard: {
    position: 'absolute',
    bottom: 24,
    width: 220,
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  tooltipCloseBtn: {
    position: 'absolute',
    top: 8,
    right: 10,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  tooltipCloseText: {
    fontSize: 10,
    color: colors.textMuted,
  },
  tooltipHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  tooltipValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tooltipValue: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  tooltipBadge: {
    backgroundColor: colors.limeAccent,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  tooltipBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  tooltipSubtext: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: 8,
  },
  scrubberRow: {
    height: 16,
    backgroundColor: colors.secondaryBackground,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    justifyContent: 'space-between',
  },
  ticksContainer: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
    flex: 1,
  },
  tickItem: {
    width: 1.5,
    height: 6,
    backgroundColor: colors.tickItem,
    borderRadius: 1,
  },
  scrubberHandle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.limeAccent,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  xAxisRow: {
    flexDirection: 'row',
    marginTop: 10,
    paddingLeft: 4,
  },
  monthLabelContainer: {
    width: 88, // 4 bars * 22 total width
    alignItems: 'center',
  },
  xTickText: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '500',
  },
});

export default RevenueChart;
