import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, Text, Animated, TouchableWithoutFeedback } from 'react-native';
import { FilterIcon, PlusIcon, UsersIcon, FireIcon, ArrowUpRightIcon, MailIcon, PhoneIcon, ChevronDownIcon, VideoCameraIcon } from '../components/icons/Icons';
import colors from '../constants/colors';
import { useTranslation } from 'react-i18next';

interface StatusDropdownProps {
  initialStatus: string;
  avatarUri: string;
  direction?: 'up' | 'down';
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

const StatusDropdown = ({ initialStatus, avatarUri, direction = 'down', isOpen, onToggle, onClose }: StatusDropdownProps) => {
  const { t } = useTranslation();
  const [statusId, setStatusId] = React.useState(initialStatus);
  const options = [
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

const UsersScreen = () => {
  const { t } = useTranslation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const barAnim = useRef(new Animated.Value(0)).current;
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

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
  }, [fadeAnim, barAnim]);

  const handleOutsidePress = () => {
    if (openDropdownId) {
      setOpenDropdownId(null);
    }
  };

  return (
    <Animated.ScrollView
      showsVerticalScrollIndicator={false}
      style={{ opacity: fadeAnim }}
      onScrollBeginDrag={handleOutsidePress}
      scrollEventThrottle={16}
    >
      <TouchableWithoutFeedback onPress={handleOutsidePress}>
        <View style={styles.scrollContent}>
      {/* Top Actions Row */}
      <View style={styles.topActionsRow}>
        <TouchableOpacity activeOpacity={0.7} style={styles.filterBtn}>
          <FilterIcon size={18} color={colors.textPrimary} />
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.8} style={styles.addLeadBtn}>
          <PlusIcon size={13} color={colors.textPrimary} />
          <Text style={styles.addLeadText}>{t('dashboard.addNewLead')}</Text>
        </TouchableOpacity>
      </View>

      {/* New Leads Header */}
      <View style={styles.sectionHeaderRow}>
        <UsersIcon size={16} color={colors.textSecondary} />
        <Text style={styles.sectionHeaderText}>{t('users.newLeads')} <Text style={styles.sectionHeaderCount}>(2)</Text></Text>
      </View>

      {/* Hot Lead Card */}
      <View style={[styles.leadCard, { zIndex: 2 }]}>
        {/* Card Top Label Row */}
        <View style={styles.cardTopRow}>
          <View style={styles.hotLeadBadge}>
            <FireIcon size={14} />
            <Text style={styles.hotLeadText}>HOT LEAD</Text>
          </View>
          <TouchableOpacity activeOpacity={0.7} style={styles.openBtn}>
            <ArrowUpRightIcon size={12} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Profile Row */}
        <View style={styles.profileRow}>
          <Image source={{ uri: 'https://randomuser.me/api/portraits/men/85.jpg' }} style={styles.avatar} resizeMode="cover" />
          <View style={styles.profileDetails}>
            <Text style={styles.name}>Daniel Mercer</Text>
            <Text style={styles.company}>Brightway Logistics</Text>
            <View style={styles.contactRow}>
              <MailIcon size={10} color={colors.textMuted} />
              <Text style={styles.contactText}>daniel.m@brightway.com</Text>
            </View>
            <View style={styles.contactRow}>
              <PhoneIcon size={10} color={colors.textMuted} />
              <Text style={styles.contactText}>+1 (312) 555-0743</Text>
            </View>
          </View>
        </View>

        <Text style={styles.subtext}>{t('users.recentlyRequested', 'Recently requested a proposal')}</Text>

        {/* High Interest Progress */}
        <View style={styles.interestSection}>
          <View style={styles.interestRow}>
            <Text style={styles.interestLabel}>{t('users.highInterest', 'High Interest')}</Text>
            <Text style={styles.interestValue}>86%</Text>
          </View>
          <Animated.View style={[styles.progressContainer, { opacity: barAnim }]}>
            <View style={styles.ticksContainer}>
              {Array.from({ length: 30 }).map((_, idx) => (
                <View key={idx} style={styles.tickItem} />
              ))}
            </View>
            <View style={styles.progressTrack}>
              <Animated.View style={[styles.progressFill, { flex: barAnim.interpolate({ inputRange: [0, 1], outputRange: [0.0001, 0.86] }) }]} />
              <View style={styles.progressHandle} />
              <Animated.View style={[styles.progressEmpty, { flex: barAnim.interpolate({ inputRange: [0, 1], outputRange: [0.9999, 0.14] }) }]} />
            </View>
          </Animated.View>
        </View>

        {/* Source Badges */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>{t('users.source', 'Source')}</Text>
          <View style={styles.badgesRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{t('users.referral', 'Referral')}</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{t('users.agentAdded', 'Agent Added')}</Text>
            </View>
          </View>
        </View>

        {/* Status & Actions */}
        <View style={[styles.statusSectionContainer, { zIndex: 20 }]}>
          <Text style={styles.sectionLabel}>{t('users.status', 'Status')}</Text>
          <View style={styles.statusActionRow}>
            <StatusDropdown 
              initialStatus="Call Scheduled" 
              avatarUri="https://randomuser.me/api/portraits/women/68.jpg"
              isOpen={openDropdownId === 'daniel'}
              onToggle={() => setOpenDropdownId(openDropdownId === 'daniel' ? null : 'daniel')}
              onClose={() => setOpenDropdownId(null)}
            />
            
            <View style={styles.actionButtonsRow}>
              <TouchableOpacity activeOpacity={0.7} style={styles.actionBtnOutline}>
                <MailIcon size={16} color={colors.textPrimary} />
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.7} style={styles.actionBtnSolid}>
                <VideoCameraIcon size={16} color={colors.background} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {/* Second Lead Card */}
      <View style={[styles.leadCard, { marginTop: 16, zIndex: 1 }]}>
        {/* Card Top Label Row */}
        <View style={[styles.cardTopRow, { justifyContent: 'flex-end' }]}>
          <TouchableOpacity activeOpacity={0.7} style={styles.openBtn}>
            <ArrowUpRightIcon size={12} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Profile Row */}
        <View style={styles.profileRow}>
          <Image source={{ uri: 'https://randomuser.me/api/portraits/women/45.jpg' }} style={styles.avatar} resizeMode="cover" />
          <View style={styles.profileDetails}>
            <Text style={styles.name}>Sarah Jenkins</Text>
            <Text style={styles.company}>Global Tech Solutions</Text>
            <View style={styles.contactRow}>
              <MailIcon size={10} color={colors.textMuted} />
              <Text style={styles.contactText}>s.jenkins@gts.com</Text>
            </View>
            <View style={styles.contactRow}>
              <PhoneIcon size={10} color={colors.textMuted} />
              <Text style={styles.contactText}>+1 (415) 555-8901</Text>
            </View>
          </View>
        </View>

        <Text style={styles.subtext}>{t('users.interestedEnterprise', 'Interested in enterprise plan')}</Text>

        {/* High Interest Progress */}
        <View style={styles.interestSection}>
          <View style={styles.interestRow}>
            <Text style={styles.interestLabel}>{t('users.mediumInterest', 'Medium Interest')}</Text>
            <Text style={styles.interestValue}>64%</Text>
          </View>
          <Animated.View style={[styles.progressContainer, { opacity: barAnim }]}>
            <View style={styles.ticksContainer}>
              {Array.from({ length: 30 }).map((_, idx) => (
                <View key={idx} style={styles.tickItem} />
              ))}
            </View>
            <View style={styles.progressTrack}>
              <Animated.View style={[styles.progressFill, { backgroundColor: '#34C759', flex: barAnim.interpolate({ inputRange: [0, 1], outputRange: [0.0001, 0.64] }) }]} />
              <View style={styles.progressHandle} />
              <Animated.View style={[styles.progressEmpty, { flex: barAnim.interpolate({ inputRange: [0, 1], outputRange: [0.9999, 0.36] }) }]} />
            </View>
          </Animated.View>
        </View>

        {/* Source Badges */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>{t('users.source', 'Source')}</Text>
          <View style={styles.badgesRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{t('users.organicSearch', 'Organic Search')}</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{t('users.webinar', 'Webinar')}</Text>
            </View>
          </View>
        </View>

        {/* Status & Actions */}
        <View style={[styles.statusSectionContainer, { zIndex: 10 }]}>
          <Text style={styles.sectionLabel}>{t('users.status', 'Status')}</Text>
          <View style={styles.statusActionRow}>
            <StatusDropdown 
              initialStatus="Follow-up Email" 
              avatarUri="https://randomuser.me/api/portraits/women/68.jpg" 
              direction="up" 
              isOpen={openDropdownId === 'sarah'}
              onToggle={() => setOpenDropdownId(openDropdownId === 'sarah' ? null : 'sarah')}
              onClose={() => setOpenDropdownId(null)}
            />
            
            <View style={styles.actionButtonsRow}>
              <TouchableOpacity activeOpacity={0.7} style={styles.actionBtnOutline}>
                <MailIcon size={16} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
        </View>
      </TouchableWithoutFeedback>
    </Animated.ScrollView>
  );
};

const styles = StyleSheet.create({
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
    elevation: 2,
  },
  addLeadBtn: {
    backgroundColor: colors.cardBackground,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 22,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
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
});

export default UsersScreen;
