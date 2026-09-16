import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Dimensions, TouchableOpacity, Easing, Modal, TouchableWithoutFeedback } from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient, Stop, Rect, Line } from 'react-native-svg';
import { ThemeColors } from '../constants/colors';
import { useTheme } from '../context/ThemeContext';
import { ChevronDownIcon, FilterIcon, TrendUpIcon, EyeIcon, UsersIcon, WarningTriangleIcon, CalendarIcon, CheckCircleIcon } from '../components/icons/Icons';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../hooks/useCurrency';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 52) / 2;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedRect = Animated.createAnimatedComponent(Rect);
const AnimatedLine = Animated.createAnimatedComponent(Line);

import { TabType } from '../components/BottomNavBar';

interface RevenueForecastScreenProps {
  onNavigate?: (tab: TabType) => void;
}

const TIME_OPTIONS = ['This Week', 'This Month', 'This Quarter', 'This Year', 'Last 6 Months', '2025', '2024', '2023'];
const REGION_OPTIONS = ['All Regions', 'North America', 'Europe', 'Asia Pacific', 'Middle East', 'Africa'];

const RevenueForecastScreen: React.FC<RevenueForecastScreenProps> = ({ onNavigate }) => {
  const { t } = useTranslation();
  const currency = useCurrency();
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors, isDark);
  
  const [selectedTime, setSelectedTime] = useState('This Year');
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterTime, setFilterTime] = useState('This Year');
  const [filterRegion, setFilterRegion] = useState('All Regions');

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const chartProgress = useRef(new Animated.Value(0)).current;

  const triggerAnimations = () => {
    fadeAnim.setValue(0);
    slideAnim.setValue(20);
    chartProgress.setValue(0);
    Animated.parallel([
      Animated.spring(fadeAnim, { toValue: 1, tension: 20, friction: 7, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 20, friction: 7, useNativeDriver: true }),
      Animated.timing(chartProgress, { toValue: 1, duration: 1500, delay: 150, easing: Easing.bezier(0.25, 1, 0.5, 1), useNativeDriver: false }),
    ]).start();
  };

  useEffect(() => {
    triggerAnimations();
  }, []);

  const arcOffset = chartProgress.interpolate({ inputRange: [0, 1], outputRange: [503, 408.76] });
  const barWidthInterpolate = chartProgress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '70%'] });
  const churnWidthInterpolate = chartProgress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '65%'] });
  const curveOffset = chartProgress.interpolate({ inputRange: [0, 1], outputRange: [400, 0] });

  const NUM_STEPS = 30;
  const inputRange = [];
  const dotCxOutput = [];
  const dotCyOutput = [];
  for (let i = 0; i <= NUM_STEPS; i++) {
    const p = i / NUM_STEPS;
    inputRange.push(p);
    const angle = Math.PI + p * 1.1781;
    dotCxOutput.push(90 + 80 * Math.cos(angle));
    dotCyOutput.push(90 + 80 * Math.sin(angle));
  }

  const dotCx = chartProgress.interpolate({ inputRange, outputRange: dotCxOutput });
  const dotCy = chartProgress.interpolate({ inputRange, outputRange: dotCyOutput });

  const applyFilter = () => {
    setSelectedTime(filterTime);
    setSelectedRegion(filterRegion);
    setShowFilterModal(false);
    
    // Retrigger animations
    triggerAnimations();
  };

  const openFilter = () => {
    setFilterTime(selectedTime);
    setFilterRegion(selectedRegion);
    setShowFilterModal(true);
  };

  const closeDropdowns = () => {
    setShowTimeDropdown(false);
    setShowRegionDropdown(false);
  };

  // Dummy dynamic data based on selection
  const multiplier = selectedTime === '2025' ? 1.2 : selectedTime === '2024' ? 1 : selectedTime === '2023' ? 0.8 : selectedTime === 'This Year' ? 1 : selectedTime === 'This Quarter' ? 0.25 : 0.08;
  const regionMultiplier = selectedRegion === 'All Regions' ? 1 : 0.4;
  const m = multiplier * regionMultiplier;

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Sub Header */}
        <Animated.View style={[styles.subHeader, { opacity: fadeAnim, transform: [{ translateY: slideAnim }], zIndex: 100 }]}>
          <View style={{ flex: 1 }} />
          <TouchableOpacity style={styles.iconButtonSmall} onPress={openFilter}>
            <FilterIcon size={16} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.dropdownButton, showTimeDropdown && styles.dropdownButtonActive]}
            onPress={() => { setShowRegionDropdown(false); setShowTimeDropdown(v => !v); }}
          >
            <Text style={styles.dropdownText}>{selectedTime}</Text>
            <ChevronDownIcon size={12} color={colors.textPrimary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.dropdownButton, showRegionDropdown && styles.dropdownButtonActive]}
            onPress={() => { setShowTimeDropdown(false); setShowRegionDropdown(v => !v); }}
          >
            <Text style={styles.dropdownText}>{selectedRegion}</Text>
            <ChevronDownIcon size={12} color={colors.textPrimary} />
          </TouchableOpacity>
        </Animated.View>

        {showTimeDropdown && (
          <View style={[styles.inlineDropdown, { top: 60, right: 130 }]}>
            {TIME_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt}
                style={[styles.dropdownOption, selectedTime === opt && styles.dropdownOptionSelected]}
                onPress={() => { 
                  setSelectedTime(opt); 
                  setFilterTime(opt); 
                  setShowTimeDropdown(false); 
                  triggerAnimations();
                }}
              >
                <Text style={[styles.dropdownOptionText, selectedTime === opt && styles.dropdownOptionTextSelected]}>{opt}</Text>
                {selectedTime === opt && <Text style={styles.checkmark}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {showRegionDropdown && (
          <View style={[styles.inlineDropdown, { top: 60, right: 20, width: 160 }]}>
            {REGION_OPTIONS.map(opt => (
              <TouchableOpacity
                key={opt}
                style={[styles.dropdownOption, selectedRegion === opt && styles.dropdownOptionSelected]}
                onPress={() => { 
                  setSelectedRegion(opt); 
                  setFilterRegion(opt); 
                  setShowRegionDropdown(false); 
                  triggerAnimations();
                }}
              >
                <Text style={[styles.dropdownOptionText, selectedRegion === opt && styles.dropdownOptionTextSelected]}>{opt}</Text>
                {selectedRegion === opt && <Text style={styles.checkmark}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Grid Layout */}
        <View style={styles.grid}>
          <Animated.View style={[styles.card, styles.smallCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <View style={styles.cardHeader}>
              <TrendUpIcon size={14} color={colors.textSecondary} />
              <Text style={styles.cardTitle}>{t('forecast.projection90Day')}</Text>
            </View>
            <View style={styles.valueRow}>
              <Text style={styles.cardValue}>{currency}{(140250 * m).toLocaleString(undefined, { maximumFractionDigits: 0 })}</Text>
              <Text style={styles.positiveChange}>+8%</Text>
            </View>
            
            <View style={[StyleSheet.absoluteFill, { overflow: 'hidden', borderRadius: 24 }]}>
              <View style={styles.arcContainer}>
                <Svg width="90" height="90" viewBox="0 0 90 90">
                  <Circle cx="90" cy="90" r="80" stroke={colors.border} strokeWidth="2" fill="none" />
                  <AnimatedCircle cx="90" cy="90" r="80" stroke={colors.limeAccent} strokeWidth="2.5" fill="none" strokeDasharray="503" strokeDashoffset={arcOffset} strokeLinecap="round" origin="90, 90" rotation="180" />
                  <AnimatedCircle cx={dotCx} cy={dotCy} r="3.5" fill={colors.limeAccent} opacity={chartProgress} />
                </Svg>
              </View>
            </View>
          </Animated.View>

          <Animated.View style={[styles.card, styles.smallCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <View style={styles.cardHeader}>
              <EyeIcon size={14} color={colors.textSecondary} />
              <Text style={styles.cardTitle}>{t('forecast.recurringRevenue')}</Text>
            </View>
            <View style={styles.valueRow}>
              <Text style={styles.cardValue}>{currency}{(91000 * m).toLocaleString(undefined, { maximumFractionDigits: 0 })}</Text>
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

          <Animated.View style={[styles.card, styles.smallCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <View style={styles.cardHeader}>
              <UsersIcon size={14} color={colors.textSecondary} />
              <Text style={styles.cardTitle}>{t('forecast.newCustomers')}</Text>
            </View>
            <View style={styles.valueRow}>
              <Text style={styles.cardValue}>+{Math.floor(128 * m)}</Text>
              <Text style={styles.positiveChange}>+8%</Text>
            </View>
            <View style={styles.miniHistogram}>
              {[30, 50, 40, 70, 20, 60, 80, 50, 90, 40, 60].map((h, i) => (
                <Animated.View key={i} style={[styles.miniBar, { height: chartProgress.interpolate({ inputRange: [0, 1], outputRange: [0, h * 0.4] }), backgroundColor: i === 3 || i === 8 ? colors.limeAccent : (i % 2 === 0 ? colors.border : '#E0E0E0') }]} />
              ))}
            </View>
          </Animated.View>

          <Animated.View style={[styles.card, styles.smallCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <View style={styles.cardHeader}>
              <CheckCircleIcon size={14} color={colors.textSecondary} />
              <Text style={styles.cardTitle}>{t('forecast.closedWon')}</Text>
            </View>
            <View style={styles.valueRow}>
              <Text style={styles.cardValue}>{Math.floor(42 * m)}</Text>
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

        <Animated.View style={[styles.card, styles.largeCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
           <View style={styles.largeCardHeader}>
              <View>
                <View style={styles.cardHeader}>
                  <TrendUpIcon size={14} color={colors.textSecondary} />
                  <Text style={styles.cardTitle}>{t('dashboard.revenueGrowth', 'Revenue growth')}</Text>
                </View>
                <Text style={[styles.cardValue, { fontSize: 28, marginTop: 4 }]}>{currency}{(12.5 * m).toFixed(1)}M</Text>
              </View>
              <TouchableOpacity style={styles.iconButton}>
                <CalendarIcon size={18} color={colors.textSecondary} />
              </TouchableOpacity>
           </View>

           <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 20 }} style={{ width: '100%' }}>
             <View style={{ width: 550 }}>
               <View style={styles.mainChartContainer}>
                  <Svg width="100%" height="200" viewBox="0 0 550 200">
                     {Array.from({ length: 45 }).map((_, i) => {
                       const h = 20 + Math.random() * 120;
                       const isCenter = i > 15 && i < 25;
                       return (
                         <AnimatedLine key={i} x1={i * 12 + 3} y1="200" x2={i * 12 + 3} y2={chartProgress.interpolate({ inputRange: [0, 1], outputRange: [200, 200 - h] })} stroke={isCenter ? '#000000' : colors.progressInactive} strokeWidth="6" strokeLinecap="round" />
                       )
                     })}
                     <AnimatedPath d="M 0 160 Q 140 160 210 120 T 450 150 Q 510 150 550 140" stroke={colors.primary} strokeWidth="3" fill="none" strokeDasharray="600" strokeDashoffset={curveOffset} />
                     <AnimatedCircle cx="245" cy="125" r="6" fill={colors.limeAccent} opacity={chartProgress} />
                  </Svg>

                  <Animated.View style={[styles.tooltip, { opacity: chartProgress, transform: [{ translateY: chartProgress.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }] }]}>
                     <View style={styles.tooltipRow}>
                       <Text style={styles.tooltipValue}>{currency}{Math.floor(30 * m)}K</Text>
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
        
        <View style={{ height: 100 }} />
      </ScrollView>

      {(showTimeDropdown || showRegionDropdown) && (
        <TouchableWithoutFeedback onPress={closeDropdowns}>
          <View style={StyleSheet.absoluteFillObject} />
        </TouchableWithoutFeedback>
      )}

      {/* Filter Bottom Sheet */}
      <Modal visible={showFilterModal} transparent animationType="slide" onRequestClose={() => setShowFilterModal(false)}>
        <TouchableWithoutFeedback onPress={() => setShowFilterModal(false)}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.filterSheet}>
          <View style={styles.filterHandle} />
          <View style={styles.filterHeader}>
            <Text style={styles.filterTitle}>Filters</Text>
            <TouchableOpacity onPress={() => { setFilterTime('This Year'); setFilterRegion('All Regions'); }}>
              <Text style={styles.filterReset}>Reset</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.filterSectionLabel}>Time Period</Text>
          <View style={styles.chipRow}>
            {TIME_OPTIONS.map(opt => (
              <TouchableOpacity key={opt} style={[styles.chip, filterTime === opt && styles.chipSelected]} onPress={() => setFilterTime(opt)}>
                <Text style={[styles.chipText, filterTime === opt && styles.chipTextSelected]}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.filterSectionLabel}>Region</Text>
          <View style={styles.chipRow}>
            {REGION_OPTIONS.map(opt => (
              <TouchableOpacity key={opt} style={[styles.chip, filterRegion === opt && styles.chipSelected]} onPress={() => setFilterRegion(opt)}>
                <Text style={[styles.chipText, filterRegion === opt && styles.chipTextSelected]}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.applyButton} onPress={applyFilter}>
            <Text style={styles.applyButtonText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const getStyles = (colors: ThemeColors, isDark?: boolean) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: 20 },
  subHeader: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 20, gap: 10 },
  iconButtonSmall: { width: 40, height: 40, backgroundColor: colors.cardBackground, borderRadius: 20, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8 },
  dropdownButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.cardBackground, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, gap: 6 },
  dropdownButtonActive: { borderWidth: 1.5, borderColor: colors.limeAccent },
  dropdownText: { fontSize: 13, fontWeight: '600', color: colors.textPrimary },
  
  inlineDropdown: { position: 'absolute', backgroundColor: colors.cardBackground, borderRadius: 16, padding: 8, shadowColor: isDark ? '#000' : '#888', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.1, shadowRadius: 24, elevation: 10, zIndex: 1000 },
  dropdownOption: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10, marginBottom: 2 },
  dropdownOptionSelected: { backgroundColor: isDark ? colors.secondaryBackground : '#F0F0F0' },
  dropdownOptionText: { fontSize: 13, fontWeight: '500', color: colors.textSecondary },
  dropdownOptionTextSelected: { fontWeight: '700', color: colors.textPrimary },
  checkmark: { fontSize: 14, color: colors.textPrimary, fontWeight: '700' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12 },
  card: { backgroundColor: colors.cardBackground, borderRadius: 24, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 3, marginBottom: 12 },
  smallCard: { width: CARD_WIDTH, minHeight: 130 },
  largeCard: { width: '100%', padding: 24 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  cardTitle: { fontSize: 12, fontWeight: '500', color: colors.textSecondary },
  valueRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardValue: { fontSize: 22, fontWeight: '700', color: colors.textPrimary },
  positiveChange: { fontSize: 11, fontWeight: '700', color: '#34C759' },
  negativeChange: { fontSize: 11, fontWeight: '700', color: '#FF3B30' },
  arcContainer: { position: 'absolute', bottom: -5, right: -5, width: 90, height: 90 },
  horizontalBarContainer: { marginTop: 24 },
  barTrack: { height: 12, backgroundColor: colors.progressInactive, borderRadius: 6, width: '100%', overflow: 'hidden' },
  barFill: { height: '100%', backgroundColor: colors.limeAccent, borderRadius: 6, flexDirection: 'row', justifyContent: 'flex-end' },
  barSeparator: { width: 3, height: '100%', backgroundColor: colors.primary },
  miniHistogram: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 30, marginTop: 16, paddingHorizontal: 4 },
  miniBar: { width: 3, borderRadius: 1.5 },
  churnBarContainer: { marginTop: 16 },
  churnLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  churnLabelText: { fontSize: 9, color: colors.textMuted, fontWeight: '600' },
  churnTrack: { height: 6, backgroundColor: colors.progressInactive, borderRadius: 3, width: '100%' },
  churnFill: { height: '100%', backgroundColor: colors.limeAccent, borderRadius: 3 },
  largeCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  iconButton: { width: 36, height: 36, borderRadius: 12, borderWidth: 1, borderColor: colors.border, justifyContent: 'center', alignItems: 'center' },
  mainChartContainer: { height: 200, width: '100%', position: 'relative', marginTop: 10 },
  tooltip: { position: 'absolute', top: 100, left: 110, backgroundColor: colors.cardBackground, borderRadius: 12, padding: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 8, borderWidth: 1, borderColor: colors.border },
  tooltipRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  tooltipValue: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  tooltipBadge: { backgroundColor: colors.limeAccent, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  tooltipBadgeText: { fontSize: 10, fontWeight: '700', color: colors.primary },
  tooltipDesc: { fontSize: 10, color: colors.textSecondary, fontWeight: '500' },
  xLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, paddingHorizontal: 10 },
  xLabelText: { fontSize: 11, color: colors.textMuted, fontWeight: '500' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' },
  filterSheet: { backgroundColor: colors.cardBackground, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 48 },
  filterHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border, alignSelf: 'center', marginBottom: 20 },
  filterHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  filterTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  filterReset: { fontSize: 14, fontWeight: '600', color: colors.limeAccent },
  filterSectionLabel: { fontSize: 12, fontWeight: '600', color: colors.textSecondary, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.6 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border },
  chipSelected: { backgroundColor: colors.limeAccent, borderColor: colors.limeAccent },
  chipText: { fontSize: 13, fontWeight: '500', color: colors.textSecondary },
  chipTextSelected: { color: '#000', fontWeight: '700' },
  applyButton: { backgroundColor: colors.limeAccent, borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginTop: 4 },
  applyButtonText: { fontSize: 16, fontWeight: '700', color: '#000' },
});

export default RevenueForecastScreen;
