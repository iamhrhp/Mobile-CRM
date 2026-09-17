import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, TouchableOpacity } from 'react-native';
import Svg, { Path, G, Circle, Text as SvgText, Line } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { ThemeColors } from '../constants/colors';
import TimeFilter from '../components/TimeFilter';

const PIE_DATA = [
  { label: 'Partners', value: 154768, color: '#FF7F50' },
  { label: 'Referrals', value: 1234345, color: '#4BA3E3' },
  { label: 'Google adwords', value: 9874135, color: '#F75B8B' },
  { label: 'Organic', value: 3100000, color: '#00C896' },
  { label: 'Social', value: 2000000, color: '#9B51E0' }
];

const PIE_DATA_YEAR = [
  { label: 'Partners', value: 1850000, color: '#FF7F50' },
  { label: 'Referrals', value: 14800000, color: '#4BA3E3' },
  { label: 'Google adwords', value: 118400000, color: '#F75B8B' },
  { label: 'Organic', value: 37200000, color: '#00C896' },
  { label: 'Social', value: 24000000, color: '#9B51E0' }
];

const LINE_DATA = [4, 1.5, 2.5, 1, 2.5, 9, 10, 6, 14.5];
const LINE_DATA_YEAR = [2, 3, 5, 4, 8, 12, 11, 13, 15, 14, 14.5, 15];

const LINE_DATA_2 = [3, 2.5, 3.5, 2, 4.5, 7, 8, 5, 12];
const LINE_DATA_YEAR_2 = [1, 2, 3, 3, 5, 8, 9, 10, 12, 11, 12, 13];

// Helper to calculate SVG arcs for pie chart
const createPieChartArcs = (data: typeof PIE_DATA, radius: number) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = -Math.PI / 2; // Start at top

  return data.map(item => {
    const angle = (item.value / total) * 2 * Math.PI;
    const startX = radius + radius * Math.cos(currentAngle);
    const startY = radius + radius * Math.sin(currentAngle);
    
    currentAngle += angle;
    
    const endX = radius + radius * Math.cos(currentAngle);
    const endY = radius + radius * Math.sin(currentAngle);
    
    const largeArcFlag = angle > Math.PI ? 1 : 0;
    
    // SVG Path for slice
    const d = `
      M ${radius} ${radius}
      L ${startX} ${startY}
      A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}
      Z
    `;
    
    return { ...item, d, midAngle: currentAngle - angle/2 };
  });
};

// Helper for smooth bezier line chart
const createSmoothLine = (data: number[], width: number, height: number) => {
  const max = 15;
  const paddingX = 10;
  const paddingY = 20;
  
  const points = data.map((val, i) => {
    const x = paddingX + (i * ((width - paddingX * 2) / (data.length - 1)));
    const y = height - paddingY - (val / max) * (height - paddingY * 2);
    return { x, y };
  });

  let d = `M ${points[0].x} ${points[0].y}`;
  
  for (let i = 0; i < points.length - 1; i++) {
    const curr = points[i];
    const next = points[i + 1];
    
    // Control points for smooth bezier
    const cp1x = curr.x + (next.x - curr.x) / 3;
    const cp1y = curr.y;
    const cp2x = curr.x + 2 * (next.x - curr.x) / 3;
    const cp2y = next.y;
    
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
  }
  
  return { path: d, points };
};

const RevenueGrowthScreen = () => {
  const { t } = useTranslation();
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors, isDark);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const chartAnim = useRef(new Animated.Value(1)).current;
  const [selectedMonth, setSelectedMonth] = useState('Aug');
  const [selectedYear, setSelectedYear] = useState('2024');

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    chartAnim.setValue(0);
    Animated.timing(chartAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: false, // width animation requires false
    }).start();
  }, [selectedMonth, selectedYear]);

  const isCurrentYear = selectedYear === '2024';
  const monthIndex = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(selectedMonth);
  const dataModifier = selectedMonth === 'All' ? 1.0 : 1 + (monthIndex - 7) * 0.1; // Aug is index 7

  const currentPieData = (isCurrentYear ? PIE_DATA : PIE_DATA_YEAR).map(item => ({
    ...item,
    value: item.value * dataModifier
  }));

  const currentLineData = (isCurrentYear ? LINE_DATA : LINE_DATA_YEAR).map(val => val * dataModifier);
  const currentLineData2 = (isCurrentYear ? LINE_DATA_2 : LINE_DATA_YEAR_2).map(val => val * dataModifier);

  const pieRadius = 80;
  const pieArcs = createPieChartArcs(currentPieData, pieRadius);
  
  const chartWidth = 320;
  const chartHeight = 180;
  const lineChart = createSmoothLine(currentLineData, chartWidth, chartHeight);
  const lineChart2 = createSmoothLine(currentLineData2, chartWidth, chartHeight);

  return (
    <Animated.ScrollView
      style={[styles.container, { opacity: fadeAnim }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <TimeFilter 
        selectedMonth={selectedMonth} 
        onMonthChange={setSelectedMonth} 
        selectedYear={selectedYear} 
        onYearChange={setSelectedYear} 
      />

      {/* Card 1: This month sales */}
      <View style={styles.card}>
        <Animated.View style={{ 
          opacity: chartAnim, 
          transform: [{ translateY: chartAnim.interpolate({ inputRange: [0, 1], outputRange: [15, 0] }) }] 
        }}>
          <Text style={styles.cardTitle}>{selectedMonth === 'All' ? `${selectedYear} Total` : `${t(`timeFilter.months.${selectedMonth}`, selectedMonth)} ${selectedYear}`} {t('revenue.sales', 'sales')}</Text>
          <View style={styles.salesRow}>
            <Text style={styles.salesBig}>
              {isCurrentYear ? '$ 6,254,490' : '$ 75,053,880'}
            </Text>
            <View style={styles.trendPill}>
              <Text style={styles.trendArrow}>▼</Text>
              <Text style={styles.trendText}>10%</Text>
            </View>
            <View style={{ flex: 1 }} />
            <Text style={styles.lastMonthText}>
              {t('revenue.previous', 'Previous')} : {isCurrentYear ? '$ 5,685,960' : '$ 68,230,000'}
            </Text>
          </View>
        </Animated.View>
      </View>

      {/* Card 2: Revenue by lead source */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{t('revenue.revenueByLeadSource', 'Revenue by lead source')}</Text>
        
        <View style={styles.pieContainer}>
          <Animated.View style={{ 
            opacity: chartAnim, 
            transform: [{ scale: chartAnim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) }] 
          }}>
            <Svg width={pieRadius * 2} height={pieRadius * 2}>
              {pieArcs.map((arc, i) => (
                <Path key={i} d={arc.d} fill={arc.color} />
              ))}
              <AnimatedCircle
                cx={pieRadius}
                cy={pieRadius}
                r={pieRadius / 2}
                fill="none"
                stroke={colors.cardBackground}
                strokeWidth={pieRadius + 2}
                strokeDasharray={2 * Math.PI * (pieRadius / 2)}
                strokeDashoffset={chartAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -(2 * Math.PI * (pieRadius / 2))]
                })}
                originX={pieRadius}
                originY={pieRadius}
                rotation="-90"
              />
            </Svg>
          </Animated.View>
        </View>
          
          {/* Tooltip mockup for Partners slice */}
          <View style={styles.tooltip}>
            <View style={styles.tooltipHeader}>
              <View style={[styles.legendDot, { backgroundColor: '#FF7F50' }]} />
              <Text style={styles.tooltipLabel}>{t('users.sourceTags.Partners', 'Partners')}</Text>
            </View>
            <Text style={styles.tooltipValue}>
              {isCurrentYear ? '$ 154,768' : '$ 1,850,000'}
            </Text>
          </View>

        <View style={styles.legendContainer}>
          {currentPieData.slice(0, 3).map((item, i) => (
            <View key={i} style={styles.legendItem}>
              <View style={styles.legendHeader}>
                <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                <Text style={styles.legendLabel}>{t(`users.sourceTags.${item.label.replace(' ', '')}`, item.label)}</Text>
              </View>
              <Text style={styles.legendValue}>${Math.round(item.value).toLocaleString()}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Card 3: Lead Conversion */}
      <View style={styles.card}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <Text style={[styles.cardTitle, { marginBottom: 0 }]}>{t('revenue.leadConversion', 'Lead Conversion')}</Text>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#26C6DA', marginRight: 4 }} />
              <Text style={{ fontSize: 10, color: colors.textMuted }}>{t('revenue.current', 'Current')}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#FF7F50', marginRight: 4 }} />
              <Text style={{ fontSize: 10, color: colors.textMuted }}>{t('revenue.previous', 'Previous')}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.lineChartContainer}>
          <Animated.View style={{ 
            width: chartAnim.interpolate({ inputRange: [0, 1], outputRange: [0, chartWidth] }), 
            overflow: 'hidden' 
          }}>
            <Svg width={chartWidth} height={chartHeight}>
            {/* Grid Lines */}
            {[15, 12.5, 10, 7.5, 5, 2.5].map((val, i) => {
              const y = 20 + (i * ((chartHeight - 40) / 5));
              return (
                <G key={i}>
                  <Line x1="30" y1={y} x2={chartWidth} y2={y} stroke={colors.border} strokeWidth="1" />
                  <SvgText x="25" y={y + 4} fontSize="10" fill={colors.textMuted} textAnchor="end">{val}</SvgText>
                </G>
              );
            })}
            
            {/* First Line */}
            <Path d={lineChart.path} fill="none" stroke="#26C6DA" strokeWidth="2" />
            {lineChart.points.map((p, i) => (
              <Circle key={i} cx={p.x} cy={p.y} r="3" fill="#26C6DA" stroke={colors.cardBackground} strokeWidth="1.5" />
            ))}

            {/* Second Line */}
            <Path d={lineChart2.path} fill="none" stroke="#FF7F50" strokeWidth="2" strokeDasharray="4,4" />
            {lineChart2.points.map((p, i) => (
              <Circle key={i} cx={p.x} cy={p.y} r="3" fill="#FF7F50" stroke={colors.cardBackground} strokeWidth="1.5" />
            ))}
          </Svg>
        </Animated.View>
      </View>
    </View>
      
      {/* Card 4: Duplicate This month sales (as in mockup) */}
      <View style={styles.card}>
        <Animated.View style={{ 
          opacity: chartAnim, 
          transform: [{ translateY: chartAnim.interpolate({ inputRange: [0, 1], outputRange: [15, 0] }) }] 
        }}>
          <Text style={styles.cardTitle}>{selectedMonth === 'All' ? `${selectedYear} Total` : `${t(`timeFilter.months.${selectedMonth}`, selectedMonth)} ${selectedYear}`} {t('revenue.sales', 'sales')}</Text>
          <View style={styles.salesRow}>
            <Text style={styles.salesBig}>
              {isCurrentYear ? '$ 6,254,490' : '$ 75,053,880'}
            </Text>
            <View style={styles.trendPill}>
              <Text style={styles.trendArrow}>▼</Text>
              <Text style={styles.trendText}>10%</Text>
            </View>
            <View style={{ flex: 1 }} />
            <Text style={styles.lastMonthText}>
              {t('revenue.previous', 'Previous')} : {isCurrentYear ? '$ 5,685,960' : '$ 68,230,000'}
            </Text>
          </View>
        </Animated.View>
      </View>

    </Animated.ScrollView>
  );
};

const getStyles = (colors: ThemeColors, isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: isDark ? 1 : 0,
    borderColor: colors.border,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  salesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  salesBig: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.textPrimary,
    marginRight: 8,
  },
  trendPill: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendArrow: {
    color: colors.danger,
    fontSize: 12,
    marginRight: 2,
  },
  trendText: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  lastMonthText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  pieContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
    position: 'relative',
  },
  tooltip: {
    position: 'absolute',
    top: 10,
    right: 20,
    backgroundColor: colors.cardBackground,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF7F50',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  tooltipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  tooltipLabel: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  tooltipValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  legendItem: {
    alignItems: 'flex-start',
  },
  legendHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  legendLabel: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  legendValue: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  lineChartContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginLeft: -10,
  }
});

export default RevenueGrowthScreen;
