import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { changeLanguage } from '../i18n';
import colors from '../constants/colors';
import { XIcon } from './icons/Icons';

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi (हिन्दी)' },
  { code: 'te', name: 'Telugu (తెలుగు)' },
  { code: 'ta', name: 'Tamil (தமிழ்)' },
  { code: 'gu', name: 'Gujarati (ગુજરાતી)' },
  { code: 'bn', name: 'Bengali (বাংলা)' },
  { code: 'mr', name: 'Marathi (मराठी)' },
  { code: 'pa', name: 'Punjabi (ਪੰਜਾਬੀ)' },
  { code: 'ur', name: 'Urdu (اردو)' },
  { code: 'ar', name: 'Arabic (العربية)' }
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);

  const currentLang = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

  const handleSelect = async (code: string) => {
    setModalVisible(false);
    await changeLanguage(code);
  };

  return (
    <>
      <TouchableOpacity 
        style={styles.triggerButton} 
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.triggerText}>{currentLang.code.toUpperCase()}</Text>
      </TouchableOpacity>

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
            </ScrollView>
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
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
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  langItemActive: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    borderBottomWidth: 0,
    paddingHorizontal: 16,
  },
  langText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  langTextActive: {
    color: colors.primary,
    fontWeight: '700',
  }
});

export default LanguageSwitcher;
