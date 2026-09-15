import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, I18nManager } from 'react-native';
import { ThemeColors } from '../constants/colors';
import { BellIcon, MenuIcon, ChevronDownIcon } from './icons/Icons';
import { useTheme } from '../context/ThemeContext';

import { TabType } from './BottomNavBar';

interface HeaderProps {
  title?: string;
  onNavigate?: (screen: TabType) => void;
  showBack?: boolean;
  onBack?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title = "AI Client Overview", onNavigate, showBack, onBack }) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  return (
    <View style={styles.header}>
      <View style={styles.leftContainer}>
        {showBack && (
          <TouchableOpacity activeOpacity={0.7} onPress={onBack} style={styles.backButton}>
            <View style={{ transform: [{ rotate: '90deg' }] }}>
              <ChevronDownIcon size={20} color={colors.textPrimary} />
            </View>
          </TouchableOpacity>
        )}
        <Text style={[styles.headerTitle, { [I18nManager.isRTL ? 'marginLeft' : 'marginRight']: 16 }]} numberOfLines={2}>{title}</Text>
      </View>
      <View style={styles.headerActions}>
        <TouchableOpacity activeOpacity={0.7} style={styles.iconBtn} onPress={() => onNavigate?.('notifications')}>
          <BellIcon size={20} color={colors.textPrimary} />
          <View style={styles.notificationDot} />
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.7} style={styles.iconBtn} onPress={() => onNavigate?.('settings')}>
          <MenuIcon size={20} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const getStyles = (colors: ThemeColors) => StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
    gap: 16,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.4,
    flexShrink: 1,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 10,
  },
  iconBtn: {
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
  notificationDot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: colors.notificationDot,
  },
});

export default Header;
