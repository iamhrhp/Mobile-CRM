import React, { useEffect, useRef, useState, useCallback } from 'react';
import { TabType } from "../components/BottomNavBar";

import { View, StyleSheet, ScrollView, Image, TouchableOpacity, Text, Animated, TouchableWithoutFeedback, Modal, TextInput, KeyboardAvoidingView, Platform, RefreshControl } from 'react-native';
import { FilterIcon, PlusIcon, UsersIcon, FireIcon, ArrowUpRightIcon, MailIcon, PhoneIcon, ChevronDownIcon, VideoCameraIcon } from '../components/icons/Icons';
import { useTheme } from '../context/ThemeContext';
import { ThemeColors } from '../constants/colors';
import { useTranslation } from 'react-i18next';

interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  subtext: string;
  interestLabel: string;
  interestValue: number;
  sources: string[];
  status: string;
  avatarUri: string;
  isHotLead: boolean;
  dropdownDirection?: 'up' | 'down';
}

const initialLeads: Lead[] = [
  {
    id: 'daniel',
    name: 'Daniel Mercer',
    company: 'Brightway Logistics',
    email: 'daniel.m@brightway.com',
    phone: '+1 (312) 555-0743',
    subtext: 'Recently requested a proposal',
    interestLabel: 'High Interest',
    interestValue: 86,
    sources: ['Referral', 'Agent Added'],
    status: 'Call Scheduled',
    avatarUri: 'https://randomuser.me/api/portraits/men/85.jpg',
    isHotLead: true,
    dropdownDirection: 'down',
  },
  {
    id: 'sarah',
    name: 'Sarah Jenkins',
    company: 'Global Tech Solutions',
    email: 's.jenkins@gts.com',
    phone: '+1 (415) 555-8901',
    subtext: 'Interested in enterprise plan',
    interestLabel: 'Medium Interest',
    interestValue: 64,
    sources: ['Organic Search', 'Webinar'],
    status: 'Follow-up Email',
    avatarUri: 'https://randomuser.me/api/portraits/women/45.jpg',
    isHotLead: false,
    dropdownDirection: 'up',
  }
];

interface StatusDropdownProps {
  initialStatus: string;
  avatarUri: string;
  direction?: 'up' | 'down';
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

const StatusDropdown = ({ initialStatus, avatarUri, direction = 'down', isOpen, onToggle, onClose }: StatusDropdownProps) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  
  const { t } = useTranslation();
  const [statusId, setStatusId] = React.useState(initialStatus);
  const options = [
    { id: 'New', label: t('status.new', 'New') },
    { id: 'Call Scheduled', label: t('users.callScheduled', 'Call Scheduled') },
    { id: 'Follow-up Email', label: t('users.followUpEmail', 'Follow-up Email') },
    { id: 'Proposal Sent', label: t('users.proposalSent', 'Proposal Sent') },
    { id: 'Converted', label: t('users.converted', 'Converted') }
  ];

  const currentLabel = options.find(o => o.id === statusId)?.label || statusId;

  return (
    <View style={[{ flex: 1 }, isOpen && { zIndex: 100 }]}>
      <TouchableOpacity activeOpacity={0.8} style={styles.statusDropdown} onPress={onToggle}>
        <Image source={{ uri: avatarUri }} style={styles.statusAvatar} />
        <Text style={styles.statusText}>{currentLabel}</Text>
        <ChevronDownIcon size={14} color={colors.textPrimary} />
      </TouchableOpacity>
      
      {isOpen && (
        <View style={[styles.dropdownList, direction === 'up' ? { bottom: 50 } : { top: 50 }]}>
          {options.map((opt) => (
            <TouchableOpacity 
              key={opt.id} 
              style={[styles.dropdownItem, statusId === opt.id && styles.dropdownItemSelected]} 
              onPress={() => { setStatusId(opt.id); onClose(); }}
            >
              <Text style={[styles.dropdownItemText, statusId === opt.id && styles.dropdownItemTextSelected]}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const LeadCard = ({ lead, barAnim, openDropdownId, setOpenDropdownId, colors, styles, t, index }: any) => {
  return (
    <View style={[styles.leadCard, { marginTop: index === 0 ? 0 : 16, zIndex: 100 - index }]}>
      <View style={[styles.cardTopRow, lead.isHotLead ? {} : { justifyContent: 'flex-end' }]}>
        {lead.isHotLead && (
          <View style={styles.hotLeadBadge}>
            <FireIcon size={14} />
            <Text style={styles.hotLeadText}>{t('users.hotLead', 'HOT LEAD')}</Text>
          </View>
        )}
        <TouchableOpacity activeOpacity={0.7} style={styles.openBtn}>
          <ArrowUpRightIcon size={12} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <View style={styles.profileRow}>
        <Image source={{ uri: lead.avatarUri }} style={styles.avatar} resizeMode="cover" />
        <View style={styles.profileDetails}>
          <Text style={styles.name}>{lead.name}</Text>
          <Text style={styles.company}>{lead.company}</Text>
          <View style={styles.contactRow}>
            <MailIcon size={10} color={colors.textMuted} />
            <Text style={styles.contactText}>{lead.email}</Text>
          </View>
          <View style={styles.contactRow}>
            <PhoneIcon size={10} color={colors.textMuted} />
            <Text style={styles.contactText}>{lead.phone}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.subtext}>{t(`users.subtexts.${lead.id}`, lead.subtext)}</Text>

      <View style={styles.interestSection}>
        <View style={styles.interestRow}>
          <Text style={styles.interestLabel}>{t(`users.interest.${lead.interestLabel.replace(' ', '')}`, lead.interestLabel)}</Text>
          <Text style={styles.interestValue}>{lead.interestValue}%</Text>
        </View>
        <Animated.View style={[styles.progressContainer, { opacity: barAnim }]}>
          <View style={styles.ticksContainer}>
            {Array.from({ length: 30 }).map((_, idx) => (
              <View key={idx} style={styles.tickItem} />
            ))}
          </View>
          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressFill, { 
              backgroundColor: lead.interestValue >= 80 ? colors.limeAccent : '#34C759', 
              flex: barAnim.interpolate({ inputRange: [0, 1], outputRange: [0.0001, lead.interestValue / 100] }) 
            }]} />
            <View style={styles.progressHandle} />
            <Animated.View style={[styles.progressEmpty, { 
              flex: barAnim.interpolate({ inputRange: [0, 1], outputRange: [0.9999, 1 - (lead.interestValue / 100)] }) 
            }]} />
          </View>
        </Animated.View>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionLabel}>{t('users.source', 'Source')}</Text>
        <View style={styles.badgesRow}>
          {lead.sources.map((src: string, idx: number) => (
            <View key={idx} style={styles.badge}>
              <Text style={styles.badgeText}>{t(`users.sourceTags.${src.replace(' ', '')}`, src)}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={[styles.statusSectionContainer, { zIndex: 20 }]}>
        <Text style={styles.sectionLabel}>{t('users.status', 'Status')}</Text>
        <View style={styles.statusActionRow}>
          <StatusDropdown 
            initialStatus={lead.status} 
            avatarUri="https://randomuser.me/api/portraits/women/68.jpg"
            direction={lead.dropdownDirection || 'down'}
            isOpen={openDropdownId === lead.id}
            onToggle={() => setOpenDropdownId(openDropdownId === lead.id ? null : lead.id)}
            onClose={() => setOpenDropdownId(null)}
          />
          
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity activeOpacity={0.7} style={styles.actionBtnOutline}>
              <MailIcon size={16} color={colors.textPrimary} />
            </TouchableOpacity>
            {lead.isHotLead && (
              <TouchableOpacity activeOpacity={0.7} style={styles.actionBtnSolid}>
                <VideoCameraIcon size={16} color={colors.background} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

interface UsersScreenProps {
  onNavigate?: (screen: TabType) => void;
}

const UsersScreen: React.FC<UsersScreenProps> = ({ onNavigate }) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const barAnim = useRef(new Animated.Value(0)).current;
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const [leads, setLeads] = useState<Lead[]>(initialLeads);

  useEffect(() => {
    fadeAnim.setValue(0);
    barAnim.setValue(0);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(barAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: false,
      })
    ]).start();
  }, [fadeAnim, barAnim, leads.length]);

  const handleOutsidePress = () => {
    if (openDropdownId) {
      setOpenDropdownId(null);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <Animated.ScrollView
        style={[styles.container, { opacity: fadeAnim }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScrollBeginDrag={handleOutsidePress}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.limeAccent}
            colors={[colors.limeAccent]}
          />
        }
      >
        <TouchableWithoutFeedback onPress={handleOutsidePress}>
          <View style={{ flex: 1 }}>
            {/* Top Actions Row */}
            <View style={styles.topActionsRow}>
              <TouchableOpacity activeOpacity={0.7} style={styles.filterBtn} onPress={() => onNavigate?.('sort')}>
                <FilterIcon size={18} color={colors.textPrimary} />
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={0.8} style={styles.addLeadBtn} onPress={() => onNavigate?.('add_lead')}>
                <PlusIcon size={13} color={colors.textPrimary} />
                <Text style={styles.addLeadText}>{t('dashboard.addNewLead', 'Add New Lead')}</Text>
              </TouchableOpacity>
            </View>

            {/* New Leads Header */}
            <View style={styles.sectionHeaderRow}>
              <UsersIcon size={16} color={colors.textSecondary} />
              <Text style={styles.sectionHeaderText}>{t('users.newLeads', 'NEW LEADS')} <Text style={styles.sectionHeaderCount}>({leads.length})</Text></Text>
            </View>

            {leads.map((lead, index) => (
              <LeadCard 
                key={lead.id} 
                lead={lead} 
                barAnim={barAnim} 
                openDropdownId={openDropdownId} 
                setOpenDropdownId={setOpenDropdownId} 
                colors={colors} 
                styles={styles} 
                t={t} 
                index={index} 
              />
            ))}
          </View>
        </TouchableWithoutFeedback>
      </Animated.ScrollView>
    </View>
  );
};

const getStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 110,
    paddingHorizontal: 20,
  },
  topActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  addLeadBtn: {
    backgroundColor: colors.cardBackground,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 22,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  addLeadText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionHeaderText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  sectionHeaderCount: {
    fontWeight: '400',
  },
  leadCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  hotLeadBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  hotLeadText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FF6B00',
    letterSpacing: 0.5,
  },
  openBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.secondaryBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 16,
  },
  profileDetails: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  company: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  contactText: {
    fontSize: 12,
    color: colors.textMuted,
  },
  subtext: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 20,
  },
  interestSection: {
    marginBottom: 24,
  },
  interestRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  interestLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  interestValue: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  progressContainer: {
    height: 14,
    justifyContent: 'flex-end',
    position: 'relative',
  },
  ticksContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tickItem: {
    width: 1,
    height: 4,
    backgroundColor: colors.tickItem,
  },
  progressTrack: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 6,
    borderRadius: 3,
  },
  progressFill: {
    height: 6,
    backgroundColor: colors.limeAccent,
    borderRadius: 3,
  },
  progressHandle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.textMuted,
    marginHorizontal: 4,
  },
  progressEmpty: {
    height: 6,
    backgroundColor: colors.secondaryBackground,
    borderRadius: 3,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 8,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    backgroundColor: colors.secondaryBackground,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  statusSectionContainer: {
    marginBottom: 4,
  },
  statusActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  statusDropdown: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
  },
  statusAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 8,
  },
  statusText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtnOutline: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBtnSolid: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.textPrimary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownList: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 100,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  dropdownItemSelected: {
    backgroundColor: colors.secondaryBackground,
  },
  dropdownItemText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  dropdownItemTextSelected: {
    fontWeight: '700',
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  modalInput: {
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    color: colors.textPrimary,
    marginBottom: 20,
  },
  saveBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  saveBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  }
});

export default UsersScreen;
