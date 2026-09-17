import React, { useRef, useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, Animated, TextInput, TouchableOpacity, Image, ScrollView, Alert, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import Svg, { Path, G, Circle, Text as SvgText, Line } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { ThemeColors } from '../constants/colors';
import { SearchIcon, CalendarIcon, MailIcon, PhoneIcon, ChevronDownIcon, MoreHorizontalIcon, CheckCircleIcon, UserIcon, PencilIcon, TrendUpIcon } from '../components/icons/Icons';
import TimeFilter from '../components/TimeFilter';

const DUMMY_LEADS = Array.from({ length: 50 }).map((_, index) => {
  const baseRevenue = (index + 1) * 1500;
  const statusOptions = ['New', 'Contacted', 'Qualified', 'Proposal', 'Won'];
  const status = statusOptions[index % 5];
  const priorityOptions = ['High', 'Medium', 'Low'];
  
  return {
    id: `lead-${index}`,
    name: `Lead #${index + 1}`,
    company: index % 2 === 0 ? `Acme Corp ${index}` : `TechFlow ${index}`,
    owner: index % 3 === 0 ? 'John Smith' : 'Sarah Connor',
    status: status,
    priority: priorityOptions[index % 3],
    source: index % 3 === 0 ? 'Outbound' : index % 2 === 0 ? 'Referrals' : 'Organic Search',
    time: `${(index % 5) + 1}d ago`,
    avatar: index < 5 ? `https://i.pravatar.cc/100?img=${index + 10}` : null,
    email: `lead${index + 1}@example.com`,
    phone: `+1 (555) ${String(100 + index).padStart(3, '0')}-${String(1000 + index).padStart(4, '0')}`,
    country: index % 4 === 0 ? 'United Kingdom' : index % 3 === 0 ? 'Canada' : 'United States',
    industry: index % 2 === 0 ? 'Technology' : 'Healthcare',
    
    // Deal Info
    revenue: `$${baseRevenue.toLocaleString()}`,
    dealValueNumeric: baseRevenue,
    paymentStatus: index % 5 === 0 ? 'Pending' : 'Paid',
    pendingAmount: index % 5 === 0 ? `$${(baseRevenue * 0.3).toLocaleString()}` : null,
    contractSince: `2023-${String((index % 12) + 1).padStart(2, '0')}-15`,
    profitMargin: 65 + (index % 15),
    growth: index % 4 === 0 ? -2 : 12 + (index % 10),
    probability: 40 + (index % 50),
    expectedClose: `Sep ${(index % 30) + 1}, 2024`,
    leadScore: 60 + (index % 40),
    createdDate: `15 Aug 2024`,
    lastContacted: `${(index % 5) + 1} days ago`,
    
    // Activities
    nextFollowUp: {
      date: 'Tomorrow',
      time: '10:30 AM',
      topic: 'Call about enterprise proposal'
    },
    activities: [
      { id: 1, type: 'Call', title: 'Call completed', description: 'Discussed pricing and implementation timeline.', time: '10:42 AM', date: 'Today' },
      { id: 2, type: 'Email', title: 'Email sent', description: 'Product proposal sent to lead.', time: '3:18 PM', date: 'Yesterday' },
      { id: 3, type: 'Note', title: 'Note added', description: 'Lead requested enterprise pricing.', time: '11:20 AM', date: 'Aug 28' }
    ],
    notes: 'Interested in enterprise plan. Decision maker is evaluating multiple vendors. Requested implementation timeline before September.',
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

const LINE_DATA_2 = [3, 2.5, 3.5, 2, 4.5, 7, 8, 5, 12];
const LINE_DATA_YEAR_2 = [1, 2, 3, 3, 5, 8, 9, 10, 12, 11, 12, 13];

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



const LeadItem = ({ item, colors, styles, onPress, t }: any) => {
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
        <Text style={styles.listTitle}>{item.name.replace('Lead', t('dashboard.lead', 'Lead'))}</Text>
        <Text style={styles.listSubtitle}>{t(`users.sourceTags.${item.source.replace(' ', '')}`, item.source)}</Text>
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

  const [leadsData, setLeadsData] = useState(DUMMY_LEADS);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  // Edit States
  const [isEditNotesVisible, setEditNotesVisible] = useState(false);
  const [editNotesValue, setEditNotesValue] = useState('');
  const [isTimelineVisible, setTimelineVisible] = useState(false);

  const selectedLead = useMemo(() => leadsData.find(l => l.id === selectedLeadId) || null, [leadsData, selectedLeadId]);
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
  const currentLineData2 = (isCurrentYear ? LINE_DATA_2 : LINE_DATA_YEAR_2).map(val => val * dataModifier);
  const lineChart2 = createSmoothLine(currentLineData2, 300, 180);

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
    Animated.timing(chartAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, [selectedMonth, selectedYear]);

  const filteredLeads = useMemo(() => {
    return leadsData.filter(lead => 
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.source.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, leadsData]);

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
      <View style={{ flex: 1 }}>
      <Animated.ScrollView
        style={[styles.container, { opacity: fadeAnim }]}
        contentContainerStyle={[styles.content, { paddingHorizontal: 16, paddingBottom: 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Compact Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, marginTop: 8 }}>
          <TouchableOpacity 
            style={{ padding: 12, marginLeft: -12, flexDirection: 'row', alignItems: 'center' }} 
            onPress={() => setSelectedLeadId(null)}
          >
            <View style={{ transform: [{ rotate: '90deg' }] }}>
              <ChevronDownIcon size={24} color={colors.textPrimary} />
            </View>
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: '700', color: colors.textPrimary }}>Lead Profile</Text>
          <TouchableOpacity style={{ padding: 12, marginRight: -12 }}>
            <MoreHorizontalIcon size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Lead Profile - Left Aligned for Professional Look */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
          {selectedLead.avatar ? (
            <Image source={{ uri: selectedLead.avatar }} style={{ width: 72, height: 72, borderRadius: 36, marginRight: 16 }} />
          ) : (
            <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: colors.secondaryBackground, justifyContent: 'center', alignItems: 'center', marginRight: 16, borderWidth: 1, borderColor: colors.border }}>
              <Text style={{ color: colors.textSecondary, fontSize: 24, fontWeight: '700' }}>{initials}</Text>
            </View>
          )}
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 24, fontWeight: '800', color: colors.textPrimary, marginBottom: 4 }}>{selectedLead.name}</Text>
            <Text style={{ fontSize: 15, color: colors.textSecondary, fontWeight: '500', marginBottom: 8 }}>{selectedLead.company}</Text>
            
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <View style={{ backgroundColor: '#E6F4EA', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 16 }}>
                <Text style={{ color: colors.success, fontSize: 12, fontWeight: '700' }}>{selectedLead.status}</Text>
              </View>
              <View style={{ backgroundColor: '#FEF3C7', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 16 }}>
                <Text style={{ color: '#D97706', fontSize: 12, fontWeight: '700' }}>{selectedLead.priority}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons - High Prominence */}
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 28 }}>
          <TouchableOpacity style={{ flex: 1, height: 40, borderRadius: 12, backgroundColor: colors.primary, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 6 }}>
            <PhoneIcon size={16} color="#FFF" />
            <Text style={{ color: '#FFF', fontSize: 14, fontWeight: '700', marginLeft: 8 }}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ flex: 1, height: 40, borderRadius: 12, backgroundColor: colors.cardBackground, borderWidth: 1, borderColor: colors.border, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <MailIcon size={16} color={colors.textPrimary} />
            <Text style={{ color: colors.textPrimary, fontSize: 14, fontWeight: '700', marginLeft: 8 }}>Email</Text>
          </TouchableOpacity>
        </View>

        {/* Next Follow-up - Direct Action Focus */}
        <View style={{ marginBottom: 28 }}>
          <Text style={{ fontSize: 13, fontWeight: '700', color: colors.textMuted, textTransform: 'uppercase', marginBottom: 12, letterSpacing: 0.5 }}>Next Action</Text>
          <View style={{ padding: 20, backgroundColor: colors.cardBackground, borderRadius: 16, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.primary + '20', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10 }}>
            <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.secondaryBackground, justifyContent: 'center', alignItems: 'center', marginRight: 16 }}>
              <CalendarIcon size={20} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: colors.textPrimary, marginBottom: 2 }}>{selectedLead.nextFollowUp.topic}</Text>
              <Text style={{ fontSize: 14, color: colors.textSecondary, fontWeight: '500' }}>{selectedLead.nextFollowUp.date} at {selectedLead.nextFollowUp.time}</Text>
            </View>
            <TouchableOpacity style={{ padding: 8 }}>
              <CheckCircleIcon size={24} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Pipeline Visualizer */}
        <View style={{ marginBottom: 28 }}>
          <Text style={{ fontSize: 13, fontWeight: '700', color: colors.textMuted, textTransform: 'uppercase', marginBottom: 12, letterSpacing: 0.5 }}>Pipeline Stage</Text>
          <View style={{ padding: 20, backgroundColor: colors.cardBackground, borderRadius: 16, borderWidth: 1, borderColor: colors.border }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              {['New', 'Contacted', 'Qualified', 'Proposal', 'Won'].map((stage, idx, arr) => {
                const isActive = selectedLead.status === stage;
                const isPast = arr.indexOf(selectedLead.status) > idx;
                const color = isActive ? colors.primary : (isPast ? colors.success : colors.border);
                return (
                  <View key={stage} style={{ flex: 1, alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                      <View style={{ flex: 1, height: 3, backgroundColor: idx === 0 ? 'transparent' : (isPast || isActive ? colors.success : colors.border) }} />
                      <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: color, borderWidth: isActive ? 4 : 0, borderColor: '#FFF', shadowColor: isActive ? colors.primary : 'transparent', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.3, shadowRadius: 4 }} />
                      <View style={{ flex: 1, height: 3, backgroundColor: idx === arr.length - 1 ? 'transparent' : (isPast ? colors.success : colors.border) }} />
                    </View>
                    <Text style={{ fontSize: 11, color: isActive ? colors.textPrimary : colors.textMuted, marginTop: 10, fontWeight: isActive ? '700' : '500', textAlign: 'center' }}>{stage}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        {/* Deal / Revenue */}
        <View style={{ marginBottom: 28 }}>
          <Text style={{ fontSize: 13, fontWeight: '700', color: colors.textMuted, textTransform: 'uppercase', marginBottom: 12, letterSpacing: 0.5 }}>Deal Value</Text>
          <View style={{ backgroundColor: colors.cardBackground, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: colors.border }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
              <Text style={{ fontSize: 32, fontWeight: '800', color: colors.textPrimary, letterSpacing: -0.5 }}>{selectedLead.revenue}</Text>
              <Text style={{ fontSize: 14, fontWeight: '600', color: colors.success }}>{selectedLead.probability}% Prob.</Text>
            </View>
            
            <View style={{ height: 8, backgroundColor: colors.secondaryBackground, borderRadius: 4, marginBottom: 20, overflow: 'hidden' }}>
              <View style={{ width: `${selectedLead.probability}%`, height: '100%', backgroundColor: colors.success, borderRadius: 4 }} />
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View>
                <Text style={{ color: colors.textSecondary, fontSize: 13, fontWeight: '500', marginBottom: 4 }}>Expected Close</Text>
                <Text style={{ color: colors.textPrimary, fontSize: 15, fontWeight: '700' }}>{selectedLead.expectedClose}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ color: colors.textSecondary, fontSize: 13, fontWeight: '500', marginBottom: 4 }}>Lead Score</Text>
                <Text style={{ color: selectedLead.leadScore >= 80 ? colors.success : '#D97706', fontSize: 15, fontWeight: '700' }}>{selectedLead.leadScore}/100</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Lead Information */}
        <View style={{ marginBottom: 28 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 }}>Information</Text>
            <TouchableOpacity 
              activeOpacity={0.6}
              onPress={() => Alert.alert('Edit', 'Edit lead information coming soon.')}
              style={{ paddingVertical: 4, paddingHorizontal: 8, backgroundColor: colors.secondaryBackground, borderRadius: 8 }}>
              <Text style={{ color: colors.primary, fontSize: 13, fontWeight: '700' }}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={{ backgroundColor: colors.cardBackground, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: colors.border }}>
            {[
              { label: 'Source', value: selectedLead.source },
              { label: 'Owner', value: selectedLead.owner },
              { label: 'Email', value: selectedLead.email },
              { label: 'Phone', value: selectedLead.phone },
              { label: 'Country', value: selectedLead.country },
              { label: 'Created', value: selectedLead.createdDate },
            ].map((info, idx, arr) => (
              <View key={idx} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: idx === arr.length - 1 ? 0 : 1, borderBottomColor: colors.secondaryBackground }}>
                <Text style={{ color: colors.textSecondary, fontSize: 15, fontWeight: '500' }}>{info.label}</Text>
                <Text style={{ color: colors.textPrimary, fontSize: 15, fontWeight: '600' }}>{info.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Activity Timeline */}
        <View style={{ marginBottom: 28 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 }}>Activity</Text>
            <TouchableOpacity style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: colors.secondaryBackground, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: colors.textPrimary, fontSize: 20, fontWeight: '500', marginTop: -2 }}>+</Text>
            </TouchableOpacity>
          </View>
          <View style={{ backgroundColor: colors.cardBackground, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: colors.border }}>
            {selectedLead.activities.map((act: any, idx: number) => (
              <View key={act.id} style={{ flexDirection: 'row', marginBottom: idx === selectedLead.activities.length - 1 ? 0 : 24 }}>
                <View style={{ alignItems: 'center', marginRight: 16 }}>
                  <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: colors.primary, marginTop: 4, borderWidth: 2, borderColor: '#FFF', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 }} />
                  {idx !== selectedLead.activities.length - 1 && (
                    <View style={{ width: 2, flex: 1, backgroundColor: colors.secondaryBackground, marginTop: 4, borderRadius: 1 }} />
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <Text style={{ fontSize: 15, fontWeight: '700', color: colors.textPrimary }}>{act.title}</Text>
                    <Text style={{ fontSize: 13, color: colors.textMuted, fontWeight: '500' }}>{act.date}</Text>
                  </View>
                  <Text style={{ fontSize: 14, color: colors.textSecondary, marginBottom: 6, lineHeight: 20 }}>{act.description}</Text>
                  <Text style={{ fontSize: 12, color: colors.textMuted, fontWeight: '600' }}>{act.time}</Text>
                </View>
              </View>
            ))}
            <TouchableOpacity 
              activeOpacity={0.6}
              onPress={() => setTimelineVisible(true)}
              style={{ marginTop: 24, alignItems: 'center', paddingVertical: 12, backgroundColor: colors.secondaryBackground, borderRadius: 12 }}>
              <Text style={{ color: colors.textPrimary, fontSize: 14, fontWeight: '700' }}>View full timeline</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Notes */}
        <View style={{ marginBottom: 40 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 }}>Notes</Text>
            <TouchableOpacity 
              activeOpacity={0.6}
              onPress={() => { setEditNotesValue(selectedLead.notes); setEditNotesVisible(true); }}
              style={{ paddingVertical: 4, paddingHorizontal: 8, backgroundColor: colors.secondaryBackground, borderRadius: 8 }}>
              <Text style={{ color: colors.primary, fontSize: 13, fontWeight: '700' }}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={{ backgroundColor: '#FFFBEB', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#FEF3C7' }}>
            <Text style={{ fontSize: 15, color: colors.textPrimary, lineHeight: 24, fontWeight: '500' }}>{selectedLead.notes}</Text>
          </View>
        </View>

      </Animated.ScrollView>

      {/* Edit Notes Modal */}
      <Modal visible={isEditNotesVisible} animationType="slide" transparent={true}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ backgroundColor: colors.background, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, minHeight: 300 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: colors.textPrimary }}>Edit Notes</Text>
              <TouchableOpacity onPress={() => setEditNotesVisible(false)}><Text style={{ fontSize: 16, color: colors.textSecondary }}>Cancel</Text></TouchableOpacity>
            </View>
            <TextInput
              style={{ backgroundColor: colors.cardBackground, borderRadius: 12, padding: 20, paddingTop: 16, fontSize: 16, color: colors.textPrimary, minHeight: 120, borderWidth: 1, borderColor: colors.border }}
              multiline
              autoFocus
              value={editNotesValue}
              onChangeText={setEditNotesValue}
              placeholder="Enter notes..."
              placeholderTextColor={colors.textMuted}
            />
            <TouchableOpacity 
              style={{ backgroundColor: colors.primary, borderRadius: 12, height: 48, justifyContent: 'center', alignItems: 'center', marginTop: 24 }}
              onPress={() => {
                setLeadsData(prev => prev.map(l => l.id === selectedLead.id ? { ...l, notes: editNotesValue } : l));
                setEditNotesVisible(false);
              }}
            >
              <Text style={{ color: '#FFF', fontSize: 16, fontWeight: '700' }}>Save Notes</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Timeline Modal */}
      <Modal visible={isTimelineVisible} animationType="slide" presentationStyle="pageSheet">
        <View style={{ flex: 1, backgroundColor: colors.background }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: colors.border }}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: colors.textPrimary }}>Full Timeline</Text>
            <TouchableOpacity onPress={() => setTimelineVisible(false)} style={{ padding: 4 }}>
              <View style={{ transform: [{ rotate: '45deg' }] }}>
                <Text style={{ fontSize: 24, color: colors.textSecondary, fontWeight: '300' }}>+</Text>
              </View>
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={{ padding: 20 }}>
            {selectedLead.activities.map((act: any, idx: number) => (
              <View key={act.id} style={{ flexDirection: 'row', marginBottom: 24 }}>
                <View style={{ alignItems: 'center', marginRight: 16 }}>
                  <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: colors.primary, marginTop: 4, borderWidth: 2, borderColor: '#FFF', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 }} />
                  {idx !== selectedLead.activities.length - 1 && (
                    <View style={{ width: 2, flex: 1, backgroundColor: colors.border, marginTop: 4, borderRadius: 1 }} />
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <Text style={{ fontSize: 15, fontWeight: '700', color: colors.textPrimary }}>{act.title}</Text>
                    <Text style={{ fontSize: 13, color: colors.textMuted, fontWeight: '500' }}>{act.date}</Text>
                  </View>
                  <Text style={{ fontSize: 14, color: colors.textSecondary, marginBottom: 6, lineHeight: 20 }}>{act.description}</Text>
                  <Text style={{ fontSize: 12, color: colors.textMuted, fontWeight: '600' }}>{act.time}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </Modal>

      </View>
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
            <Text style={styles.statLabel}>{t('users.sourceTags.Organic', 'Organic')}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>210</Text>
            <Text style={styles.statLabel}>{t('users.sourceTags.Referrals', 'Referrals')}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>182</Text>
            <Text style={styles.statLabel}>{t('users.sourceTags.Outbound', 'Outbound')}</Text>
          </View>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{t('dashboard.recentAcquisition', 'Recent Acquisition')}</Text>
      </View>

      <View style={styles.searchContainer}>
        <SearchIcon size={18} color={colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder={t('dashboard.searchLeads', 'Search leads...')}
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
    <LeadItem item={item} colors={colors} styles={styles} onPress={(lead: any) => setSelectedLeadId(lead.id)} t={t} />
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
    padding: 20,
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
    padding: 20,
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
    padding: 20,
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
    padding: 20,
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
    padding: 20,
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
