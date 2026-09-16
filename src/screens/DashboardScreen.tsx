import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, Text, Animated } from 'react-native';
import { FilterIcon, PlusIcon, UsersIcon, ConversionIcon } from '../components/icons/Icons';
import MetricCard from '../components/MetricCard';
import RevenueChart from '../components/RevenueChart';
import { ThemeColors } from '../constants/colors';
import { useTheme } from '../context/ThemeContext';
import { TabType } from '../components/BottomNavBar';
import { useTranslation } from 'react-i18next';

interface DashboardScreenProps {
  onNavigate?: (screen: TabType) => void;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ onNavigate }) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = getStyles(colors);
  
  // Animation Values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const barAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fadeAnim.setValue(0);
    barAnim.setValue(0);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(barAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: false,
      })
    ]).start();
  }, [fadeAnim, barAnim]);

  return (
    <Animated.ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
      style={{ opacity: fadeAnim }}
    >
      {/* Hero Row with 3D Building & Add Lead Button */}
      <View style={styles.heroRow}>
        <View style={styles.buildingContainer}>
          <Image
            source={require('../../assets/building.jpg')}
            style={styles.buildingImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.heroRightActions}>
          <TouchableOpacity activeOpacity={0.7} style={styles.heroFilterBtn} onPress={() => onNavigate?.('sort')}>
            <FilterIcon size={18} color={colors.textPrimary} />
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.8} style={styles.addLeadBtn} onPress={() => onNavigate?.('add_lead')}>
            <PlusIcon size={13} color={colors.textPrimary} />
            <Text style={styles.addLeadText}>{t('dashboard.addNewLead')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 2 Side-by-Side Metric Cards */}
      <View style={styles.cardsRow}>
        <MetricCard
          title={t('dashboard.totalLeads')}
          value="1232"
          badgeText="+8%"
          badgeType="positive"
          icon={<UsersIcon size={16} color={colors.textSecondary} />}
          activeColor={colors.limeAccent}
          fadeAnim={fadeAnim}
          barAnim={barAnim}
          activeFlex={0.7}
          onPress={() => onNavigate?.('total_leads')}
        />
        <MetricCard
          title={t('dashboard.conversionRate')}
          value="32.5"
          badgeText="-1.2%"
          badgeType="negative"
          icon={<ConversionIcon size={16} color={colors.textSecondary} />}
          activeColor={colors.primary}
          fadeAnim={fadeAnim}
          barAnim={barAnim}
          activeFlex={0.75}
          onPress={() => onNavigate?.('conversion_rate')}
        />
      </View>

      {/* Revenue Growth Section Card */}
      <RevenueChart barAnim={barAnim} onPress={() => onNavigate?.('revenue_growth')} />
    </Animated.ScrollView>
  );
};

const getStyles = (colors: ThemeColors) => StyleSheet.create({
  scrollContent: {
    paddingBottom: 110,
  },
  heroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    marginTop: 4,
    marginBottom: 16,
  },
  buildingContainer: {
    width: 175,
    height: 155,
    borderRadius: 20,
    overflow: 'hidden',
  },
  buildingImage: {
    width: '100%',
    height: '100%',
  },
  heroRightActions: {
    alignItems: 'flex-end',
    gap: 12,
    marginTop: 6,
  },
  heroFilterBtn: {
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
  },
  addLeadText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  cardsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 16,
  },
});

export default DashboardScreen;
