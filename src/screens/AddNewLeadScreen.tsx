import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { ThemeColors } from '../constants/colors';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../hooks/useCurrency';

interface AddNewLeadScreenProps {
  onCancel: () => void;
  onSave: () => void;
}

const AddNewLeadScreen: React.FC<AddNewLeadScreenProps> = ({ onCancel, onSave }) => {
  const { colors, isDark } = useTheme();
  const { t } = useTranslation();
  const currency = useCurrency();
  const styles = getStyles(colors, isDark);

  const [leadName, setLeadName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [expectedValue, setExpectedValue] = useState('');

  const handleCurrencyChange = (text: string) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    
    if (!numericValue) {
      setExpectedValue('');
      return;
    }

    const currencyCode = currency === '₹' ? 'INR' : 'USD';
    const formatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currencyCode,
      maximumFractionDigits: 0,
    });

    const formattedValue = formatter.format(Number(numericValue));
    setExpectedValue(formattedValue);
  };

  const handleSave = () => {
    // In a real app, this would submit the data to an API
    onSave();
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        
        <View style={styles.headerContainer}>
          <Text style={styles.title}>{t('addLead.title', 'Add New Lead')}</Text>
          <Text style={styles.subtitle}>{t('addLead.subtitle', 'Enter the details of your new prospect')}</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('addLead.leadName', 'Lead Name')}</Text>
            <TextInput
              style={styles.input}
              placeholder={t('addLead.leadNamePlaceholder', 'John Doe')}
              placeholderTextColor={colors.textMuted}
              value={leadName}
              onChangeText={setLeadName}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('addLead.companyName', 'Company Name')}</Text>
            <TextInput
              style={styles.input}
              placeholder={t('addLead.companyNamePlaceholder', 'Acme Corp')}
              placeholderTextColor={colors.textMuted}
              value={companyName}
              onChangeText={setCompanyName}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('addLead.email', 'Email Address')}</Text>
            <TextInput
              style={styles.input}
              placeholder={t('addLead.emailPlaceholder', 'john@example.com')}
              placeholderTextColor={colors.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('addLead.expectedValue', { currency, defaultValue: `Expected Value (${currency})` })}</Text>
            <TextInput
              style={styles.input}
              placeholder={t('addLead.expectedValuePlaceholder', { currency, defaultValue: `${currency} 10,000` })}
              placeholderTextColor={colors.textMuted}
              value={expectedValue}
              onChangeText={handleCurrencyChange}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel} activeOpacity={0.8}>
              <Text style={styles.cancelButtonText}>{t('common.cancel', 'Cancel')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.primaryButton} onPress={handleSave} activeOpacity={0.8}>
              <Text style={styles.primaryButtonText}>{t('addLead.save', 'Save Lead')}</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const getStyles = (colors: ThemeColors, isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 100,
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
  },
  headerContainer: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  formContainer: {
    gap: 20,
    backgroundColor: colors.cardBackground,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.03,
    shadowRadius: 20,
    elevation: 3,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: colors.textPrimary,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  primaryButton: {
    flex: 1.5,
    backgroundColor: colors.primary,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: isDark ? '#111318' : '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default AddNewLeadScreen;
