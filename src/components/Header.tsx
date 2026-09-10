import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import colors from '../constants/colors';
import { BellIcon, MenuIcon } from './icons/Icons';
import LanguageSwitcher from './LanguageSwitcher';

import { TabType } from './BottomNavBar';

interface HeaderProps {
  title?: string;
  onNavigate?: (screen: TabType) => void;
}

const Header: React.FC<HeaderProps> = ({ title = "AI Client Overview", onNavigate }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={styles.headerActions}>
        <LanguageSwitcher />
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

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.4,
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
