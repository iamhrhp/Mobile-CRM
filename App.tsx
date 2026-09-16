import React, { useState, useEffect } from 'react';
import { StyleSheet, View, StatusBar, Animated, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { ThemeColors } from './src/constants/colors';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import './src/i18n'; // Initialize i18n
import Header from './src/components/Header';
import DashboardScreen from './src/screens/DashboardScreen';
import PlaceholderScreen from './src/screens/PlaceholderScreen';
import FilterSortScreen from './src/screens/FilterSortScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import UsersScreen from './src/screens/UsersScreen';
import AddNewLeadScreen from './src/screens/AddNewLeadScreen';
import PipelineScreen from './src/screens/PipelineScreen';
import { BottomNavBar, TabType } from './src/components/BottomNavBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RevenueForecastScreen from './src/screens/RevenueForecastScreen';
import ClientInsightsScreen from './src/screens/ClientInsightsScreen';
import SkeletonScreen from './src/screens/SkeletonScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import TotalLeadsScreen from './src/screens/TotalLeadsScreen';
import ConversionRateScreen from './src/screens/ConversionRateScreen';
import RevenueGrowthScreen from './src/screens/RevenueGrowthScreen';
import LeadDetailsScreen from './src/screens/LeadDetailsScreen';

function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

function AppContent() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { isDark, colors } = useTheme();
  
  const [activeTab, setActiveTab] = useState<TabType>('key');
  const [previousTab, setPreviousTab] = useState<TabType>('key');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(1));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authScreen, setAuthScreen] = useState<'login' | 'signup'>('login');
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  const styles = getStyles(colors);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const value = await AsyncStorage.getItem('@auth_token');
        if (value !== null) {
          setIsAuthenticated(true);
        }
      } catch (e) {
        // error reading value
      } finally {
        setIsAuthLoading(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogin = async (email?: string, password?: string) => {
    // Basic hardcoded validation or Google sign-in (if empty)
    if (email && password) {
      if (email !== 'test@gmail.com' || password !== 'test123') {
        Alert.alert('Login Failed', 'Incorrect email or password. Please use test@gmail.com and test123.');
        return;
      }
    }
    
    try {
      await AsyncStorage.setItem('@auth_token', 'dummy_token');
      setIsAuthenticated(true);
    } catch (e) {
      // error saving value
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('@auth_token');
      setIsAuthenticated(false);
      setAuthScreen('login');
      setActiveTab('key');
    } catch (e) {
      // error removing value
    }
  };

  const handleTabChange = (tabId: TabType) => {
    if (tabId === activeTab) return;
    setPreviousTab(activeTab);
    setIsTransitioning(true);

    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      })
    ]).start(() => {
      // Once the animation finishes entirely, remove the skeleton and render the heavy screen.
      // This prevents the JS thread from blocking the animation frames!
      setTimeout(() => setIsTransitioning(false), 50);
    });
    
    // We swap the active tab exactly in the middle of the rapid crossfade
    setTimeout(() => {
      setActiveTab(tabId);
    }, 50);
  };

  const renderScreen = () => {
    if (isTransitioning) {
      return <SkeletonScreen tabId={activeTab} />;
    }

    switch (activeTab) {
      case 'key':
        return <DashboardScreen onNavigate={handleTabChange} />;
      case 'sort':
        return <FilterSortScreen onApply={() => handleTabChange(previousTab)} />;
      case 'users':
        return <UsersScreen onNavigate={handleTabChange} />;
      case 'pie':
        return <PipelineScreen onNavigate={handleTabChange} onSelectLead={setSelectedLeadId} />;
      case 'lead_details':
        return <LeadDetailsScreen leadId={selectedLeadId} />;
      case 'bar':
        return <RevenueForecastScreen />;
      case 'lightbulb':
        return <ClientInsightsScreen />;
      case 'add_lead':
        return <AddNewLeadScreen onCancel={() => handleTabChange(previousTab)} onSave={() => handleTabChange(previousTab)} />;
      case 'total_leads':
        return <TotalLeadsScreen onHideHeader={setIsHeaderHidden} />;
      case 'conversion_rate':
        return <ConversionRateScreen />;
      case 'revenue_growth':
        return <RevenueGrowthScreen />;
      case 'notifications':
        return <NotificationsScreen />;
      case 'settings':
        return <SettingsScreen onLogout={handleLogout} />;
      case 'sort':
        return <PlaceholderScreen title={t('placeholders.filterSort', 'Filter & Sort')} />;
      default:
        return <DashboardScreen onNavigate={handleTabChange} />;
    }
  };

  const getHeaderTitle = () => {
    switch (activeTab) {
      case 'key': return t('header.dashboard', 'Dashboard');
      case 'users': return t('header.aiLeadIntelligence', 'AI Lead Intelligence');
      case 'pie': return t('header.pipelineOverview', 'Pipeline Overview');
      case 'bar': return t('header.revenueForecast', 'Revenue Forecast');
      case 'lightbulb': return t('header.clientInsights', 'Client Insights');
      case 'settings': return t('header.settings', 'Settings');
      case 'total_leads': return t('header.totalLeads', 'Total Leads');
      case 'conversion_rate': return t('header.conversionRate', 'Conversion Rate');
      case 'revenue_growth': return t('header.revenueGrowth', 'Revenue Growth');
      default: return '';
    }
  };

  if (isAuthLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!isAuthenticated) {
    if (authScreen === 'login') {
      return (
        <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
          <LoginScreen onLogin={handleLogin} onNavigateSignUp={() => setAuthScreen('signup')} />
        </View>
      );
    }
    return (
      <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <SignUpScreen onSignUp={handleLogin} onNavigateLogin={() => setAuthScreen('login')} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
      {!isHeaderHidden && (
        <Header 
          title={getHeaderTitle()} 
          onNavigate={handleTabChange} 
          showBack={!['key', 'users', 'pie', 'bar', 'lightbulb'].includes(activeTab)} 
          onBack={() => handleTabChange(previousTab)} 
        />
      )}
      <Animated.View style={{ flex: 1, opacity: fadeAnim, backgroundColor: colors.background }}>
        {renderScreen()}
      </Animated.View>
      <BottomNavBar activeTab={activeTab} onTabChange={handleTabChange} />
    </View>
  );
}

const getStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});

export default App;
