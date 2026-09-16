import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, Image, TouchableOpacity, Animated, Linking, Platform, Alert } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { ThemeColors } from '../constants/colors';
import { MOCK_LEADS } from '../data/mockLeads';
import { useCurrency } from '../hooks/useCurrency';
import { PhoneIcon, MailIcon, CalendarIcon } from '../components/icons/Icons';

interface LeadDetailsScreenProps {
  leadId: string | null;
}

const LeadDetailsScreen: React.FC<LeadDetailsScreenProps> = ({ leadId }) => {
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors, isDark);
  const currency = useCurrency();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const lead = MOCK_LEADS.find(l => l.id === leadId);

  if (!lead) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Lead not found</Text>
      </View>
    );
  }

  const primaryColor = lead.colorType === 'primary' ? colors.textPrimary : colors.limeAccent;
  const textColorOnPrimary = lead.colorType === 'primary' ? colors.background : colors.textPrimary;

  const handleCall = () => {
    if (lead.phone) {
      Linking.openURL(`tel:${lead.phone}`).catch(() => {
        Alert.alert('Error', 'Unable to open dialer.');
      });
    } else {
      Alert.alert('No Phone Number', 'This lead does not have a phone number.');
    }
  };

  const handleEmail = () => {
    if (lead.email) {
      Linking.openURL(`mailto:${lead.email}`).catch(() => {
        Alert.alert('Error', 'Unable to open mail client.');
      });
    } else {
      Alert.alert('No Email', 'This lead does not have an email address.');
    }
  };

  const handleSchedule = () => {
    const title = encodeURIComponent(`Meeting with ${lead.name}`);
    const url = `https://calendar.google.com/calendar/r/eventedit?text=${title}`;
    Linking.openURL(url).catch(() => {
      if (Platform.OS === 'ios') {
        Linking.openURL('calshow://');
      } else {
        Linking.openURL('content://com.android.calendar/time/');
      }
    });
  };

  return (
    <Animated.ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <Animated.View style={[styles.headerCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.headerTop}>
          <Image source={{ uri: lead.avatarUri }} style={styles.avatar} />
          <View style={styles.headerInfo}>
            <Text style={styles.name}>{lead.name}</Text>
            <Text style={styles.company}>{lead.company}</Text>
            <View style={[styles.statusBadge, { backgroundColor: lead.colorType === 'primary' ? colors.textPrimary : colors.limeLight }]}>
              <Text style={[styles.statusText, { color: lead.colorType === 'primary' ? colors.background : colors.textPrimary }]}>
                {lead.status}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.valueRow}>
          <View>
            <Text style={styles.valueLabel}>Deal Value</Text>
            <Text style={styles.valueText}>{currency}{lead.value}K</Text>
          </View>
          <View>
            <Text style={styles.valueLabel}>Probability</Text>
            <Text style={styles.valueText}>{lead.progress}%</Text>
          </View>
        </View>
        
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${lead.progress}%`, backgroundColor: primaryColor }]} />
        </View>
      </Animated.View>

      <Animated.View style={[styles.actionsRow, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <TouchableOpacity activeOpacity={0.7} style={styles.actionBtn} onPress={handleCall}>
          <PhoneIcon size={20} color={colors.textPrimary} />
          <Text style={styles.actionBtnText}>Call</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.7} style={styles.actionBtn} onPress={handleEmail}>
          <MailIcon size={20} color={colors.textPrimary} />
          <Text style={styles.actionBtnText}>Email</Text>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.7} style={styles.actionBtn} onPress={handleSchedule}>
          <CalendarIcon size={20} color={colors.textPrimary} />
          <Text style={styles.actionBtnText}>Schedule</Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View style={[styles.section, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <Text style={styles.sectionTitle}>Contact Details</Text>
        <View style={styles.detailRow}>
          <MailIcon size={16} color={colors.textSecondary} />
          <Text style={styles.detailText}>{lead.email || 'No email provided'}</Text>
        </View>
        <View style={styles.detailRow}>
          <PhoneIcon size={16} color={colors.textSecondary} />
          <Text style={styles.detailText}>{lead.phone || 'No phone provided'}</Text>
        </View>
      </Animated.View>

      <Animated.View style={[styles.section, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityRow}>
          <View style={styles.activityDot} />
          <View style={styles.activityContent}>
            <Text style={styles.activityText}>{lead.recentActivity}</Text>
            <Text style={styles.activityTime}>{lead.days} ago</Text>
          </View>
        </View>
      </Animated.View>

      <Animated.View style={[styles.section, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <Text style={styles.sectionTitle}>Notes</Text>
        <View style={styles.noteCard}>
          <Text style={styles.noteText}>{lead.notes || 'No notes available.'}</Text>
        </View>
      </Animated.View>
    </Animated.ScrollView>
  );
};

const getStyles = (colors: ThemeColors, isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  headerCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: isDark ? 0.2 : 0.04,
    shadowRadius: 12,
    elevation: 3,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 16,
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
    alignItems: 'flex-start',
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  company: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  valueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  valueLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  valueText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  progressContainer: {
    height: 6,
    backgroundColor: isDark ? colors.secondaryBackground : '#F0F0F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: colors.cardBackground,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isDark ? 0.1 : 0.03,
    shadowRadius: 8,
    elevation: 2,
    gap: 8,
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
    backgroundColor: colors.cardBackground,
    padding: 16,
    borderRadius: 16,
  },
  detailText: {
    fontSize: 14,
    color: colors.textPrimary,
    flex: 1,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    backgroundColor: colors.cardBackground,
    padding: 16,
    borderRadius: 16,
  },
  activityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.limeAccent,
    marginTop: 4,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    color: colors.textPrimary,
    fontWeight: '500',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  noteCard: {
    backgroundColor: isDark ? colors.secondaryBackground : '#F7F7F9',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: isDark ? colors.border : '#E8E8E8',
  },
  noteText: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.textPrimary,
  },
});

export default LeadDetailsScreen;
