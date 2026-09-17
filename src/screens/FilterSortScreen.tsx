import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { ThemeColors } from '../constants/colors';
import { TabType } from '../components/BottomNavBar';
import { useTranslation } from 'react-i18next';
import { CheckCircleIcon, ArrowUpRightIcon } from '../components/icons/Icons'; // Assuming we can repurpose some icons

interface FilterSortScreenProps {
  onApply?: () => void;
}

const FilterSortScreen: React.FC<FilterSortScreenProps> = ({ onApply }) => {
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors, isDark);
  const { t } = useTranslation();

  const [activeSort, setActiveSort] = useState('newest');
  const [activeStatus, setActiveStatus] = useState<string[]>(['new', 'contacted']);
  const [activeTimeframe, setActiveTimeframe] = useState('this_month');

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const toggleStatus = (status: string) => {
    if (activeStatus.includes(status)) {
      setActiveStatus(prev => prev.filter(s => s !== status));
    } else {
      setActiveStatus(prev => [...prev, status]);
    }
  };

  const renderSectionHeader = (title: string) => (
    <Text style={styles.sectionHeader}>{title}</Text>
  );

  const renderPill = (label: string, isActive: boolean, onPress: () => void) => {
    return (
      <TouchableOpacity 
        activeOpacity={0.7}
        onPress={onPress}
        style={[styles.pill, isActive && styles.pillActive]}
      >
        <Text style={[styles.pillText, isActive && styles.pillTextActive]}>{label}</Text>
      </TouchableOpacity>
    );
  };

  const renderSortOption = (id: string, label: string) => {
    const isActive = activeSort === id;
    return (
      <TouchableOpacity 
        activeOpacity={0.7} 
        style={[styles.sortRow, isActive && styles.sortRowActive]} 
        onPress={() => setActiveSort(id)}
      >
        <Text style={[styles.sortText, isActive && styles.sortTextActive]}>{label}</Text>
        {isActive && <CheckCircleIcon size={20} color={colors.primary} />}
      </TouchableOpacity>
    );
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Sort By Section */}
        <View style={styles.section}>
          {renderSectionHeader(t('filter.sortBy', 'Sort By'))}
          <View style={styles.sortContainer}>
            {renderSortOption('newest', t('filter.newestFirst', 'Newest First'))}
            {renderSortOption('highest_value', t('filter.highestValue', 'Highest Value'))}
            {renderSortOption('closing_soon', t('filter.closingSoon', 'Closing Soon'))}
            {renderSortOption('priority', t('filter.highPriority', 'High Priority'))}
          </View>
        </View>

        {/* Lead Status Section */}
        <View style={styles.section}>
          {renderSectionHeader(t('filter.leadStatus', 'Lead Status'))}
          <View style={styles.pillContainer}>
            {renderPill(t('status.new', 'New'), activeStatus.includes('new'), () => toggleStatus('new'))}
            {renderPill(t('status.contacted', 'Contacted'), activeStatus.includes('contacted'), () => toggleStatus('contacted'))}
            {renderPill(t('status.proposalSent', 'Proposal Sent'), activeStatus.includes('proposal'), () => toggleStatus('proposal'))}
            {renderPill(t('status.negotiation', 'Negotiation'), activeStatus.includes('negotiation'), () => toggleStatus('negotiation'))}
            {renderPill(t('status.closedWon', 'Closed Won'), activeStatus.includes('won'), () => toggleStatus('won'))}
            {renderPill(t('status.closedLost', 'Closed Lost'), activeStatus.includes('lost'), () => toggleStatus('lost'))}
          </View>
        </View>

        {/* Timeframe Section */}
        <View style={styles.section}>
          {renderSectionHeader(t('filter.timeframe', 'Timeframe'))}
          <View style={styles.pillContainer}>
            {renderPill(t('timeframe.thisWeek', 'This Week'), activeTimeframe === 'this_week', () => setActiveTimeframe('this_week'))}
            {renderPill(t('timeframe.thisMonth', 'This Month'), activeTimeframe === 'this_month', () => setActiveTimeframe('this_month'))}
            {renderPill(t('timeframe.last30Days', 'Last 30 Days'), activeTimeframe === 'last_30', () => setActiveTimeframe('last_30'))}
            {renderPill(t('timeframe.thisQuarter', 'This Quarter'), activeTimeframe === 'this_quarter', () => setActiveTimeframe('this_quarter'))}
            {renderPill(t('timeframe.thisYear', 'This Year'), activeTimeframe === 'this_year', () => setActiveTimeframe('this_year'))}
          </View>
        </View>

        {/* Inline Actions */}
        <View style={styles.footer}>
          <TouchableOpacity 
            activeOpacity={0.7} 
            style={styles.resetButton}
            onPress={() => {
              setActiveSort('newest');
              setActiveStatus(['new', 'contacted']);
              setActiveTimeframe('this_month');
            }}
          >
            <Text style={styles.resetButtonText}>{t('common.reset', 'Reset')}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            activeOpacity={0.8} 
            style={styles.applyButton}
            onPress={onApply}
          >
            <Text style={styles.applyButtonText}>{t('common.applyFilters', 'Apply Filters')}</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </Animated.View>
  );
};

const getStyles = (colors: ThemeColors, isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 120, // space for fixed footer + bottom nav
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sortContainer: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sortRowActive: {
    backgroundColor: isDark ? colors.secondaryBackground : '#F9FAFB',
  },
  sortText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  sortTextActive: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  pillContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  pill: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pillActive: {
    backgroundColor: colors.limeAccent,
    borderColor: colors.limeAccent,
  },
  pillText: {
    fontSize: 15,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  pillTextActive: {
    color: '#111318',
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  resetButton: {
    flex: 1,
    backgroundColor: colors.cardBackground,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  applyButton: {
    flex: 2,
    backgroundColor: colors.limeAccent,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.limeAccent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111318', // Always dark for contrast on lime
  }
});

export default FilterSortScreen;
