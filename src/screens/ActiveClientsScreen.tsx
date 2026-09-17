import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Dimensions, TouchableOpacity, Easing, Modal, TouchableWithoutFeedback } from 'react-native';
import Svg, { Circle, Rect, Line, Path, G, Text as SvgText } from 'react-native-svg';
import { ChevronDownIcon, FilterIcon, UsersIcon, UserIcon, TrendUpIcon, CalendarIcon, XIcon } from '../components/icons/Icons';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../hooks/useCurrency';
import { useTheme } from '../context/ThemeContext';
import { ThemeColors } from '../constants/colors';
import { TabType } from "../components/BottomNavBar";

interface ActiveClientsScreenProps {}

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 52) / 2;
const AnimatedLine = Animated.createAnimatedComponent(Line);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// Active Clients chart data — volatile daily active user patterns
const chartData = [
  { ltv: 80, eng: 60 }, { ltv: 50, eng: 30 }, { ltv: 120, eng: 90 }, { ltv: 60, eng: 40 },
  { ltv: 150, eng: 110 }, { ltv: 40, eng: 20 }, { ltv: 130, eng: 95 }, { ltv: 70, eng: 50 },
  { ltv: 160, eng: 120 }, { ltv: 55, eng: 35 }, { ltv: 140, eng: 100 }, { ltv: 80, eng: 55 },
  { ltv: 170, eng: 130 }, { ltv: 45, eng: 25 }, { ltv: 155, eng: 115 }, { ltv: 90, eng: 65 },
  { ltv: 180, eng: 140 }, { ltv: 60, eng: 40 }, { ltv: 165, eng: 125 }, { ltv: 100, eng: 75 },
  { ltv: 190, eng: 150 }, { ltv: 50, eng: 30 }, { ltv: 175, eng: 135 }, { ltv: 110, eng: 80 },
  { ltv: 200, eng: 160 }, { ltv: 65, eng: 45 }, { ltv: 185, eng: 145 }, { ltv: 120, eng: 90 },
  { ltv: 160, eng: 120 }, { ltv: 75, eng: 55 }, { ltv: 195, eng: 155 }, { ltv: 130, eng: 100 },
  { ltv: 170, eng: 130 }, { ltv: 55, eng: 35 }, { ltv: 205, eng: 165 }, { ltv: 140, eng: 110 },
  { ltv: 180, eng: 140 }, { ltv: 85, eng: 65 }, { ltv: 215, eng: 175 }, { ltv: 150, eng: 120 },
  { ltv: 190, eng: 150 }, { ltv: 70, eng: 50 }, { ltv: 220, eng: 180 }, { ltv: 160, eng: 130 },
  { ltv: 200, eng: 160 }, { ltv: 90, eng: 70 }, { ltv: 225, eng: 185 }, { ltv: 170, eng: 140 },
];

const MINI_CHART_VALUES = [35, 55, 40, 80, 65, 90, 70, 45, 60, 85, 50, 75, 60];

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const CHART_WIDTH = chartData.length * 16.5 + 40;

const TIME_OPTIONS = ['This Week', 'This Month', 'This Quarter', 'This Year', 'Last 6 Months', '2025', '2024', '2023'];
const REGION_OPTIONS = ['All Regions', 'North America', 'Europe', 'Asia Pacific', 'Middle East', 'Africa'];

const getFilterTranslationKey = (filterName: string) => {
  const map: Record<string, string> = {
    'This Week': 'filters.thisWeek',
    'This Month': 'filters.thisMonth',
    'This Quarter': 'filters.thisQuarter',
    'This Year': 'filters.thisYear',
    'Last 6 Months': 'filters.last6Months',
    'All Regions': 'filters.allRegions',
    'North America': 'filters.northAmerica',
    'Europe': 'filters.europe',
    'Asia Pacific': 'filters.asiaPacific',
    'Middle East': 'filters.middleEast',
    'Africa': 'filters.africa',
    '2023': 'filters.2023',
    '2024': 'filters.2024',
    '2025': 'filters.2025'
  };
  return map[filterName] || filterName;
};

type MetricSet = {
  totalClients: string; totalChange: string;
  activeClients: string; activeChange: string;
  engagement: string; engChange: string;
  ltv: string; ltvChange: string;
  tooltip: string; tooltipChange: string;
};

const METRICS: Record<string, Record<string, MetricSet>> = {
  'This Week': {
    'All Regions':   { totalClients: '12.8K', totalChange: '+8%',  activeClients: '8.3K', activeChange: '+4%',  engagement: '8.5%',  engChange: '+33%', ltv: '7.3%',  ltvChange: '+37%', tooltip: '12.2',  tooltipChange: '+46%' },
    'North America': { totalClients: '4.2K',  totalChange: '+10%', activeClients: '3.1K', activeChange: '+5%',  engagement: '9.2%',  engChange: '+28%', ltv: '8.1%',  ltvChange: '+31%', tooltip: '14.8',  tooltipChange: '+39%' },
    'Europe':        { totalClients: '3.5K',  totalChange: '+6%',  activeClients: '2.4K', activeChange: '+3%',  engagement: '7.8%',  engChange: '+22%', ltv: '6.9%',  ltvChange: '+27%', tooltip: '10.5',  tooltipChange: '+33%' },
    'Asia Pacific':  { totalClients: '2.9K',  totalChange: '+12%', activeClients: '1.8K', activeChange: '+7%',  engagement: '8.9%',  engChange: '+41%', ltv: '7.8%',  ltvChange: '+44%', tooltip: '11.3',  tooltipChange: '+52%' },
    'Middle East':   { totalClients: '1.4K',  totalChange: '+5%',  activeClients: '0.7K', activeChange: '+2%',  engagement: '6.5%',  engChange: '+15%', ltv: '5.8%',  ltvChange: '+18%', tooltip: '8.1',   tooltipChange: '+22%' },
    'Africa':        { totalClients: '0.8K',  totalChange: '+3%',  activeClients: '0.3K', activeChange: '+1%',  engagement: '5.2%',  engChange: '+9%',  ltv: '4.6%',  ltvChange: '+11%', tooltip: '5.5',   tooltipChange: '+14%' },
  },
  'This Month': {
    'All Regions':   { totalClients: '51.2K', totalChange: '+11%', activeClients: '33.5K', activeChange: '+6%',  engagement: '9.1%',  engChange: '+38%', ltv: '8.0%',  ltvChange: '+42%', tooltip: '48.6',  tooltipChange: '+51%' },
    'North America': { totalClients: '16.8K', totalChange: '+13%', activeClients: '12.4K', activeChange: '+8%',  engagement: '9.8%',  engChange: '+33%', ltv: '8.7%',  ltvChange: '+36%', tooltip: '55.2',  tooltipChange: '+44%' },
    'Europe':        { totalClients: '14.0K', totalChange: '+9%',  activeClients: '9.6K',  activeChange: '+5%',  engagement: '8.4%',  engChange: '+27%', ltv: '7.4%',  ltvChange: '+30%', tooltip: '42.0',  tooltipChange: '+38%' },
    'Asia Pacific':  { totalClients: '11.6K', totalChange: '+15%', activeClients: '7.2K',  activeChange: '+9%',  engagement: '9.5%',  engChange: '+46%', ltv: '8.4%',  ltvChange: '+49%', tooltip: '45.2',  tooltipChange: '+58%' },
    'Middle East':   { totalClients: '5.6K',  totalChange: '+7%',  activeClients: '2.8K',  activeChange: '+3%',  engagement: '7.0%',  engChange: '+20%', ltv: '6.2%',  ltvChange: '+23%', tooltip: '32.4',  tooltipChange: '+27%' },
    'Africa':        { totalClients: '3.2K',  totalChange: '+4%',  activeClients: '1.5K',  activeChange: '+2%',  engagement: '5.6%',  engChange: '+12%', ltv: '4.9%',  ltvChange: '+14%', tooltip: '22.0',  tooltipChange: '+18%' },
  },
  'This Quarter': {
    'All Regions':   { totalClients: '153.6K', totalChange: '+14%', activeClients: '100.5K', activeChange: '+9%',  engagement: '10.2%', engChange: '+44%', ltv: '9.1%',  ltvChange: '+48%', tooltip: '145.8', tooltipChange: '+57%' },
    'North America': { totalClients: '50.4K',  totalChange: '+16%', activeClients: '37.2K',  activeChange: '+11%', engagement: '10.9%', engChange: '+39%', ltv: '9.8%',  ltvChange: '+42%', tooltip: '165.6', tooltipChange: '+50%' },
    'Europe':        { totalClients: '42.0K',  totalChange: '+11%', activeClients: '28.8K',  activeChange: '+7%',  engagement: '9.4%',  engChange: '+33%', ltv: '8.4%',  ltvChange: '+36%', tooltip: '126.0', tooltipChange: '+44%' },
    'Asia Pacific':  { totalClients: '34.8K',  totalChange: '+18%', activeClients: '21.6K',  activeChange: '+12%', engagement: '10.6%', engChange: '+52%', ltv: '9.5%',  ltvChange: '+55%', tooltip: '135.6', tooltipChange: '+64%' },
    'Middle East':   { totalClients: '16.8K',  totalChange: '+9%',  activeClients: '8.4K',   activeChange: '+4%',  engagement: '7.8%',  engChange: '+26%', ltv: '7.0%',  ltvChange: '+29%', tooltip: '97.2',  tooltipChange: '+33%' },
    'Africa':        { totalClients: '9.6K',   totalChange: '+5%',  activeClients: '4.5K',   activeChange: '+2%',  engagement: '6.2%',  engChange: '+18%', ltv: '5.5%',  ltvChange: '+20%', tooltip: '66.0',  tooltipChange: '+24%' },
  },
  'This Year': {
    'All Regions':   { totalClients: '614.4K', totalChange: '+18%', activeClients: '402.0K', activeChange: '+12%', engagement: '11.5%', engChange: '+52%', ltv: '10.4%', ltvChange: '+56%', tooltip: '583.2', tooltipChange: '+65%' },
    'North America': { totalClients: '201.6K', totalChange: '+20%', activeClients: '148.8K', activeChange: '+14%', engagement: '12.2%', engChange: '+47%', ltv: '11.1%', ltvChange: '+50%', tooltip: '662.4', tooltipChange: '+58%' },
    'Europe':        { totalClients: '168.0K', totalChange: '+15%', activeClients: '115.2K', activeChange: '+10%', engagement: '10.7%', engChange: '+41%', ltv: '9.7%',  ltvChange: '+44%', tooltip: '504.0', tooltipChange: '+52%' },
    'Asia Pacific':  { totalClients: '139.2K', totalChange: '+22%', activeClients: '86.4K',  activeChange: '+16%', engagement: '11.9%', engChange: '+60%', ltv: '10.8%', ltvChange: '+63%', tooltip: '542.4', tooltipChange: '+72%' },
    'Middle East':   { totalClients: '67.2K',  totalChange: '+13%', activeClients: '33.6K',  activeChange: '+7%',  engagement: '8.9%',  engChange: '+34%', ltv: '8.1%',  ltvChange: '+37%', tooltip: '388.8', tooltipChange: '+41%' },
    'Africa':        { totalClients: '38.4K',  totalChange: '+8%',  activeClients: '18.0K',  activeChange: '+4%',  engagement: '7.1%',  engChange: '+26%', ltv: '6.4%',  ltvChange: '+28%', tooltip: '264.0', tooltipChange: '+32%' },
  },
  'Last 6 Months': {
    'All Regions':   { totalClients: '307.2K', totalChange: '+16%', activeClients: '201.0K', activeChange: '+10%', engagement: '10.8%', engChange: '+48%', ltv: '9.7%',  ltvChange: '+52%', tooltip: '291.6', tooltipChange: '+61%' },
    'North America': { totalClients: '100.8K', totalChange: '+18%', activeClients: '74.4K',  activeChange: '+12%', engagement: '11.5%', engChange: '+43%', ltv: '10.4%', ltvChange: '+46%', tooltip: '331.2', tooltipChange: '+54%' },
    'Europe':        { totalClients: '84.0K',  totalChange: '+13%', activeClients: '57.6K',  activeChange: '+8%',  engagement: '10.0%', engChange: '+37%', ltv: '9.0%',  ltvChange: '+40%', tooltip: '252.0', tooltipChange: '+48%' },
    'Asia Pacific':  { totalClients: '69.6K',  totalChange: '+20%', activeClients: '43.2K',  activeChange: '+14%', engagement: '11.2%', engChange: '+56%', ltv: '10.1%', ltvChange: '+59%', tooltip: '271.2', tooltipChange: '+68%' },
    'Middle East':   { totalClients: '33.6K',  totalChange: '+11%', activeClients: '16.8K',  activeChange: '+5%',  engagement: '8.3%',  engChange: '+30%', ltv: '7.5%',  ltvChange: '+33%', tooltip: '194.4', tooltipChange: '+37%' },
    'Africa':        { totalClients: '19.2K',  totalChange: '+6%',  activeClients: '9.0K',   activeChange: '+3%',  engagement: '6.6%',  engChange: '+22%', ltv: '5.9%',  ltvChange: '+24%', tooltip: '132.0', tooltipChange: '+28%' },
  },
  '2025': {
    'All Regions':   { totalClients: '720.0K', totalChange: '+22%', activeClients: '510.0K', activeChange: '+18%', engagement: '14.2%', engChange: '+58%', ltv: '12.4%', ltvChange: '+62%', tooltip: '680.0K', tooltipChange: '+70%' },
    'North America': { totalClients: '240.0K', totalChange: '+25%', activeClients: '190.0K', activeChange: '+20%', engagement: '15.1%', engChange: '+54%', ltv: '13.2%', ltvChange: '+56%', tooltip: '780.0K', tooltipChange: '+64%' },
    'Europe':        { totalClients: '190.0K', totalChange: '+19%', activeClients: '140.0K', activeChange: '+15%', engagement: '13.0%', engChange: '+48%', ltv: '11.5%', ltvChange: '+50%', tooltip: '590.0K', tooltipChange: '+58%' },
    'Asia Pacific':  { totalClients: '160.0K', totalChange: '+28%', activeClients: '110.0K', activeChange: '+22%', engagement: '14.5%', engChange: '+68%', ltv: '12.8%', ltvChange: '+70%', tooltip: '640.0K', tooltipChange: '+80%' },
    'Middle East':   { totalClients: '80.0K',  totalChange: '+15%', activeClients: '45.0K',  activeChange: '+10%', engagement: '10.5%', engChange: '+40%', ltv: '9.6%',  ltvChange: '+42%', tooltip: '460.0K', tooltipChange: '+48%' },
    'Africa':        { totalClients: '50.0K',  totalChange: '+11%', activeClients: '25.0K',  activeChange: '+6%',  engagement: '8.8%',  engChange: '+32%', ltv: '7.8%',  ltvChange: '+33%', tooltip: '310.0K', tooltipChange: '+38%' },
  },
  '2024': {
    'All Regions':   { totalClients: '614.4K', totalChange: '+18%', activeClients: '402.0K', activeChange: '+12%', engagement: '11.5%', engChange: '+52%', ltv: '10.4%', ltvChange: '+56%', tooltip: '583.2', tooltipChange: '+65%' },
    'North America': { totalClients: '201.6K', totalChange: '+20%', activeClients: '148.8K', activeChange: '+14%', engagement: '12.2%', engChange: '+47%', ltv: '11.1%', ltvChange: '+50%', tooltip: '662.4', tooltipChange: '+58%' },
    'Europe':        { totalClients: '168.0K', totalChange: '+15%', activeClients: '115.2K', activeChange: '+10%', engagement: '10.7%', engChange: '+41%', ltv: '9.7%',  ltvChange: '+44%', tooltip: '504.0', tooltipChange: '+52%' },
    'Asia Pacific':  { totalClients: '139.2K', totalChange: '+22%', activeClients: '86.4K',  activeChange: '+16%', engagement: '11.9%', engChange: '+60%', ltv: '10.8%', ltvChange: '+63%', tooltip: '542.4', tooltipChange: '+72%' },
    'Middle East':   { totalClients: '67.2K',  totalChange: '+13%', activeClients: '33.6K',  activeChange: '+7%',  engagement: '8.9%',  engChange: '+34%', ltv: '8.1%',  ltvChange: '+37%', tooltip: '388.8', tooltipChange: '+41%' },
    'Africa':        { totalClients: '38.4K',  totalChange: '+8%',  activeClients: '18.0K',  activeChange: '+4%',  engagement: '7.1%',  engChange: '+26%', ltv: '6.4%',  ltvChange: '+28%', tooltip: '264.0', tooltipChange: '+32%' },
  },
  '2023': {
    'All Regions':   { totalClients: '512.0K', totalChange: '+14%', activeClients: '330.0K', activeChange: '+8%',  engagement: '9.8%',  engChange: '+42%', ltv: '8.8%',  ltvChange: '+45%', tooltip: '480.0K', tooltipChange: '+52%' },
    'North America': { totalClients: '168.0K', totalChange: '+16%', activeClients: '122.0K', activeChange: '+11%', engagement: '10.5%', engChange: '+38%', ltv: '9.5%',  ltvChange: '+40%', tooltip: '550.0K', tooltipChange: '+48%' },
    'Europe':        { totalClients: '140.0K', totalChange: '+12%', activeClients: '95.0K',  activeChange: '+7%',  engagement: '9.0%',  engChange: '+32%', ltv: '8.2%',  ltvChange: '+35%', tooltip: '420.0K', tooltipChange: '+42%' },
    'Asia Pacific':  { totalClients: '116.0K', totalChange: '+18%', activeClients: '71.0K',  activeChange: '+12%', engagement: '10.2%', engChange: '+48%', ltv: '9.2%',  ltvChange: '+50%', tooltip: '450.0K', tooltipChange: '+58%' },
    'Middle East':   { totalClients: '56.0K',  totalChange: '+9%',  activeClients: '28.0K',  activeChange: '+5%',  engagement: '7.5%',  engChange: '+26%', ltv: '6.8%',  ltvChange: '+28%', tooltip: '320.0K', tooltipChange: '+32%' },
    'Africa':        { totalClients: '32.0K',  totalChange: '+5%',  activeClients: '14.0K',  activeChange: '+2%',  engagement: '6.0%',  engChange: '+18%', ltv: '5.5%',  ltvChange: '+20%', tooltip: '220.0K', tooltipChange: '+24%' },
  },

};

const ActiveClientsScreen: React.FC<ActiveClientsScreenProps> = () => {
  const { t } = useTranslation();
  const currency = useCurrency();
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors, isDark);

  const [showTooltip, setShowTooltip] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const chartProgress = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<any>(null);

  // Optimize interpolations to prevent recreation on every render
  const miniChartHeights = useMemo(() => 
    MINI_CHART_VALUES.map(val => chartProgress.interpolate({ inputRange: [0, 1], outputRange: ['0%', `${val}%`] }))
  , [chartProgress]);

  const [selectedTime, setSelectedTime] = useState('This Week');
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterTime, setFilterTime] = useState('This Week');
  const [filterRegion, setFilterRegion] = useState('All Regions');

  const metrics: MetricSet =
    METRICS[selectedTime]?.[selectedRegion] ?? METRICS['This Week']['All Regions'];

  const triggerAnimations = (scrollToOffset = false) => {
    fadeAnim.setValue(0);
    slideAnim.setValue(20);
    chartProgress.setValue(0);
    Animated.parallel([
      Animated.spring(fadeAnim, { toValue: 1, tension: 20, friction: 7, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 20, friction: 7, useNativeDriver: true }),
      Animated.timing(chartProgress, { toValue: 1, duration: 1500, delay: 150, easing: Easing.bezier(0.25, 1, 0.5, 1), useNativeDriver: false }),
    ]).start(() => {
      if (scrollToOffset) {
        scrollViewRef.current?.scrollTo({ x: 150, animated: true });
      }
    });
  };

  useEffect(() => {
    triggerAnimations(true);
  }, []);

  const topBarWidth = chartProgress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '50%'] });

  const applyFilter = () => {
    setSelectedTime(filterTime);
    setSelectedRegion(filterRegion);
    setShowFilterModal(false);
    triggerAnimations(false);
  };

  const donutCircumference = 2 * Math.PI * 70;
  const donut1Offset = chartProgress.interpolate({ inputRange: [0, 1], outputRange: [donutCircumference, 0.25 * donutCircumference] });
  const donut2Offset = chartProgress.interpolate({ inputRange: [0, 1], outputRange: [donutCircumference, (0.25 - 0.52) * donutCircumference] });
  const donut3Offset = chartProgress.interpolate({ inputRange: [0, 1], outputRange: [donutCircumference, (0.25 - 0.52 - 0.25) * donutCircumference] });
  const donut4Offset = chartProgress.interpolate({ inputRange: [0, 1], outputRange: [donutCircumference, (0.25 - 0.52 - 0.25 - 0.15) * donutCircumference] });

  const openFilter = () => {
    setFilterTime(selectedTime);
    setFilterRegion(selectedRegion);
    setShowFilterModal(true);
  };

  const closeDropdowns = () => {
    setShowTimeDropdown(false);
    setShowRegionDropdown(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Sub Header */}
        <Animated.View style={[styles.subHeader, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={{ flex: 1 }} />

          {/* Filter icon */}
          <TouchableOpacity style={styles.iconButton} onPress={openFilter}>
            <FilterIcon size={16} color={colors.textSecondary} />
          </TouchableOpacity>

          {/* This Week dropdown */}
          <TouchableOpacity 
            activeOpacity={0.7} 
            style={[styles.dropdownButton, showTimeDropdown && styles.dropdownButtonActive]} 
            onPress={() => { setShowRegionDropdown(false); setShowTimeDropdown(v => !v); }}
          >
            <Text style={styles.dropdownText}>{t(getFilterTranslationKey(selectedTime), selectedTime)}</Text>
            <ChevronDownIcon size={12} color={colors.textPrimary} />
          </TouchableOpacity>

          {/* All Regions dropdown */}
          <TouchableOpacity 
            activeOpacity={0.7} 
            style={[styles.dropdownButton, showRegionDropdown && styles.dropdownButtonActive]} 
            onPress={() => { setShowTimeDropdown(false); setShowRegionDropdown(v => !v); }}
          >
            <Text style={styles.dropdownText}>{t(getFilterTranslationKey(selectedRegion), selectedRegion)}</Text>
            <ChevronDownIcon size={12} color={colors.textPrimary} />
          </TouchableOpacity>
        </Animated.View>

        {/* Metric Header */}
        <Animated.View style={[styles.metricHeader, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <Text style={styles.metricValue}>{metrics.activeClients}</Text>
          <Text style={styles.headerMetricLabel}>{t('insights.activeClients', 'Active Clients')}</Text>
          <View style={styles.metricChangeContainer}>
            <Text style={styles.positiveChange}>{metrics.activeChange}</Text>
          </View>
        </Animated.View>

        {/* Mini Stat Cards */}
        <View style={styles.grid}>
          {/* Active This Month */}
          <Animated.View style={[styles.card, styles.smallCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <View style={styles.cardHeader}>
              <UsersIcon size={14} color={colors.textSecondary} />
              <Text style={styles.cardTitle}>{t('clientInsights.activeThisMonth', 'Active This Month')}</Text>
            </View>
            <View style={styles.valueRow}>
              <Text style={styles.cardValue}>+{Math.floor(parseInt(metrics.activeClients.replace(/[^0-9]/g, '')) * 0.08)}</Text>
              <Text style={styles.positiveChange}>+8%</Text>
            </View>
            <View style={styles.miniChartContainer}>
              <View style={styles.miniBars}>
                {MINI_CHART_VALUES.map((_, i) => (
                  <View key={i} style={styles.miniBarTrack}>
                    <Animated.View style={[styles.miniBarFill, {
                      height: miniChartHeights[i],
                      backgroundColor: i === 5 || i === 9 ? colors.limeAccent : colors.border,
                    }]} />
                  </View>
                ))}
              </View>
            </View>
          </Animated.View>

          {/* Churn Rate Card */}
          <Animated.View style={[styles.card, styles.smallCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <View style={styles.cardHeader}>
              <TrendUpIcon size={14} color={colors.textSecondary} />
              <Text style={styles.cardTitle}>{t('clientInsights.churnRate', 'Churn Rate')}</Text>
            </View>
            <View style={styles.valueRow}>
              <Text style={styles.cardValue}>4.2%</Text>
              <Text style={styles.negativeChange}>-2%</Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressTrack}>
                <Animated.View style={[styles.progressFill, { width: chartProgress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '42%'] }) }]} />
                <View style={styles.progressThumb} />
              </View>
            </View>
          </Animated.View>
        </View>

        {/* Engagement vs LTV */}
        <Animated.View style={[styles.card, styles.largeCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.largeCardHeader}>
            <View style={styles.cardHeader}>
              <TrendUpIcon size={14} color={colors.textSecondary} />
              <Text style={styles.cardTitle}>{t('clientInsights.engagementVsLtvTitle', 'Engagement vs Lifetime Value')}</Text>
            </View>
            <TouchableOpacity style={styles.calendarButton}>
              <CalendarIcon size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.largeValueRow}>
            <View style={styles.metricColumn}>
              <Text style={styles.metricLabel}>{t('clientInsights.engagementLabel', 'Engagement')}</Text>
              <View style={styles.metricValueWrapper}>
                <Text style={styles.largeCardValue}>{metrics.engagement}</Text>
                <View style={styles.badgeLime}><Text style={styles.badgeLimeText}>{metrics.engChange}</Text></View>
              </View>
            </View>
            <View style={styles.metricColumnRight}>
              <Text style={styles.metricLabel}>{t('clientInsights.ltvLabel', 'Lifetime Value')}</Text>
              <View style={styles.metricValueWrapper}>
                <Text style={styles.largeCardValue}>{metrics.ltv}</Text>
                <View style={styles.badgeGrey}><Text style={styles.badgeGreyText}>{metrics.ltvChange}</Text></View>
              </View>
            </View>
          </View>

          <View style={styles.chartAreaWrapper}>
            <View style={styles.yAxisContainer}>
              {[{ y: 170, label: '0' }, { y: 130, label: '20k' }, { y: 90, label: '30k' }, { y: 50, label: '50k' }, { y: 10, label: '150k' }].map((grid, i) => (
                <Text key={i} style={[styles.yAxisText, { position: 'absolute', top: grid.y - 8, left: 0 }]}>{grid.label}</Text>
              ))}
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chartScroll} ref={scrollViewRef} onScrollBeginDrag={() => setShowTooltip(false)} scrollEventThrottle={16}>
              <View style={styles.chartContainer}>
                <Svg width={CHART_WIDTH} height="200" viewBox={`0 0 ${CHART_WIDTH} 200`}>
                  <Rect x="274" y="20" width="132" height="150" fill={colors.background} rx="6" opacity="0.6" />
                  <Rect x="274" y="170" width="132" height="4" fill={colors.border} />
                  <Circle cx="274" cy="172" r="3" fill={colors.limeAccent} stroke="#fff" strokeWidth="1" />
                  <Circle cx="406" cy="172" r="3" fill={colors.limeAccent} stroke="#fff" strokeWidth="1" />
                  {chartData.map((data, i) => {
                    const x = 20 + (i * 16.5);
                    const ltvH = (data.ltv / 160) * 160;
                    const engH = (data.eng / 160) * 160;
                    return (
                      <React.Fragment key={i}>
                        <AnimatedLine x1={x} y1="170" x2={x} y2={chartProgress.interpolate({ inputRange: [0, 1], outputRange: [170, 170 - ltvH] })} stroke="#DCDFE4" strokeWidth="2" strokeLinecap="round" />
                        <AnimatedLine x1={x} y1="170" x2={x} y2={chartProgress.interpolate({ inputRange: [0, 1], outputRange: [170, 170 - engH] })} stroke="#2B2D31" strokeWidth="2.5" strokeLinecap="round" />
                      </React.Fragment>
                    );
                  })}
                </Svg>
                {months.map((month, i) => (
                  <Text key={i} style={[styles.xAxisText, { position: 'absolute', top: 185, left: 20 + (i * 4 * 16.5) + (1.5 * 16.5) - 6 }]}>{t(`clientInsights.months.${month}`, month)}</Text>
                ))}
                {showTooltip && (
                  <Animated.View style={[styles.tooltip, { opacity: chartProgress, left: 244 }]}>
                    <View style={styles.tooltipHeader}>
                      <View style={styles.tooltipValueRow}>
                        <Text style={styles.tooltipValue}>{currency}{metrics.tooltip}</Text>
                        <View style={styles.badgeLimeSmall}><Text style={styles.badgeLimeTextSmall}>{metrics.tooltipChange}</Text></View>
                      </View>
                      <TouchableOpacity onPress={() => setShowTooltip(false)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                        <XIcon size={10} color={colors.textSecondary} />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.tooltipSubtext}>{t('clientInsights.tooltipGrowthText', 'Growth to end the half-year')}</Text>
                  </Animated.View>
                )}
              </View>
            </ScrollView>
          </View>
        </Animated.View>

        {/* Activity Breakdown - Donut Chart */}
        <Animated.View style={[styles.card, styles.largeCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }], marginTop: 12 }]}>
          <Text style={styles.sectionTitle}>{t('clientInsights.activityBreakdown', 'Activity Breakdown')}</Text>
          <View style={styles.donutWrapper}>
            <Svg width={180} height={180} viewBox="0 0 180 180">
              <Circle cx="90" cy="90" r="70" fill="none" stroke="#F0F0F0" strokeWidth="28" />
              {/* Daily Active 52% */}
              <AnimatedCircle cx="90" cy="90" r="70" fill="none" stroke="#42B6F5" strokeWidth="28"
                strokeDasharray={`${0.52 * donutCircumference} ${donutCircumference}`}
                strokeDashoffset={donut1Offset} strokeLinecap="butt" transform="rotate(-90 90 90)" />
              {/* Weekly Active 25% */}
              <AnimatedCircle cx="90" cy="90" r="70" fill="none" stroke="#34C98A" strokeWidth="28"
                strokeDasharray={`${0.25 * donutCircumference} ${donutCircumference}`}
                strokeDashoffset={donut2Offset} strokeLinecap="butt" transform="rotate(-90 90 90)" />
              {/* Monthly Active 15% */}
              <AnimatedCircle cx="90" cy="90" r="70" fill="none" stroke="#FF6B35" strokeWidth="28"
                strokeDasharray={`${0.15 * donutCircumference} ${donutCircumference}`}
                strokeDashoffset={donut3Offset} strokeLinecap="butt" transform="rotate(-90 90 90)" />
              {/* Dormant 8% */}
              <AnimatedCircle cx="90" cy="90" r="70" fill="none" stroke="#9B59B6" strokeWidth="28"
                strokeDasharray={`${0.08 * donutCircumference} ${donutCircumference}`}
                strokeDashoffset={donut4Offset} strokeLinecap="butt" transform="rotate(-90 90 90)" />
              <Circle cx="90" cy="90" r="56" fill="white" />
              <SvgText x="90" y="83" textAnchor="middle" fontSize="11" fill="#999" fontWeight="400">Daily Active</SvgText>
              <SvgText x="90" y="102" textAnchor="middle" fontSize="22" fill="#1A1A1A" fontWeight="700">52%</SvgText>
            </Svg>
          </View>
          <View style={styles.legendGrid}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#42B6F5' }]} />
              <View><Text style={styles.legendLabel}>{t('clientInsights.dailyActive', 'Daily Active')}</Text><Text style={styles.legendValue}>52%</Text></View>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#34C98A' }]} />
              <View><Text style={styles.legendLabel}>{t('clientInsights.weeklyActive', 'Weekly Active')}</Text><Text style={styles.legendValue}>25%</Text></View>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#FF6B35' }]} />
              <View><Text style={styles.legendLabel}>{t('clientInsights.monthlyActive', 'Monthly Active')}</Text><Text style={styles.legendValue}>15%</Text></View>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#9B59B6' }]} />
              <View><Text style={styles.legendLabel}>{t('clientInsights.dormant', 'Dormant')}</Text><Text style={styles.legendValue}>8%</Text></View>
            </View>
          </View>
        </Animated.View>

      </ScrollView>

      {/* Backdrop to close inline dropdowns */}
      {(showTimeDropdown || showRegionDropdown) && (
        <TouchableWithoutFeedback onPress={closeDropdowns}>
          <View style={StyleSheet.absoluteFill} />
        </TouchableWithoutFeedback>
      )}

      {/* Inline Time Dropdown */}
      {showTimeDropdown && (
        <View style={[styles.inlineDropdown, { top: 80, right: 160 }]}>
          {TIME_OPTIONS.map(opt => (
            <TouchableOpacity
              key={opt}
              style={[styles.dropdownOption, selectedTime === opt && styles.dropdownOptionSelected]}
              onPress={() => { setSelectedTime(opt); setFilterTime(opt); setShowTimeDropdown(false); triggerAnimations(false); }}
            >
              <Text style={[styles.dropdownOptionText, selectedTime === opt && styles.dropdownOptionTextSelected]}>{t(getFilterTranslationKey(opt), opt)}</Text>
              {selectedTime === opt && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Inline Region Dropdown */}
      {showRegionDropdown && (
        <View style={[styles.inlineDropdown, { top: 80, right: 40, width: 160 }]}>
          {REGION_OPTIONS.map(opt => (
            <TouchableOpacity
              key={opt}
              style={[styles.dropdownOption, selectedRegion === opt && styles.dropdownOptionSelected]}
              onPress={() => { setSelectedRegion(opt); setFilterRegion(opt); setShowRegionDropdown(false); triggerAnimations(false); }}
            >
              <Text style={[styles.dropdownOptionText, selectedRegion === opt && styles.dropdownOptionTextSelected]}>{t(getFilterTranslationKey(opt), opt)}</Text>
              {selectedRegion === opt && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Filter Bottom Sheet */}
      <Modal visible={showFilterModal} transparent animationType="slide" onRequestClose={() => setShowFilterModal(false)}>
        <TouchableWithoutFeedback onPress={() => setShowFilterModal(false)}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.filterSheet}>
          <View style={styles.filterHandle} />
          <View style={styles.filterHeader}>
            <Text style={styles.filterTitle}>{t('common.filters', 'Filters')}</Text>
            <TouchableOpacity onPress={() => { setFilterTime('This Year'); setFilterRegion('All Regions'); }}>
              <Text style={styles.filterReset}>{t('common.reset', 'Reset')}</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.filterSectionLabel}>{t('common.timePeriod', 'TIME PERIOD')}</Text>
          <View style={styles.chipRow}>
            {TIME_OPTIONS.map(opt => (
              <TouchableOpacity key={opt} style={[styles.chip, filterTime === opt && styles.chipSelected]} onPress={() => setFilterTime(opt)}>
                <Text style={[styles.chipText, filterTime === opt && styles.chipTextSelected]}>{t(getFilterTranslationKey(opt), opt)}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.filterSectionLabel, { marginTop: 8 }]}>{t('common.region', 'REGION')}</Text>
          <View style={styles.chipRow}>
            {REGION_OPTIONS.map(opt => (
              <TouchableOpacity key={opt} style={[styles.chip, filterRegion === opt && styles.chipSelected]} onPress={() => setFilterRegion(opt)}>
                <Text style={[styles.chipText, filterRegion === opt && styles.chipTextSelected]}>{t(getFilterTranslationKey(opt), opt)}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.applyButton} onPress={applyFilter}>
            <Text style={styles.applyButtonText}>{t('common.applyFilters', 'Apply Filters')}</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const getStyles = (colors: ThemeColors, isDark: boolean) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: 20, paddingTop: 40, paddingBottom: 100 },
  metricHeader: { marginBottom: 32 },
  metricValue: { fontSize: 48, fontWeight: '700', color: colors.textPrimary },
  headerMetricLabel: { fontSize: 16, color: colors.textSecondary, marginTop: 4 },
  metricChangeContainer: { marginTop: 8, alignSelf: 'flex-start', backgroundColor: 'rgba(164, 255, 66, 0.15)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  subHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginBottom: 20, gap: 8, zIndex: 100 },
  iconButton: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.cardBackground, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6 },
  dropdownButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.cardBackground, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20, gap: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6 },
  dropdownButtonActive: { borderWidth: 1.5, borderColor: colors.limeAccent },
  dropdownText: { fontSize: 13, fontWeight: '500', color: colors.textPrimary },

  inlineDropdown: { position: 'absolute', backgroundColor: colors.cardBackground, borderRadius: 16, padding: 8, shadowColor: isDark ? '#000' : '#888', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.1, shadowRadius: 24, elevation: 10, zIndex: 1000 },
  dropdownOption: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10, marginBottom: 2 },
  dropdownOptionSelected: { backgroundColor: isDark ? colors.secondaryBackground : '#F0F0F0' },
  dropdownOptionText: { fontSize: 13, fontWeight: '500', color: colors.textSecondary },
  dropdownOptionTextSelected: { fontWeight: '700', color: colors.textPrimary },
  checkmark: { fontSize: 14, color: colors.textPrimary, fontWeight: '700' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between', marginBottom: 12 },
  card: { backgroundColor: colors.cardBackground, borderRadius: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.04, shadowRadius: 16, elevation: 4 },
  smallCard: { width: CARD_WIDTH, padding: 20, minHeight: 140, justifyContent: 'space-between' },
  largeCard: { width: '100%', padding: 24 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  largeCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  calendarButton: { width: 32, height: 32, borderRadius: 10, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' },
  cardTitle: { fontSize: 13, fontWeight: '500', color: colors.textSecondary },
  valueRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  cardValue: { fontSize: 22, fontWeight: '700', color: colors.textPrimary },
  positiveChange: { fontSize: 11, fontWeight: '700', color: '#34C759' },
  negativeChange: { fontSize: 11, fontWeight: '700', color: '#FF3B30' },
  progressBarContainer: { height: 24, justifyContent: 'center' },
  progressTrack: { height: 6, backgroundColor: colors.progressInactive, borderRadius: 3, width: '100%', flexDirection: 'row', alignItems: 'center' },
  progressFill: { height: '100%', backgroundColor: colors.limeAccent, borderRadius: 3 },
  progressThumb: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.border, borderWidth: 2, borderColor: '#fff', marginLeft: -4 },
  miniChartContainer: { height: 30, justifyContent: 'flex-end' },
  miniBars: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: '100%', gap: 2 },
  miniBarTrack: { flex: 1, height: '100%', justifyContent: 'flex-end', alignItems: 'center' },
  miniBarFill: { width: 2, borderRadius: 1 },
  largeValueRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  metricColumn: { flex: 1 },
  metricColumnRight: { flex: 1, alignItems: 'flex-end' },
  metricLabel: { fontSize: 12, color: colors.textSecondary, marginBottom: 4, fontWeight: '500' },
  metricValueWrapper: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  largeCardValue: { fontSize: 28, fontWeight: '600', color: colors.textPrimary },
  badgeLime: { backgroundColor: colors.limeAccent, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeLimeText: { fontSize: 11, fontWeight: '700', color: '#000' },
  badgeGrey: { backgroundColor: colors.background, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeGreyText: { fontSize: 11, fontWeight: '600', color: colors.textSecondary },
  chartAreaWrapper: { flexDirection: 'row', height: 220, position: 'relative', marginLeft: -10 },
  yAxisContainer: { width: 35, height: 200, position: 'relative', zIndex: 1 },
  chartScroll: { flex: 1 },
  chartContainer: { height: 200, position: 'relative' },
  yAxisText: { fontSize: 11, color: colors.textSecondary },
  xAxisText: { fontSize: 11, color: colors.textSecondary },
  tooltip: { position: 'absolute', bottom: 30, left: 40, width: 210, backgroundColor: '#fff', borderRadius: 16, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 8 },
  tooltipHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
  tooltipValueRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  tooltipValue: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  badgeLimeSmall: { backgroundColor: colors.limeAccent, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  badgeLimeTextSmall: { fontSize: 10, fontWeight: '700', color: '#000' },
  tooltipSubtext: { fontSize: 12, color: colors.textSecondary, fontWeight: '500' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' },
  filterSheet: { backgroundColor: colors.cardBackground, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 48 },
  filterHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border, alignSelf: 'center', marginBottom: 20 },
  filterHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  filterTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  filterReset: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  filterSectionLabel: { fontSize: 12, fontWeight: '600', color: colors.textSecondary, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.6 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border },
  chipSelected: { backgroundColor: colors.limeAccent, borderColor: colors.limeAccent },
  chipText: { fontSize: 13, fontWeight: '500', color: colors.textSecondary },
  chipTextSelected: { color: '#000', fontWeight: '700' },
  applyButton: { backgroundColor: colors.limeAccent, borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginTop: 4 },
  applyButtonText: { fontSize: 16, fontWeight: '700', color: '#000' },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: colors.textPrimary, marginBottom: 20 },
  donutWrapper: { alignItems: 'center', marginVertical: 16 },
  legendGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 20, marginTop: 8 },
  legendItem: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, width: '45%' },
  legendDot: { width: 10, height: 10, borderRadius: 5, marginTop: 3 },
  legendLabel: { fontSize: 12, color: colors.textSecondary, marginBottom: 2 },
  legendValue: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
});

export default ActiveClientsScreen;
