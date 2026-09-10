import React, { useState } from 'react';
import { StyleSheet, View, StatusBar, Animated } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import colors from './src/constants/colors';
import './src/i18n'; // Initialize i18n
import Header from './src/components/Header';
import DashboardScreen from './src/screens/DashboardScreen';
import PlaceholderScreen from './src/screens/PlaceholderScreen';
import UsersScreen from './src/screens/UsersScreen';
import PipelineScreen from './src/screens/PipelineScreen';
import { BottomNavBar, TabType } from './src/components/BottomNavBar';

import RevenueForecastScreen from './src/screens/RevenueForecastScreen';
import ClientInsightsScreen from './src/screens/ClientInsightsScreen';

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>('key');
  const [fadeAnim] = useState(new Animated.Value(1));

  const handleTabChange = (tabId: TabType) => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      })
    ]).start();
    setActiveTab(tabId);
  };

  const renderScreen = () => {
    switch (activeTab) {
      case 'key':
        return <DashboardScreen onNavigate={setActiveTab} />;
      case 'users':
        return <UsersScreen />;
      case 'pie':
        return <PipelineScreen />;
      case 'bar':
        return <RevenueForecastScreen />;
      case 'lightbulb':
        return <ClientInsightsScreen />;
      case 'add_lead':
        return <PlaceholderScreen title={t('placeholders.addNewLead', 'Add New Lead')} />;
      case 'total_leads':
        return <PlaceholderScreen title={t('placeholders.totalLeads', 'Total Leads Details')} />;
      case 'conversion_rate':
        return <PlaceholderScreen title={t('placeholders.conversionRate', 'Conversion Rate Details')} />;
      case 'revenue_growth':
        return <PlaceholderScreen title={t('placeholders.revenueGrowth', 'Revenue Growth Details')} />;
      case 'notifications':
        return <PlaceholderScreen title={t('placeholders.notifications', 'Notifications')} />;
      case 'settings':
        return <PlaceholderScreen title={t('placeholders.settings', 'Settings')} />;
      case 'sort':
        return <PlaceholderScreen title={t('placeholders.filterSort', 'Filter & Sort')} />;
      default:
        return <DashboardScreen onNavigate={setActiveTab} />;
    }
  };

  const getHeaderTitle = () => {
    if (activeTab === 'users') {
      return t('header.aiLeadIntelligence', 'AI Lead Intelligence');
    }
    if (activeTab === 'pie') {
      return t('header.pipelineOverview', 'Pipeline Overview');
    }
    if (activeTab === 'bar') {
      return t('header.revenueForecast', 'Revenue Forecast');
    }
    if (activeTab === 'lightbulb') {
      return t('header.clientInsights', 'Client Insights');
    }
    return t('header.aiClientOverview', 'AI Client Overview');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header title={getHeaderTitle()} onNavigate={setActiveTab} />
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        {renderScreen()}
      </Animated.View>
      <BottomNavBar activeTab={activeTab} onTabChange={handleTabChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});

export default App;
