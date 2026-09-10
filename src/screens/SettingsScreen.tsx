import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Pressable, I18nManager } from 'react-native';
import { ThemeColors } from '../constants/colors';
import { LogOutIcon } from '../components/icons/LogOutIcon';
import { CheckCircleIcon } from '../components/icons/Icons';
import ThemeEmojiOverlay, { ThemeEmojiOverlayRef } from '../components/ThemeEmojiOverlay';
import { useTheme, ThemeType } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';

interface SettingsScreenProps {
  onLogout: () => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onLogout }) => {
  const { colors, theme, setTheme } = useTheme();
  const { t } = useTranslation();
  const styles = getStyles(colors);
  
  const [isThemeModalVisible, setThemeModalVisible] = React.useState(false);
  const [isLogoutModalVisible, setLogoutModalVisible] = React.useState(false);
  
  const emojiOverlayRef = React.useRef<ThemeEmojiOverlayRef>(null);

  const selectTheme = (newTheme: ThemeType) => {
    setTheme(newTheme);
    setThemeModalVisible(false);
    
    if (newTheme === 'light') {
      emojiOverlayRef.current?.playAnimation('☀️');
    } else if (newTheme === 'dark') {
      emojiOverlayRef.current?.playAnimation('🌙');
    }
  };

  return (
    <>
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('settings.account', 'Account')}</Text>
        
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.textContainer}>
              <Text style={styles.rowTitle}>{t('settings.profileInfo', 'Profile Information')}</Text>
              <Text style={styles.rowSubtitle}>{t('settings.updateProfile', 'Update your name and email')}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <View style={styles.textContainer}>
              <Text style={styles.rowTitle}>{t('settings.passwordSecurity', 'Password & Security')}</Text>
              <Text style={styles.rowSubtitle}>{t('settings.manageSecurity', 'Manage your security settings')}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('settings.preferences', 'Preferences')}</Text>
        
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.textContainer}>
              <Text style={styles.rowTitle}>{t('settings.notifications', 'Notifications')}</Text>
              <Text style={styles.rowSubtitle}>{t('settings.emailPush', 'Email and push notifications')}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <TouchableOpacity activeOpacity={0.7} style={styles.row} onPress={() => setThemeModalVisible(true)}>
            <View style={styles.textContainer}>
              <Text style={styles.rowTitle}>{t('settings.theme', 'Theme')}</Text>
              <Text style={styles.rowSubtitle}>
                {theme === 'system' ? t('settings.systemDefault', 'System Default') : theme === 'dark' ? t('settings.darkMode', 'Dark Mode') : t('settings.lightMode', 'Light Mode')}
              </Text>
            </View>
          </TouchableOpacity>
          <View style={styles.divider} />
          <View style={[styles.row, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
            <View style={styles.textContainer}>
              <Text style={styles.rowTitle}>{t('settings.language', 'Language')}</Text>
              <Text style={styles.rowSubtitle}>{t('settings.changeLanguage', 'Change application language')}</Text>
            </View>
            <LanguageSwitcher />
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={() => setLogoutModalVisible(true)} activeOpacity={0.8}>
        <LogOutIcon size={20} color={colors.danger} />
        <Text style={styles.logoutText}>{t('settings.logout', 'Log Out')}</Text>
      </TouchableOpacity>
      
      <Text style={styles.versionText}>{t('settings.version', 'Version 1.0.0')}</Text>
    </ScrollView>

    {/* Theme Selection Bottom Sheet */}
    <Modal
      visible={isThemeModalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setThemeModalVisible(false)}
    >
      <Pressable style={styles.modalOverlay} onPress={() => setThemeModalVisible(false)}>
        <View style={styles.bottomSheet} onStartShouldSetResponder={() => true}>
          <View style={styles.sheetHandle} />
          <Text style={styles.sheetTitle}>{t('settings.theme', 'Theme')}</Text>
          
          <TouchableOpacity style={styles.sheetOption} onPress={() => selectTheme('system')}>
            <Text style={[styles.sheetOptionText, theme === 'system' && styles.sheetOptionTextActive]}>
              {t('settings.systemDefault', 'System Default')}
            </Text>
            {theme === 'system' && <CheckCircleIcon size={24} color={colors.primary} />}
          </TouchableOpacity>
          <View style={styles.sheetDivider} />
          
          <TouchableOpacity style={styles.sheetOption} onPress={() => selectTheme('light')}>
            <Text style={[styles.sheetOptionText, theme === 'light' && styles.sheetOptionTextActive]}>
              {t('settings.lightMode', 'Light Mode')}
            </Text>
            {theme === 'light' && <CheckCircleIcon size={24} color={colors.primary} />}
          </TouchableOpacity>
          <View style={styles.sheetDivider} />
          
          <TouchableOpacity style={styles.sheetOption} onPress={() => selectTheme('dark')}>
            <Text style={[styles.sheetOptionText, theme === 'dark' && styles.sheetOptionTextActive]}>
              {t('settings.darkMode', 'Dark Mode')}
            </Text>
            {theme === 'dark' && <CheckCircleIcon size={24} color={colors.primary} />}
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>

    {/* Logout Confirmation Bottom Sheet */}
    <Modal
      visible={isLogoutModalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setLogoutModalVisible(false)}
    >
      <Pressable style={styles.modalOverlay} onPress={() => setLogoutModalVisible(false)}>
        <View style={styles.bottomSheet} onStartShouldSetResponder={() => true}>
          <View style={styles.sheetHandle} />
          <Text style={styles.sheetTitle}>{t('settings.logoutConfirm', 'Are you sure you want to log out?')}</Text>
          
          <View style={styles.sheetActions}>
            <TouchableOpacity 
              style={[styles.sheetButton, styles.sheetButtonCancel]} 
              onPress={() => setLogoutModalVisible(false)}
            >
              <Text style={styles.sheetButtonCancelText}>{t('common.no', 'No')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.sheetButton, styles.sheetButtonConfirm]} 
              onPress={() => {
                setLogoutModalVisible(false);
                onLogout();
              }}
            >
              <Text style={styles.sheetButtonConfirmText}>{t('common.yes', 'Yes')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Modal>

    <ThemeEmojiOverlay ref={emojiOverlayRef} />
    </>
  );
};

const getStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 24,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    alignSelf: 'flex-start',
  },
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  row: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    alignItems: 'flex-start',
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  rowSubtitle: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFEBEB',
    padding: 18,
    borderRadius: 16,
    marginTop: 24,
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF3B30',
  },
  versionText: {
    textAlign: 'center',
    marginTop: 32,
    fontSize: 13,
    color: colors.textMuted,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: colors.cardBackground,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40, // safe area padding
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 24,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 16,
    textAlign: 'center',
  },
  sheetOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  sheetOptionText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  sheetOptionTextActive: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  sheetDivider: {
    height: 1,
    backgroundColor: colors.border,
  },
  sheetActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  sheetButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetButtonCancel: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sheetButtonCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  sheetButtonConfirm: {
    backgroundColor: '#FFEBEB',
  },
  sheetButtonConfirmText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF3B30',
  }
});

export default SettingsScreen;
