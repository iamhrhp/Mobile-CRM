import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { ThemeColors } from '../constants/colors';

// Nav Bar Icons
const HomeNavIcon = ({ size = 20, color = '#A0A3BD' }) => (
  <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
    {/* Roof */}
    <View style={{ width: size * 0.6, height: size * 0.6, borderWidth: 1.8, borderColor: color, transform: [{ rotate: '45deg' }], borderBottomWidth: 0, borderRightWidth: 0, position: 'absolute', top: size * 0.15, borderRadius: 2 }} />
    {/* Base */}
    <View style={{ width: size * 0.65, height: size * 0.4, borderWidth: 1.8, borderColor: color, borderTopWidth: 0, position: 'absolute', bottom: size * 0.1, borderBottomLeftRadius: 2, borderBottomRightRadius: 2 }} />
  </View>
);

const AINavIcon = ({ size = 20, color = '#A0A3BD' }) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    <View style={{ width: size * 0.6, height: size * 0.6, borderWidth: 1.8, borderColor: color, transform: [{ rotate: '45deg' }], borderRadius: 2 }} />
    <View style={{ width: size * 0.25, height: size * 0.25, backgroundColor: color, transform: [{ rotate: '45deg' }], position: 'absolute', top: size * 0.1, right: size * 0.1 }} />
    <View style={{ width: size * 0.15, height: size * 0.15, backgroundColor: color, transform: [{ rotate: '45deg' }], position: 'absolute', bottom: size * 0.15, left: size * 0.15 }} />
  </View>
);

const PipelineNavIcon = ({ size = 20, color = '#A0A3BD' }) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center', gap: 4 }}>
    <View style={{ width: size * 0.9, height: 2, backgroundColor: color, borderRadius: 1 }} />
    <View style={{ width: size * 0.6, height: 2, backgroundColor: color, borderRadius: 1 }} />
    <View style={{ width: size * 0.3, height: 2, backgroundColor: color, borderRadius: 1 }} />
  </View>
);

const ForecastNavIcon = ({ size = 20, color = '#A0A3BD' }) => (
  <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
    <View style={{ width: size * 0.9, height: size * 0.9, borderRadius: size * 0.45, borderWidth: 1.8, borderColor: color, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ width: size * 0.4, height: 1.8, backgroundColor: color, transform: [{ rotate: '-45deg' }], marginLeft: -1, marginTop: 1 }} />
      <View style={{ width: size * 0.2, height: size * 0.2, borderTopWidth: 1.8, borderRightWidth: 1.8, borderColor: color, position: 'absolute', top: size * 0.2, right: size * 0.2 }} />
    </View>
  </View>
);

const LightbulbNavIcon = ({ size = 20, color = '#A0A3BD' }) => (
  <View style={{ width: size, height: size, alignItems: 'center' }}>
    <View style={{ width: size * 0.7, height: size * 0.7, borderRadius: size * 0.35, borderWidth: 1.8, borderColor: color, borderBottomWidth: 0, top: 1 }} />
    <View style={{ width: size * 0.35, height: size * 0.2, borderWidth: 1.8, borderColor: color, borderTopWidth: 0, borderBottomLeftRadius: 2, borderBottomRightRadius: 2 }} />
    <View style={{ width: size * 0.15, height: 1.8, backgroundColor: color, marginTop: 1 }} />
  </View>
);

export type TabType = 'key' | 'users' | 'pie' | 'bar' | 'lightbulb' | 'add_lead' | 'total_leads' | 'conversion_rate' | 'revenue_growth' | 'notifications' | 'settings' | 'sort' | 'lead_details' | 'total_clients' | 'active_clients' | 'engagement_ltv';
interface BottomNavBarProps {
  activeTab?: TabType;
  onTabChange?: (tab: TabType) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab: externalActiveTab,
  onTabChange,
}) => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = getStyles(colors);
  
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
        <HomeNavIcon size={20} color={currentTab === 'key' ? colors.textPrimary : colors.textSecondary} />
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => handleTabPress('users')}
        style={currentTab === 'users' ? styles.navItemActive : styles.navItem}
      >
        <AINavIcon size={20} color={currentTab === 'users' ? colors.textPrimary : colors.textSecondary} />
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => handleTabPress('pie')}
        style={currentTab === 'pie' ? styles.navItemActive : styles.navItem}
      >
        <PipelineNavIcon size={18} color={currentTab === 'pie' ? colors.textPrimary : colors.textSecondary} />
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => handleTabPress('bar')}
        style={currentTab === 'bar' ? styles.navItemActive : styles.navItem}
      >
        <ForecastNavIcon size={20} color={currentTab === 'bar' ? colors.textPrimary : colors.textSecondary} />
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

const getStyles = (colors: ThemeColors) => StyleSheet.create({
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
