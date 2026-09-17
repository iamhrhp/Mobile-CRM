import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { changeLanguage } from '../i18n';
import { ThemeColors } from '../constants/colors';
import { useTheme } from '../context/ThemeContext';
import { XIcon } from './icons/Icons';

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi (हिन्दी)' },
  { code: 'te', name: 'Telugu (తెలుగు)' },
  { code: 'ta', name: 'Tamil (தமிழ்)' },
  { code: 'gu', name: 'Gujarati (ગુજરાતી)' },
  { code: 'it', name: 'Italian (Italiano)' },
  { code: 'fr', name: 'French (Français)' },
  { code: 'ar', name: 'Arabic (العربية)' },
  { code: 'ml', name: 'Malayalam (മലയാളം)' }
];

interface LanguageSwitcherProps {
  customTrigger?: (onPress: () => void, currentCode: string) => React.ReactNode;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ customTrigger }) => {
  const { i18n } = useTranslation();
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors, isDark);
  const [modalVisible, setModalVisible] = useState(false);

  const currentLang = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

  const handleSelect = async (code: string) => {
    setModalVisible(false);
    await changeLanguage(code);
  };

  return (
    <>
      {customTrigger ? (
        customTrigger(() => setModalVisible(true), currentLang.code)
      ) : (
        <TouchableOpacity 
          style={styles.triggerButton} 
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.triggerText}>{currentLang.code.toUpperCase()}</Text>
        </TouchableOpacity>
      )}

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Language</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                <XIcon size={14} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.list}>
              {LANGUAGES.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.langItem,
                    i18n.language === lang.code && styles.langItemActive
                  ]}
                  onPress={() => handleSelect(lang.code)}
                >
                  <Text style={[
                    styles.langText,
                    i18n.language === lang.code && styles.langTextActive
                  ]}>
                    {lang.name}
                  </Text>
                </TouchableOpacity>
              ))}
              <View style={styles.brandingContainer}>
                <Text style={styles.brandingText}>Parvej CRM</Text>
              </View>
            </ScrollView>
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
};

const getStyles = (colors: ThemeColors, isDark: boolean) => StyleSheet.create({
  triggerButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  triggerText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  closeButton: {
    padding: 8,
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
  },
  list: {
    paddingBottom: 20,
  },
  langItem: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  langItemActive: {
    backgroundColor: isDark ? colors.secondaryBackground : '#FFFFFF',
    shadowColor: isDark ? 'transparent' : '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: isDark ? 0 : 2,
    borderRadius: 12,
    borderBottomWidth: 0,
  },
  langText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  langTextActive: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  brandingContainer: {
    paddingTop: 30,
    paddingBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandingText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: 1,
    textTransform: 'uppercase',
  }
});

export default LanguageSwitcher;
