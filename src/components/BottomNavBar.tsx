import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import colors from '../constants/colors';

// Nav Bar Icons
const DashboardNavIcon = ({ size = 20, color = colors.textPrimary }) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    <View style={{ width: size * 0.8, height: size * 0.8, borderRadius: size * 0.25, borderWidth: 1.8, borderColor: color }} />
    <View style={{ position: 'absolute', width: size * 0.8, height: 1.8, backgroundColor: color }} />
    <View style={{ position: 'absolute', width: 1.8, height: size * 0.8, backgroundColor: color }} />
  </View>
);

const UsersIcon = ({ size = 18, color = colors.textSecondary }) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    <View
      style={{
        width: size * 0.45,
        height: size * 0.45,
        borderRadius: size * 0.225,
        borderWidth: 1.6,
        borderColor: color,
        marginBottom: 1,
      }}
    />
    <View
      style={{
        width: size * 0.75,
        height: size * 0.3,
        borderTopLeftRadius: size * 0.35,
        borderTopRightRadius: size * 0.35,
        borderWidth: 1.6,
        borderColor: color,
        borderBottomWidth: 0,
      }}
    />
  </View>
);

const PieChartNavIcon = ({ size = 20, color = colors.textSecondary }) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    <View style={{ width: size * 0.8, height: size * 0.8, borderRadius: size * 0.4, borderWidth: 1.8, borderColor: color }} />
    <View style={{ width: size * 0.4, height: 1.8, backgroundColor: color, position: 'absolute', top: size * 0.4, right: size * 0.1 }} />
    <View style={{ width: 1.8, height: size * 0.4, backgroundColor: color, position: 'absolute', top: size * 0.1, left: size * 0.4 }} />
  </View>
);

const BarChartNavIcon = ({ size = 20, color = colors.textSecondary }) => (
  <View style={{ width: size, height: size, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: 2.5 }}>
    <View style={{ width: 3, height: size * 0.4, backgroundColor: color, borderRadius: 1 }} />
    <View style={{ width: 3, height: size * 0.75, backgroundColor: color, borderRadius: 1 }} />
    <View style={{ width: 3, height: size * 0.55, backgroundColor: color, borderRadius: 1 }} />
  </View>
);

const LightbulbNavIcon = ({ size = 20, color = colors.textSecondary }) => (
  <View style={{ width: size, height: size, alignItems: 'center' }}>
    <View style={{ width: size * 0.7, height: size * 0.7, borderRadius: size * 0.35, borderWidth: 1.8, borderColor: color, borderBottomWidth: 0, top: 1 }} />
    <View style={{ width: size * 0.35, height: size * 0.2, borderWidth: 1.8, borderColor: color, borderTopWidth: 0, borderBottomLeftRadius: 2, borderBottomRightRadius: 2 }} />
    <View style={{ width: size * 0.15, height: 1.8, backgroundColor: color, marginTop: 1 }} />
  </View>
);

export type TabType = 'key' | 'users' | 'pie' | 'bar' | 'lightbulb' | 'add_lead' | 'total_leads' | 'conversion_rate' | 'revenue_growth' | 'notifications' | 'settings' | 'sort';
interface BottomNavBarProps {
  activeTab?: TabType;
  onTabChange?: (tab: TabType) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab: externalActiveTab,
  onTabChange,
}) => {
  const insets = useSafeAreaInsets();
  const [internalActiveTab, setInternalActiveTab] = useState<TabType>('users');

  const currentTab = externalActiveTab ?? internalActiveTab;

  const handleTabPress = (tab: TabType) => {
    if (!externalActiveTab) {
      setInternalActiveTab(tab);
    }
    onTabChange?.(tab);
  };

  return (
    <View style={[styles.bottomNav, { bottom: Math.max(insets.bottom + 8, 20) }]}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => handleTabPress('key')}
        style={currentTab === 'key' ? styles.navItemActive : styles.navItem}
      >
        <DashboardNavIcon size={18} color={currentTab === 'key' ? colors.textPrimary : colors.textSecondary} />
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => handleTabPress('users')}
        style={currentTab === 'users' ? styles.navItemActive : styles.navItem}
      >
        <UsersIcon size={20} color={colors.textPrimary} />
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => handleTabPress('pie')}
        style={currentTab === 'pie' ? styles.navItemActive : styles.navItem}
      >
        <PieChartNavIcon size={20} color={currentTab === 'pie' ? colors.textPrimary : colors.textSecondary} />
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => handleTabPress('bar')}
        style={currentTab === 'bar' ? styles.navItemActive : styles.navItem}
      >
        <BarChartNavIcon size={20} color={currentTab === 'bar' ? colors.textPrimary : colors.textSecondary} />
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => handleTabPress('lightbulb')}
        style={currentTab === 'lightbulb' ? styles.navItemActive : styles.navItem}
      >
        <LightbulbNavIcon size={18} color={currentTab === 'lightbulb' ? colors.textPrimary : colors.textSecondary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomNav: {
    position: 'absolute',
    left: 24,
    right: 24,
    height: 66,
    backgroundColor: colors.cardBackground,
    borderRadius: 33,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  navItem: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navItemInactiveKey: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.limeLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navItemActive: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.limeAccent,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BottomNavBar;
