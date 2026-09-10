import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { ThemeColors } from '../constants/colors';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../hooks/useCurrency';
import { UsersIcon, BellIcon, ConversionIcon, TrendingIcon } from '../components/icons/Icons';

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'lead' | 'alert' | 'deal' | 'system';
  isRead: boolean;
}

const DUMMY_NOTIFICATIONS = (t: any, currency: string): { title: string; data: Notification[] }[] => [
  {
    title: t('notifications.today', 'Today'),
    data: [
      {
        id: '1',
        title: t('notifications.newLead', 'New Lead Assigned'),
        description: t('notifications.newLeadDesc', 'Sarah Jenkins from Acme Corp has been assigned to you.'),
        time: t('notifications.time2h', '2h ago'),
        type: 'lead',
        isRead: false,
      },
      {
        id: '2',
        title: t('notifications.dealClosed', 'Deal Closed'),
        description: t('notifications.dealClosedDesc', { currency, defaultValue: `TechFlow Enterprise contract signed. Value: ${currency}45,000.` }),
        time: t('notifications.time4h', '4h ago'),
        type: 'deal',
        isRead: false,
      }
    ]
  },
  {
    title: t('notifications.earlier', 'Earlier'),
    data: [
      {
        id: '3',
        title: t('notifications.meetingReminder', 'Meeting Reminder'),
        description: t('notifications.meetingReminderDesc', 'Quarterly review with the Alpha Team starts in 15 mins.'),
        time: t('notifications.time1d', '1d ago'),
        type: 'alert',
        isRead: true,
      },
      {
        id: '4',
        title: t('notifications.systemUpdate', 'System Update'),
        description: t('notifications.systemUpdateDesc', 'CRM maintenance scheduled for Saturday 2:00 AM PST.'),
        time: t('notifications.time2d', '2d ago'),
        type: 'system',
        isRead: true,
      },
      {
        id: '5',
        title: t('notifications.leadFollowUp', 'Lead Follow-up'),
        description: t('notifications.leadFollowUpDesc', 'You haven\'t contacted Mark Johnson in 7 days.'),
        time: t('notifications.time3d', '3d ago'),
        type: 'lead',
        isRead: true,
      }
    ]
  }
];

const NotificationsScreen = () => {
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors, isDark);
  const { t } = useTranslation();
  const currency = useCurrency();
  const [notifications, setNotifications] = useState(DUMMY_NOTIFICATIONS(t, currency));
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(section => ({
      ...section,
      data: section.data.map(n => ({ ...n, isRead: true }))
    })));
  };

  const toggleRead = (sectionIndex: number, id: string) => {
    setNotifications(prev => prev.map((section, idx) => {
      if (idx === sectionIndex) {
        return {
          ...section,
          data: section.data.map(n => n.id === id ? { ...n, isRead: !n.isRead } : n)
        };
      }
      return section;
    }));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'lead': return <UsersIcon size={20} color={colors.textPrimary} />;
      case 'deal': return <ConversionIcon size={20} color={colors.textPrimary} />;
      case 'alert': return <BellIcon size={20} color={colors.textPrimary} />;
      case 'system': return <TrendingIcon size={20} color={colors.textPrimary} />;
      default: return <BellIcon size={20} color={colors.textPrimary} />;
    }
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.headerRow}>
        <Text style={styles.screenTitle}>{t('notifications.title', 'Notifications')}</Text>
        <TouchableOpacity activeOpacity={0.7} onPress={markAllAsRead}>
          <Text style={styles.markReadText}>{t('notifications.markAll', 'Mark all as read')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {notifications.map((section, sIdx) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionHeader}>{section.title}</Text>
            
            {section.data.map(item => (
              <TouchableOpacity 
                key={item.id}
                activeOpacity={0.7}
                style={[styles.notificationCard, !item.isRead && styles.unreadCard]}
                onPress={() => toggleRead(sIdx, item.id)}
              >
                <View style={styles.iconContainer}>
                  {getIcon(item.type)}
                </View>
                
                <View style={styles.textContainer}>
                  <Text style={[styles.title, !item.isRead && styles.unreadText]}>{item.title}</Text>
                  <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
                  <Text style={styles.time}>{item.time}</Text>
                </View>

                {!item.isRead && <View style={styles.unreadDot} />}
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </Animated.View>
  );
};

const getStyles = (colors: ThemeColors, isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  markReadText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.limeAccent,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 110,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  notificationCard: {
    flexDirection: 'row',
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  unreadCard: {
    backgroundColor: isDark ? colors.secondaryBackground : '#F9FAFB',
    borderColor: isDark ? colors.border : '#E5E7EB',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  unreadText: {
    fontWeight: '700',
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 6,
    lineHeight: 20,
  },
  time: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '500',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.notificationDot,
    marginTop: 6,
  }
});

export default NotificationsScreen;
