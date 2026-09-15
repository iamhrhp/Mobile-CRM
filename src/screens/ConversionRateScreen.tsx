import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated } from 'react-native';
import Svg, { Path, G, Circle, Text as SvgText, Line } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { ThemeColors } from '../constants/colors';
import TimeFilter from '../components/TimeFilter';

const PIE_DATA = [
  { label: 'Referrals', value: 45, color: '#4BA3E3' },
  { label: 'Organic Search', value: 28, color: '#00C896' },
  { label: 'Outbound', value: 12, color: '#FF7F50' },
  { label: 'Direct', value: 15, color: '#9B51E0' }
];

const PIE_DATA_YEAR = [
  { label: 'Referrals', value: 38, color: '#4BA3E3' },
  { label: 'Organic Search', value: 32, color: '#00C896' },
  { label: 'Outbound', value: 18, color: '#FF7F50' },
  { label: 'Direct', value: 12, color: '#9B51E0' }
];

const LINE_DATA = [26.4, 28.1, 29.5, 30.2, 33.7, 32.5];
const LINE_DATA_YEAR = [18.2, 19.5, 21.0, 24.3, 27.5, 31.0, 32.5, 34.0, 31.5, 30.0, 33.5, 32.5];

const LINE_DATA_2 = [22.1, 25.4, 27.2, 28.5, 30.1, 29.8];
const LINE_DATA_YEAR_2 = [15.5, 17.2, 18.5, 21.0, 23.5, 28.0, 30.5, 31.0, 29.5, 28.0, 31.5, 29.5];

const createPieChartArcs = (data: typeof PIE_DATA, radius: number) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = -Math.PI / 2;

  return data.map(item => {
    const angle = (item.value / total) * 2 * Math.PI;
    const startX = radius + radius * Math.cos(currentAngle);
    const startY = radius + radius * Math.sin(currentAngle);
    
    currentAngle += angle;
    
    const endX = radius + radius * Math.cos(currentAngle);
    const endY = radius + radius * Math.sin(currentAngle);
    
    const largeArcFlag = angle > Math.PI ? 1 : 0;
    
    const d = `
      M ${radius} ${radius}
      L ${startX} ${startY}
      A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}
      Z
    `;
    
    return { ...item, d };
  });
};

const createSmoothLine = (data: number[], width: number, height: number) => {
  const max = 40;
  const min = 20;
  const paddingX = 10;
  const paddingY = 20;
  
  const points = data.map((val, i) => {
    const x = paddingX + (i * ((width - paddingX * 2) / (Math.max(data.length - 1, 1))));
    const y = height - paddingY - ((val - min) / (max - min)) * (height - paddingY * 2);
    return { x, y };
  });

  let d = `M ${points[0].x} ${points[0].y}`;
  
  for (let i = 0; i < points.length - 1; i++) {
    const curr = points[i];
    const next = points[i + 1];
    
    const cp1x = curr.x + (next.x - curr.x) / 3;
    const cp1y = curr.y;
    const cp2x = curr.x + 2 * (next.x - curr.x) / 3;
    const cp2y = next.y;
    
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
  }
  
  return { path: d, points };
};

const ConversionRateScreen = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const chartAnim = useRef(new Animated.Value(1)).current;
  const [selectedMonth, setSelectedMonth] = useState('Aug');
  const [selectedYear, setSelectedYear] = useState('2024');

  const isCurrentYear = selectedYear === '2024';
  const monthIndex = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(selectedMonth);
  const dataModifier = selectedMonth === 'All' ? 1.0 : 1 + (monthIndex - 7) * 0.1;

  const currentPieData = (isCurrentYear ? PIE_DATA : PIE_DATA_YEAR).map(item => ({
    ...item,
    value: item.value * dataModifier
  }));

  const currentLineData = (isCurrentYear ? LINE_DATA : LINE_DATA_YEAR).map(val => val * dataModifier);
  const currentLineData2 = (isCurrentYear ? LINE_DATA_2 : LINE_DATA_YEAR_2).map(val => val * dataModifier);

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
      useNativeDriver: false,
    }).start();
  }, [selectedMonth, selectedYear]);

  return (
    <Animated.ScrollView
      style={[styles.container, { opacity: fadeAnim }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <View style={styles.header}>
          <Text style={styles.subtitle}>{selectedMonth === 'All' ? `${selectedYear} Total` : `${selectedMonth} ${selectedYear}`}</Text>
        </View>

        <TimeFilter 
          selectedMonth={selectedMonth} 
          onMonthChange={setSelectedMonth} 
          selectedYear={selectedYear} 
          onYearChange={setSelectedYear} 
        />
      </View>

      <View style={styles.heroCard}>
        <Text style={styles.heroValue}>{isCurrentYear ? '32.5%' : '35.8%'}</Text>
        <View style={[styles.heroBadge, !isCurrentYear && { backgroundColor: '#E6F4EA' }]}>
          <Text style={[styles.heroBadgeText, !isCurrentYear && { color: colors.success }]}>
            {isCurrentYear ? '-1.2% vs previous' : '+4.5% vs previous'}
          </Text>
        </View>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBarFill, { width: isCurrentYear ? '32.5%' : '35.8%' }]} />
        </View>
      </View>

      <View style={styles.rowCards}>
        <View style={styles.halfCard}>
          <Text style={styles.cardSmallTitle}>Avg. Time to Convert</Text>
          <Text style={styles.cardLargeValue}>14<Text style={styles.cardUnit}> days</Text></Text>
          <Text style={styles.cardTrend}>+2 days vs last month</Text>
        </View>
        <View style={styles.halfCard}>
          <Text style={styles.cardSmallTitle}>Highest Converting</Text>
          <Text style={styles.cardLargeValue}>Tech</Text>
          <Text style={[styles.cardTrend, { color: colors.success }]}>48% win rate</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Conversion by Source</Text>
      <View style={styles.card}>
        <Animated.View style={{ 
          alignItems: 'center', marginVertical: 20, position: 'relative', 
          opacity: chartAnim, 
          transform: [{ scale: chartAnim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) }] 
        }}>
          <Svg width={160} height={160}>
            {createPieChartArcs(currentPieData, 80).map((arc, i) => (
              <Path key={i} d={arc.d} fill={arc.color} />
            ))}
            <AnimatedCircle
              cx={80}
              cy={80}
              r={40}
              fill="none"
              stroke={colors.cardBackground}
              strokeWidth={82}
              strokeDasharray={2 * Math.PI * 40}
              strokeDashoffset={chartAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -(2 * Math.PI * 40)]
              })}
              originX={80}
              originY={80}
              rotation="-90"
            />
          </Svg>

          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ alignItems: 'center', backgroundColor: colors.cardBackground, borderRadius: 40, width: 80, height: 80, justifyContent: 'center', shadowColor: '#000', shadowOffset: {width:0, height:2}, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 }}>
              <Text style={{ fontSize: 10, color: colors.textSecondary }}>Referrals</Text>
            </View>
            <Text style={{ fontSize: 14, fontWeight: '700', color: colors.textPrimary }}>
              {isCurrentYear ? '45%' : '38%'}
            </Text>
          </View>
        </Animated.View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, flexWrap: 'wrap', gap: 10 }}>
          {currentPieData.map((item, i) => (
            <View key={i} style={{ alignItems: 'flex-start', minWidth: '45%' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: item.color, marginRight: 6 }} />
                <Text style={{ fontSize: 10, color: colors.textSecondary }}>{item.label}</Text>
              </View>
              <Text style={{ fontSize: 12, fontWeight: '700', color: colors.textPrimary }}>{Math.round(item.value)}%</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, paddingHorizontal: 4 }}>
        <Text style={[styles.sectionTitle, { marginBottom: 0 }]}>{selectedMonth === 'All' ? 'Yearly' : `${selectedMonth}`} Trend</Text>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#26C6DA', marginRight: 4 }} />
            <Text style={{ fontSize: 10, color: colors.textMuted }}>Current</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#FF7F50', marginRight: 4 }} />
            <Text style={{ fontSize: 10, color: colors.textMuted }}>Previous</Text>
          </View>
        </View>
      </View>
      <View style={styles.card}>
        <View style={{ alignItems: 'center', marginTop: 10, marginLeft: -10 }}>
          <Animated.View style={{ 
            width: chartAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 300] }), 
            overflow: 'hidden' 
          }}>
            <Svg width={300} height={180}>
              {[40, 35, 30, 25, 20].map((val, i) => {
              const y = 20 + (i * (140 / 4));
              return (
                <G key={i}>
                  <Line x1="30" y1={y} x2={300} y2={y} stroke={colors.border} strokeWidth="1" />
                  <SvgText x="25" y={y + 4} fontSize="10" fill={colors.textMuted} textAnchor="end">{val}%</SvgText>
                </G>
              );
            })}
            
            {/* First Line */}
            <Path d={createSmoothLine(currentLineData, 300, 180).path} fill="none" stroke="#26C6DA" strokeWidth="2" />
            {createSmoothLine(currentLineData, 300, 180).points.map((p, i) => (
              <Circle key={i} cx={p.x} cy={p.y} r="3" fill="#26C6DA" stroke={colors.cardBackground} strokeWidth="1.5" />
            ))}

            {/* Second Line */}
            <Path d={createSmoothLine(currentLineData2, 300, 180).path} fill="none" stroke="#FF7F50" strokeWidth="2" strokeDasharray="4,4" />
            {createSmoothLine(currentLineData2, 300, 180).points.map((p, i) => (
              <Circle key={i} cx={p.x} cy={p.y} r="3" fill="#FF7F50" stroke={colors.cardBackground} strokeWidth="1.5" />
            ))}
            </Svg>
          </Animated.View>
        </View>
      </View>
    </Animated.ScrollView>
  );
};

const getStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 24,
    paddingBottom: 100,
  },
  header: {
    // marginBottom removed to allow side-by-side with toggle
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  heroCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  heroValue: {
    fontSize: 56,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  heroBadge: {
    backgroundColor: '#FFEBEB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 32,
  },
  heroBadgeText: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: '600',
  },
  progressBarContainer: {
    width: '100%',
    height: 12,
    backgroundColor: colors.border,
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 6,
  },
  rowCards: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  halfCard: {
    flex: 1,
    backgroundColor: colors.cardBackground,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  cardSmallTitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  cardLargeValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  cardUnit: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  cardTrend: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 20,
    padding: 24,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  sourceRow: {
    marginBottom: 20,
  },
  sourceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sourceName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  sourceRate: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
  },
  sourceBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  sourceBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  trendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  trendMonth: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  trendValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
});

export default ConversionRateScreen;
