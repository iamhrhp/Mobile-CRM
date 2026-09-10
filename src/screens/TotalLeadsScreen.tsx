import React, { useRef, useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, Animated, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import Svg, { Path, G, Circle, Text as SvgText, Line } from 'react-native-svg';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { ThemeColors } from '../constants/colors';
import { SearchIcon, CalendarIcon, FunnelIcon, MailIcon, PhoneIcon, ChevronDownIcon } from '../components/icons/Icons';
import TimeFilter from '../components/TimeFilter';

const DUMMY_LEADS = Array.from({ length: 50 }).map((_, index) => {
  const baseRevenue = (index + 1) * 1500;
  return {
    id: `lead-${index}`,
    name: `Lead #${index + 1}`,
    source: index % 3 === 0 ? 'Outbound' : index % 2 === 0 ? 'Referrals' : 'Organic Search',
    time: `${(index % 5) + 1}d ago`,
    avatar: index < 5 ? `https://i.pravatar.cc/100?img=${index + 10}` : null,
    email: `lead${index + 1}@example.com`,
    country: index % 4 === 0 ? 'United Kingdom' : index % 3 === 0 ? 'Canada' : 'United States',
    revenue: `$${baseRevenue.toLocaleString()}`,
    paymentStatus: index % 5 === 0 ? 'Pending' : 'Paid',
    contractSince: `2023-${String((index % 12) + 1).padStart(2, '0')}-15`,
    profitMargin: 65 + (index % 15),
    growth: index % 4 === 0 ? -2 : 12 + (index % 10),
    revenueData: {
      '6M': {
        data: [
          baseRevenue * 0.7, 
          baseRevenue * 0.8, 
          baseRevenue * 0.75, 
          baseRevenue * 0.9, 
          baseRevenue, 
          baseRevenue * 1.1
        ],
        labels: ['M1', 'M2', 'M3', 'M4', 'M5', 'M6']
      },
      '1Y': {
        data: [
          baseRevenue * 2,
          baseRevenue * 2.2,
          baseRevenue * 2.5,
          baseRevenue * 3.1
        ],
        labels: ['Q1', 'Q2', 'Q3', 'Q4']
      },
      'ALL': {
        data: [
          baseRevenue * 5,
          baseRevenue * 8,
          baseRevenue * 12
        ],
        labels: ['2021', '2022', '2023']
      }
    }
  };
});

const PIE_DATA = [
  { label: 'Partners', value: 154768, color: '#FF7F50' },
  { label: 'Referrals', value: 1234345, color: '#4BA3E3' },
  { label: 'Google adwords', value: 9874135, color: '#F75B8B' }
];

const PIE_DATA_YEAR = [
  { label: 'Partners', value: 1850000, color: '#FF7F50' },
  { label: 'Referrals', value: 14800000, color: '#4BA3E3' },
  { label: 'Google adwords', value: 118400000, color: '#F75B8B' }
];

const LINE_DATA = [4, 1.5, 2.5, 1, 2.5, 9, 10, 6, 14.5];
const LINE_DATA_YEAR = [2, 3, 5, 4, 8, 12, 11, 13, 15, 14, 14.5, 15];

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
    
    const cp1x = curr.x + (next.x - curr.x) / 3;
    const cp1y = curr.y;
    const cp2x = curr.x + 2 * (next.x - curr.x) / 3;
    const cp2y = next.y;
    
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
  }
  
  return { path: d, points };
};



const LeadItem = ({ item, colors, styles, onPress }: any) => {
  const [imageError, setImageError] = useState(false);
  
  const initials = item.name
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <TouchableOpacity style={styles.listItem} activeOpacity={0.7} onPress={() => onPress(item)}>
      {item.avatar && !imageError ? (
        <Image 
          source={{ uri: item.avatar }} 
          style={styles.avatar} 
          onError={() => setImageError(true)}
        />
      ) : (
        <View style={styles.avatar}>
          <Text style={{ color: colors.textSecondary, fontSize: 16, fontWeight: '600' }}>
            {initials}
          </Text>
        </View>
      )}
      <View style={styles.listInfo}>
        <Text style={styles.listTitle}>{item.name}</Text>
        <Text style={styles.listSubtitle}>{item.source}</Text>
      </View>
      <Text style={styles.listTime}>{item.time}</Text>
    </TouchableOpacity>
  );
};

const TotalLeadsScreen = ({ onHideHeader }: { onHideHeader?: (hidden: boolean) => void }) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const chartAnim = useRef(new Animated.Value(1)).current;

  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selectedLead, setSelectedLead] = useState<typeof DUMMY_LEADS[0] | null>(null);
  const [selectedMonth, setSelectedMonth] = useState('Aug');
  const [selectedYear, setSelectedYear] = useState('2024');
  const PAGE_SIZE = 10;

  const isCurrentYear = selectedYear === '2024';
  const monthIndex = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(selectedMonth);
  const dataModifier = selectedMonth === 'All' ? 1.0 : 1 + (monthIndex - 7) * 0.1;

  const currentPieData = (isCurrentYear ? PIE_DATA : PIE_DATA_YEAR).map(item => ({
    ...item,
    value: item.value * dataModifier
  }));

  const currentLineData = (isCurrentYear ? LINE_DATA : LINE_DATA_YEAR).map(val => val * dataModifier);

  useEffect(() => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    if (onHideHeader) {
      onHideHeader(!!selectedLead);
    }
  }, [selectedLead, fadeAnim, onHideHeader]);

  useEffect(() => {
    chartAnim.setValue(0);
    Animated.spring(chartAnim, {
      toValue: 1,
      friction: 8,
      tension: 50,
      useNativeDriver: true,
    }).start();
  }, [selectedMonth, selectedYear]);

  const filteredLeads = useMemo(() => {
    return DUMMY_LEADS.filter(lead => 
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.source.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const displayedLeads = useMemo(() => {
    return filteredLeads.slice(0, page * PAGE_SIZE);
  }, [filteredLeads, page]);

  const handleLoadMore = () => {
    if (displayedLeads.length < filteredLeads.length) {
      setPage(prev => prev + 1);
    }
  };

  if (selectedLead) {
    const initials = selectedLead.name
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

    return (
      <Animated.ScrollView
        style={[styles.container, { opacity: fadeAnim }]}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => setSelectedLead(null)}
        >
          <View style={{ transform: [{ rotate: '90deg' }] }}>
            <ChevronDownIcon size={20} color={colors.textPrimary} />
          </View>
          <Text style={styles.backButtonText}>{t('common.back', 'Back to Leads')}</Text>
        </TouchableOpacity>

        <View style={styles.detailsHeader}>
          {selectedLead.avatar ? (
            <Image source={{ uri: selectedLead.avatar }} style={styles.detailsAvatar} />
          ) : (
            <View style={styles.detailsAvatar}>
              <Text style={{ color: colors.textSecondary, fontSize: 32, fontWeight: '700' }}>{initials}</Text>
            </View>
          )}
          <Text style={styles.detailsName}>{selectedLead.name}</Text>
          <View style={styles.detailsPillContainer}>
            <Text style={styles.detailsSource}>{selectedLead.source}</Text>
            <Text style={styles.detailsSource}>{selectedLead.country}</Text>
          </View>
          <View style={[styles.detailsPillContainer, { marginTop: 8 }]}>
            <Text style={styles.detailsSource}>{selectedLead.email}</Text>
          </View>
        </View>

        <TimeFilter 
          selectedMonth={selectedMonth} 
          onMonthChange={setSelectedMonth} 
          selectedYear={selectedYear} 
          onYearChange={setSelectedYear} 
        />

        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>{selectedMonth === 'All' ? `${selectedYear} Total` : `${selectedMonth} ${selectedYear}`} sales</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
            <Text style={{ fontSize: 24, fontWeight: '700', color: colors.textPrimary, marginRight: 8 }}>
              {isCurrentYear ? '$ 6,254,490' : '$ 75,053,880'}
            </Text>
            <Text style={{ color: colors.danger, fontSize: 12, marginRight: 2 }}>▼</Text>
            <Text style={{ color: colors.textPrimary, fontSize: 12, fontWeight: '600' }}>10%</Text>
            <View style={{ flex: 1 }} />
            <Text style={{ fontSize: 12, color: colors.textSecondary, fontWeight: '500' }}>
              Previous : {isCurrentYear ? '$ 5,685,960' : '$ 68,230,000'}
            </Text>
          </View>
        </View>

        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Revenue by lead source</Text>
          <Animated.View style={{ alignItems: 'center', marginVertical: 20, position: 'relative', opacity: chartAnim, transform: [{ scale: chartAnim.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] }) }] }}>
            <Svg width={160} height={160}>
              {createPieChartArcs(currentPieData, 80).map((arc, i) => (
                <Path key={i} d={arc.d} fill={arc.color} />
              ))}
            </Svg>
            
            <View style={{
              position: 'absolute', top: 10, right: 0, backgroundColor: colors.cardBackground, 
              padding: 8, borderRadius: 8, borderWidth: 1, borderColor: '#FF7F50',
              shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, elevation: 4
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#FF7F50', marginRight: 6 }} />
                <Text style={{ fontSize: 10, color: colors.textSecondary }}>Partners</Text>
              </View>
              <Text style={{ fontSize: 14, fontWeight: '700', color: colors.textPrimary }}>
                {isCurrentYear ? '$ 154,768' : '$ 1,850,000'}
              </Text>
            </View>
          </Animated.View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
            {currentPieData.slice(0, 3).map((item, i) => (
              <View key={i} style={{ alignItems: 'flex-start' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: item.color, marginRight: 6 }} />
                  <Text style={{ fontSize: 10, color: colors.textSecondary }}>{item.label}</Text>
                </View>
                <Text style={{ fontSize: 12, fontWeight: '700', color: colors.textPrimary }}>${Math.round(item.value).toLocaleString()}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Lead Conversion</Text>
          <Animated.View style={{ alignItems: 'center', marginTop: 10, marginLeft: -10, opacity: chartAnim, transform: [{ translateY: chartAnim.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }] }}>
            <Svg width={300} height={180}>
              {[15, 12.5, 10, 7.5, 5, 2.5].map((val, i) => {
                const y = 20 + (i * (140 / 5));
                return (
                  <G key={i}>
                    <Line x1="30" y1={y} x2={300} y2={y} stroke={colors.border} strokeWidth="1" />
                    <SvgText x="25" y={y + 4} fontSize="10" fill={colors.textMuted} textAnchor="end">{val}</SvgText>
                  </G>
                );
              })}
              
              <Path d={createSmoothLine(currentLineData, 300, 180).path} fill="none" stroke="#26C6DA" strokeWidth="2" />
              
              {createSmoothLine(currentLineData, 300, 180).points.map((p, i) => (
                <Circle key={i} cx={p.x} cy={p.y} r="3" fill="#26C6DA" stroke={colors.cardBackground} strokeWidth="1.5" />
              ))}
            </Svg>
          </Animated.View>
        </View>

        <View style={styles.analyticsGrid}>
          <View style={styles.analyticsCard}>
            <Text style={styles.analyticsTitle}>LTV Revenue</Text>
            <Text style={styles.analyticsValue}>{selectedLead.revenue}</Text>
            <Text style={styles.analyticsSub}>Lifetime</Text>
          </View>
          <View style={styles.analyticsCard}>
            <Text style={styles.analyticsTitle}>Profit Margin</Text>
            <Text style={styles.analyticsValue}>{selectedLead.profitMargin}%</Text>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${selectedLead.profitMargin}%` }]} />
            </View>
          </View>
          <View style={styles.analyticsCard}>
            <Text style={styles.analyticsTitle}>MoM Growth</Text>
            <Text style={styles.analyticsValue}>{selectedLead.growth > 0 ? '+' : ''}{selectedLead.growth}%</Text>
            <Text style={[styles.analyticsSub, { color: selectedLead.growth > 0 ? colors.success : colors.danger }]}>
              {selectedLead.growth > 0 ? 'Trending Up' : 'Trending Down'}
            </Text>
          </View>
          <View style={styles.analyticsCard}>
            <Text style={styles.analyticsTitle}>Payment Status</Text>
            <View style={{ alignItems: 'flex-start', marginTop: 4 }}>
              <View style={[
                styles.statusBadge, 
                { backgroundColor: selectedLead.paymentStatus === 'Paid' ? '#E6F4EA' : '#FEF3C7' }
              ]}>
                <Text style={[
                  styles.statusBadgeText, 
                  { color: selectedLead.paymentStatus === 'Paid' ? colors.success : colors.warning }
                ]}>{selectedLead.paymentStatus}</Text>
              </View>
            </View>
            <Text style={[styles.analyticsSub, { marginTop: 8 }]}>Since {selectedLead.contractSince}</Text>
          </View>
        </View>


      </Animated.ScrollView>
    );
  }

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.header}>
        <Text style={styles.subtitle}>1,232 {t('dashboard.activeLeads', 'Active Leads')}</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.statRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>840</Text>
            <Text style={styles.statLabel}>Organic</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>210</Text>
            <Text style={styles.statLabel}>Referrals</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>182</Text>
            <Text style={styles.statLabel}>Outbound</Text>
          </View>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Acquisition</Text>
      </View>

      <View style={styles.searchContainer}>
        <SearchIcon size={18} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search leads..."
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={(text) => {
            setSearchQuery(text);
            setPage(1);
          }}
        />
      </View>
    </View>
  );

  const renderFooter = () => {
    if (displayedLeads.length >= filteredLeads.length) return <View style={{ height: 40 }} />;
    return (
      <TouchableOpacity style={styles.loadMoreBtn} onPress={handleLoadMore}>
        <Text style={styles.loadMoreText}>Load More</Text>
      </TouchableOpacity>
    );
  };

  const renderItem = ({ item }: { item: typeof DUMMY_LEADS[0] }) => (
    <LeadItem item={item} colors={colors} styles={styles} onPress={setSelectedLead} />
  );

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <FlatList
        data={displayedLeads}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      />
    </Animated.View>
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
  headerContainer: {
    marginBottom: 8,
  },
  header: {
    marginBottom: 32,
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
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: colors.textPrimary,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.border,
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listInfo: {
    flex: 1,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  listSubtitle: {
    fontSize: 13,
    color: colors.textMuted,
  },
  listTime: {
    fontSize: 12,
    color: colors.textMuted,
  },
  loadMoreBtn: {
    backgroundColor: colors.cardBackground,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: colors.border,
  },
  loadMoreText: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: '600',
  },
  // Details View Styles
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    gap: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  detailsHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  detailsAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  detailsName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  detailsPillContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  detailsSource: {
    fontSize: 13,
    color: colors.textSecondary,
    backgroundColor: colors.cardBackground,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  detailsCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  analyticsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 16,
  },
  analyticsCard: {
    width: '47%',
    backgroundColor: colors.cardBackground,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  analyticsTitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  analyticsValue: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  analyticsSub: {
    fontSize: 12,
    color: colors.textMuted,
  },
  progressTrack: {
    width: '100%',
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  detailLabel: {
    fontSize: 15,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 15,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 13,
    fontWeight: '700',
  },
});

export default TotalLeadsScreen;
